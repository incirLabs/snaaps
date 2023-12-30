import {ecsign, stripHexPrefix, toBuffer} from '@ethereumjs/util';
import type {TypedDataV1, TypedMessage} from '@metamask/eth-sig-util';
import {
  SignTypedDataVersion,
  concatSig,
  personalSign,
  recoverPersonalSignature,
  signTypedData,
} from '@metamask/eth-sig-util';
import type {
  Keyring,
  KeyringAccount,
  KeyringRequest,
  SubmitRequestResponse,
  EthBaseTransaction,
  EthUserOperation,
  EthBaseUserOperation,
  EthUserOperationPatch,
} from '@metamask/keyring-api';
import {EthAccountType, EthMethod, emitSnapKeyringEvent} from '@metamask/keyring-api';
import {KeyringEvent} from '@metamask/keyring-api/dist/events';
import {hexToBigInt, type Json, type JsonRpcRequest} from '@metamask/utils';
import {v4 as uuid} from 'uuid';
import type {Hex} from 'viem';
import {signUserOperationHashWithECDSA} from 'permissionless';
import {privateKeyToAccount} from 'viem/accounts';

// eslint-disable-next-line @typescript-eslint/no-shadow
import {Buffer} from 'buffer';

import {saveState} from './stateManagement';
import {isEvmChain, isUniqueAddress, throwError} from './util';
import {PimlicoClient} from './pimlico';
import {createExecuteCall} from './callData';
import {fillMMBaseUserOp} from './userOp';

export type KeyringState = {
  wallets: Record<string, Wallet>;
  pendingRequests: Record<string, KeyringRequest>;
};

export type Wallet = {
  account: KeyringAccount;
  privateKey: string;
};

export class SimpleKeyring implements Keyring {
  #state: KeyringState;

  constructor(state: KeyringState) {
    this.#state = state;
  }

