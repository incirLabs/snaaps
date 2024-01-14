import {Common, Hardfork} from '@ethereumjs/common';
import {TransactionFactory} from '@ethereumjs/tx';
import {addHexPrefix, ecsign, stripHexPrefix, toBuffer} from '@ethereumjs/util';
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
} from '@metamask/keyring-api';
import {EthAccountType, EthMethod, emitSnapKeyringEvent} from '@metamask/keyring-api';
import {KeyringEvent} from '@metamask/keyring-api/dist/events';
import {hexToBigInt, hexToNumber, type Json, type JsonRpcRequest} from '@metamask/utils';
import type {SnapsGlobalObject} from '@metamask/snaps-types';
import {v4 as uuid} from 'uuid';
import type {Hex} from 'viem';

// eslint-disable-next-line @typescript-eslint/no-shadow
import {Buffer} from 'buffer';

import {saveState} from './stateManagement';
import {
  isEvmChain,
  serializeTransaction,
  isUniqueAddress,
  throwError,
  numberToHexString,
} from './util';
import {PimlicoClient, SupportedChains} from './pimlico';
import {createGetNonceCall} from './callData';
import {logger} from './logger';
import {privateKeyToAddress, getSignerPrivateKey} from './privateKeyUtil';

export type KeyringState = {
  wallets: Record<string, Wallet>;
  pendingRequests: Record<string, KeyringRequest>;
};

export type Wallet = {
  account: KeyringAccount;
  signerAddress: string;
  signerPrivateKey: string;
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
    const address = options?.address as string;
    const signerIndex = options?.signerIndex as number;

    if (signerIndex === undefined) {
      throw new Error(`signerIndex is required`);
    }

    const signerPrivateKey = await getSignerPrivateKey(signerIndex);
    const signerAddress = await privateKeyToAddress(signerPrivateKey);

    if (!isUniqueAddress(address, Object.values(this.#state.wallets))) {
      throw new Error(`Account address already in use: ${address}`);
    }

    // The private key should not be stored in the account options since the
    // account object is exposed to external components, such as MetaMask and
    // the snap UI.
    if (options?.privateKey) {
      // eslint-disable-next-line no-param-reassign
      delete options.privateKey;
    }

    try {
      const account: KeyringAccount = {
        id: uuid(),
        options,
        address,
        methods: [
          EthMethod.PersonalSign,
          EthMethod.Sign,
          EthMethod.SignTransaction,
          EthMethod.SignTypedDataV1,
          EthMethod.SignTypedDataV3,
          EthMethod.SignTypedDataV4,
        ],
        type: EthAccountType.Eip4337,
      };
      await this.#emitEvent(KeyringEvent.AccountCreated, {account});
      this.#state.wallets[account.id] = {
        account,
        signerAddress,
        signerPrivateKey: stripHexPrefix(signerPrivateKey),
      };
      await this.#saveState();
      return account;
    } catch (error) {
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
      case EthMethod.PersonalSign: {
        const [message, from] = params as [string, string];
        return this.#signPersonalMessage(from, message);
      }

      case EthMethod.SignTransaction: {
        const [tx] = params as [any];
        return this.#signTransaction(tx);
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

  async #signTransaction(tx: any): Promise<Json> {
    // eslint-disable-next-line no-param-reassign
    tx.chainId = numberToHexString(tx.chainId);

    const wallet = this.#getWalletByAddress(tx.from);
    const privateKey = Buffer.from(wallet.signerPrivateKey, 'hex');
    const common = Common.custom(
      {chainId: tx.chainId},
      {
        hardfork: tx.maxPriorityFeePerGas || tx.maxFeePerGas ? Hardfork.London : Hardfork.Istanbul,
      },
    );

    const signedTx = TransactionFactory.fromTxData(tx, {
      common,
    }).sign(privateKey);

    const serialized: any = serializeTransaction(signedTx.toJSON(), signedTx.type);

    try {
      const currentChain = (Object.keys(SupportedChains) as SupportedChains[]).find(
        (chainName) => SupportedChains[chainName].id === hexToNumber(tx.chainId),
      );

      if (!currentChain) {
        throw new Error('Unsupported chain');
      }

      const pimlico = new PimlicoClient(currentChain);

      const nonce = await ethereum.request({
        method: 'eth_call',
        params: [{to: wallet.account.address, data: createGetNonceCall()}, 'latest'],
      });

      const userOp = await pimlico.generateUserOp(
        wallet.account.address as Hex,
        serialized.to,
        hexToBigInt(serialized.value),
        serialized.data,
        hexToBigInt(nonce as Hex),
      );

      const sponsoredUserOp = await pimlico.getSponsoredUserOp(userOp);

      const signedUserOp = await pimlico.signUserOp(
        addHexPrefix(wallet.signerPrivateKey),
        sponsoredUserOp,
      );

      const userOpHash = await pimlico.sendUserOp(signedUserOp);

      const {receipt, txHash} = await pimlico.getReceipt(userOpHash);

      logger.debug(
        'Receipt',
        JSON.stringify(
          receipt,
          (_key, value) => (typeof value === 'bigint' ? value.toString() : value),
          2,
        ),
      );
      logger.debug('Transaction Hash', txHash);

      return serialized;
    } catch (err) {
      logger.error('Error on bundler', err);
      return {};
    }
  }

  #signTypedData(
    from: string,
    data: Json,
    opts: {version: SignTypedDataVersion} = {
      version: SignTypedDataVersion.V1,
    },
  ): string {
    const {signerPrivateKey} = this.#getWalletByAddress(from);
    const privateKeyBuffer = Buffer.from(signerPrivateKey, 'hex');

    return signTypedData({
      privateKey: privateKeyBuffer,
      data: data as unknown as TypedDataV1 | TypedMessage<any>,
      version: opts.version,
    });
  }

  #signPersonalMessage(from: string, request: string): string {
    const {signerPrivateKey} = this.#getWalletByAddress(from);
    const privateKeyBuffer = Buffer.from(signerPrivateKey, 'hex');
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
    const {signerPrivateKey} = this.#getWalletByAddress(from);
    const privateKeyBuffer = Buffer.from(signerPrivateKey, 'hex');
    const message = stripHexPrefix(data);
    const signature = ecsign(Buffer.from(message, 'hex'), privateKeyBuffer);
    return concatSig(toBuffer(signature.v), signature.r, signature.s);
  }

  async #saveState(): Promise<void> {
    await saveState(this.#state);
  }

  async #emitEvent(event: KeyringEvent, data: Record<string, Json>): Promise<void> {
    await emitSnapKeyringEvent(snap as SnapsGlobalObject, event, data);
  }
}