  async listAccounts(): Promise<KeyringAccount[]> {
    return Object.values(this.#state.wallets).map((wallet) => wallet.account);
  }

  async getAccount(id: string): Promise<KeyringAccount> {
    return this.#state.wallets[id]?.account ?? throwError(`Account '${id}' not found`);
  }

  async createAccount(options: Record<string, Json> = {}): Promise<KeyringAccount> {
    console.log('HERE !!!! 1');

    const address = options?.address as string;
    const privateKey = options?.privateKey as string;

    if (!isUniqueAddress(address, Object.values(this.#state.wallets))) {
      throw new Error(`Account address already in use: ${address}`);
    }
    console.log('HERE !!!! 2');

    // The private key should not be stored in the account options since the
    // account object is exposed to external components, such as MetaMask and
    // the snap UI.
    if (options?.privateKey) {
      // eslint-disable-next-line no-param-reassign
      delete options.privateKey;
    }

    console.log('HERE !!!! 3');

    try {
      const account: KeyringAccount = {
        id: uuid(),
        options,
        address,
        methods: [
          EthMethod.PersonalSign,
          EthMethod.Sign,
          EthMethod.SignTypedDataV1,
          EthMethod.SignTypedDataV3,
          EthMethod.SignTypedDataV4,

          // ERC-4337
          EthMethod.PrepareUserOperation,
          EthMethod.PatchUserOperation,
          EthMethod.SignUserOperation,
        ],
        type: EthAccountType.Erc4337,
      };
      console.log('HERE !!!! 4', account);

      await this.#emitEvent(KeyringEvent.AccountCreated, {
        account: JSON.parse(JSON.stringify(account)),
      });
      console.log('HERE !!!! 5');

      this.#state.wallets[account.id] = {account, privateKey};

      console.log('HERE !!!! 6');
      await this.#saveState();
      console.log('HERE !!!! 7');
      console.log('HERE !!!! 8', account);
      return account;
    } catch (error) {
      console.log('HERE !!!! 9');
      console.log(error);
      throw new Error((error as Error).message);
    }
  }

  async filterAccountChains(_id: string, chains: string[]): Promise<string[]> {
    // The `id` argument is not used because all accounts created by this snap
    // are expected to be compatible with any EVM chain.
    return chains.filter((chain) => isEvmChain(chain));
  }

  async updateAccount(account: KeyringAccount): Promise<void> {
    const wallet =
      this.#state.wallets[account.id] ?? throwError(`Account '${account.id}' not found`);

    const newAccount: KeyringAccount = {
      ...wallet.account,
      ...account,
      // Restore read-only properties.
      address: wallet.account.address,
    };

    try {
      await this.#emitEvent(KeyringEvent.AccountUpdated, {
        account: newAccount,
      });
      wallet.account = newAccount;
      await this.#saveState();
    } catch (error) {
      throwError((error as Error).message);
    }
  }

  async deleteAccount(id: string): Promise<void> {
    try {
      await this.#emitEvent(KeyringEvent.AccountDeleted, {id});
      delete this.#state.wallets[id];
      await this.#saveState();
    } catch (error) {
      throwError((error as Error).message);
    }
  }

  async listRequests(): Promise<KeyringRequest[]> {
    return Object.values(this.#state.pendingRequests);
  }

  async getRequest(id: string): Promise<KeyringRequest> {
    return this.#state.pendingRequests[id] ?? throwError(`Request '${id}' not found`);
  }

  async submitRequest(request: KeyringRequest): Promise<SubmitRequestResponse> {
    const res = this.#syncSubmitRequest(request);

    return res;
  }

  async approveRequest(id: string): Promise<void> {
    const {request} = this.#state.pendingRequests[id] ?? throwError(`Request '${id}' not found`);

    const result = await this.#handleSigningRequest(request.method, request.params ?? []);

    await this.#removePendingRequest(id);
    await this.#emitEvent(KeyringEvent.RequestApproved, {id, result});
  }

  async rejectRequest(id: string): Promise<void> {
    if (this.#state.pendingRequests[id] === undefined) {
      throw new Error(`Request '${id}' not found`);
    }

    await this.#removePendingRequest(id);
    await this.#emitEvent(KeyringEvent.RequestRejected, {id});
  }

  async #removePendingRequest(id: string): Promise<void> {
    delete this.#state.pendingRequests[id];
    await this.#saveState();
  }

  async #syncSubmitRequest(request: KeyringRequest): Promise<SubmitRequestResponse> {
    const {method, params = []} = request.request as JsonRpcRequest;

    const signature = await this.#handleSigningRequest(method, params);

    return {
      pending: false,
      result: signature,
    };
  }

  #getWalletByAddress(address: string): Wallet {
    const match = Object.values(this.#state.wallets).find(
      (wallet) => wallet.account.address.toLowerCase() === address.toLowerCase(),
    );

    return match ?? throwError(`Account '${address}' not found`);
  }

  async #handleSigningRequest(method: string, params: Json): Promise<Json> {
    switch (method) {
      case EthMethod.PrepareUserOperation: {
        const [txs] = params as [EthBaseTransaction[]];
        return this.#prepareUserOperation(txs);
      }

      case EthMethod.PatchUserOperation: {
        const [userOp] = params as [EthUserOperation];
        return this.#preparePaymasterAndData(userOp);
      }

      case EthMethod.SignUserOperation: {
        const [userOp, entryPoint] = params as [EthUserOperation, string];
        return this.#signUserOperation(userOp, entryPoint);
      }

      case EthMethod.PersonalSign: {
        const [message, from] = params as [string, string];
        return this.#signPersonalMessage(from, message);
      }

      case EthMethod.SignTypedDataV1: {
        const [from, data] = params as [string, Json];
        return this.#signTypedData(from, data, {
          version: SignTypedDataVersion.V1,
        });
      }

      case EthMethod.SignTypedDataV3: {
        const [from, data] = params as [string, Json];
        return this.#signTypedData(from, data, {
          version: SignTypedDataVersion.V3,
        });
      }

      case EthMethod.SignTypedDataV4: {
        const [from, data] = params as [string, Json];
        return this.#signTypedData(from, data, {
          version: SignTypedDataVersion.V4,
        });
      }

      case EthMethod.Sign: {
        const [from, data] = params as [string, string];
        return this.#signMessage(from, data);
      }

      default: {
        throw new Error(`EVM method '${method}' not supported`);
      }
    }
  }

  #signTypedData(
    from: string,
    data: Json,
    opts: {version: SignTypedDataVersion} = {
      version: SignTypedDataVersion.V1,
    },
  ): string {
    const {privateKey} = this.#getWalletByAddress(from);
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');

    return signTypedData({
      privateKey: privateKeyBuffer,
      data: data as unknown as TypedDataV1 | TypedMessage<any>,
      version: opts.version,
    });
  }

  #signPersonalMessage(from: string, request: string): string {
    const {privateKey} = this.#getWalletByAddress(from);
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');
    const messageBuffer = Buffer.from(request.slice(2), 'hex');

    const signature = personalSign({
      privateKey: privateKeyBuffer,
      data: messageBuffer,
    });

    const recoveredAddress = recoverPersonalSignature({
      data: messageBuffer,
      signature,
    });
    if (recoveredAddress !== from) {
      throw new Error(
        `Signature verification failed for account '${from}' (got '${recoveredAddress}')`,
      );
    }

    return signature;
  }

  #signMessage(from: string, data: string): string {
    const {privateKey} = this.#getWalletByAddress(from);
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');
    const message = stripHexPrefix(data);
    const signature = ecsign(Buffer.from(message, 'hex'), privateKeyBuffer);
    return concatSig(toBuffer(signature.v), signature.r, signature.s);
  }

  #prepareUserOperation(txs: EthBaseTransaction[]): EthBaseUserOperation {
    if (txs.length !== 1 || !txs[0]) {
      throw new Error('Only one transaction per user operation is supported');
    }

    const [tx] = txs;

    // nonce, user tx disinda

    return fillMMBaseUserOp({
      callData: createExecuteCall(tx.to as Hex, hexToBigInt(tx.value), tx.data as Hex),
    });
  }

  async #preparePaymasterAndData(userOp: EthUserOperation): Promise<EthUserOperationPatch> {
    const pimlico = new PimlicoClient('goerli');

    const sponsoredUserOp = await pimlico.getSponsoredUserOp({
      callData: userOp.callData as Hex,
      callGasLimit: hexToBigInt(userOp.callGasLimit),
      initCode: userOp.initCode as Hex,
      nonce: hexToBigInt(userOp.nonce),
      preVerificationGas: hexToBigInt(userOp.preVerificationGas),
      sender: userOp.sender as Hex,
      verificationGasLimit: hexToBigInt(userOp.verificationGasLimit),
      maxFeePerGas: hexToBigInt(userOp.maxFeePerGas),
      maxPriorityFeePerGas: hexToBigInt(userOp.maxPriorityFeePerGas),
      paymasterAndData: userOp.paymasterAndData as Hex,
      signature: userOp.signature as Hex,
    });

    return sponsoredUserOp;
  }

  async #signUserOperation(userOp: EthUserOperation, entryPoint: string): Promise<Hex> {
    const signature = await signUserOperationHashWithECDSA({
      account: privateKeyToAccount(this.#getWalletByAddress(userOp.sender).privateKey as Hex),
      userOperation: {
        callData: userOp.callData as Hex,
        callGasLimit: hexToBigInt(userOp.callGasLimit),
        initCode: userOp.initCode as Hex,
        nonce: hexToBigInt(userOp.nonce),
        preVerificationGas: hexToBigInt(userOp.preVerificationGas),
        sender: userOp.sender as Hex,
        verificationGasLimit: hexToBigInt(userOp.verificationGasLimit),
        maxFeePerGas: hexToBigInt(userOp.maxFeePerGas),
        maxPriorityFeePerGas: hexToBigInt(userOp.maxPriorityFeePerGas),
        paymasterAndData: userOp.paymasterAndData as Hex,
        signature: userOp.signature as Hex,
      },
      chainId: 5,
      entryPoint: entryPoint as Hex,
    });

    return signature;
  }

  async #saveState(): Promise<void> {
    await saveState(this.#state);
  }

  async #emitEvent(event: KeyringEvent, data: Record<string, Json>): Promise<void> {
    await emitSnapKeyringEvent(snap, event, data);
  }
}
