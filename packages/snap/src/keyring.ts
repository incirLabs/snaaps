import {Common, Hardfork} from '@ethereumjs/common';
import {TransactionFactory} from '@ethereumjs/tx';
import {
  Address,
  ecsign,
  stripHexPrefix,
  toBuffer,
  toChecksumAddress,
  isValidPrivate,
  addHexPrefix,
} from '@ethereumjs/util';
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
import {hexToBigInt, type Json, type JsonRpcRequest} from '@metamask/utils';
import {Buffer} from 'buffer';
import {v4 as uuid} from 'uuid';

import {saveState} from './stateManagement';
import {isEvmChain, serializeTransaction, isUniqueAddress, throwError, runSensitive} from './util';
import packageInfo from '../package.json';
import {generateUserOp, getReceipt, getSponsoredUserOp, sendUserOp, signUserOp} from './pimlico';
import {Hex} from 'viem';
import {Env} from 'common';

export type KeyringState = {
  wallets: Record<string, Wallet>;
  pendingRequests: Record<string, KeyringRequest>;
  useSyncApprovals: boolean;
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
    const address = options?.address as string;
    const privateKey = options?.privateKey as string;

    if (!isUniqueAddress(address, Object.values(this.#state.wallets))) {
      throw new Error(`Account address already in use: ${address}`);
    }
    // The private key should not be stored in the account options since the
    // account object is exposed to external components, such as MetaMask and
    // the snap UI.
    if (options?.privateKey) {
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
      this.#state.wallets[account.id] = {account, privateKey};
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
    console.log('submit request');

    const res = this.#state.useSyncApprovals
      ? this.#syncSubmitRequest(request)
      : this.#asyncSubmitRequest(request);

    console.log('submit res', await res);

    return await res;
  }

  async approveRequest(id: string): Promise<void> {
    const {request} = this.#state.pendingRequests[id] ?? throwError(`Request '${id}' not found`);

    const result = this.#handleSigningRequest(request.method, request.params ?? []);

    console.log('result', result);

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

  #getCurrentUrl(): string {
    const dappUrlPrefix =
      process.env.NODE_ENV === 'production'
        ? process.env.DAPP_ORIGIN_PRODUCTION
        : process.env.DAPP_ORIGIN_DEVELOPMENT;
    const dappVersion: string = packageInfo.version;

    // Ensuring that both dappUrlPrefix and dappVersion are truthy
    if (dappUrlPrefix && dappVersion && process.env.NODE_ENV === 'production') {
      return `${dappUrlPrefix}${dappVersion}/`;
    }
    // Default URL if dappUrlPrefix or dappVersion are falsy, or if URL construction fails
    return dappUrlPrefix as string;
  }

  async #asyncSubmitRequest(request: KeyringRequest): Promise<SubmitRequestResponse> {
    console.log('async request');

    this.#state.pendingRequests[request.id] = request;
    await this.#saveState();
    const dappUrl = this.#getCurrentUrl();
    return {
      pending: true,
      redirect: {
        url: dappUrl,
        message: 'Redirecting to Snap Simple Keyring to sign transaction',
      },
    };
  }

  async #syncSubmitRequest(request: KeyringRequest): Promise<SubmitRequestResponse> {
    const {method, params = []} = request.request as JsonRpcRequest;

    const signature = await this.#handleSigningRequest(method, params);

    console.log('signature', signature);

    return {
      pending: false,
      result: signature,
    };
  }

  #getWalletByAddress(address: string): Wallet {
    console.log('wallets', Object.values(this.#state.wallets));
    const match = Object.values(this.#state.wallets).find(
      (wallet) => wallet.account.address.toLowerCase() === address.toLowerCase(),
    );

    return match ?? throwError(`Account '${address}' not found`);
  }

  #getKeyPair(privateKey?: string): {
    privateKey: string;
    address: string;
  } {
    const privateKeyBuffer: Buffer = runSensitive(
      () =>
        privateKey
          ? toBuffer(addHexPrefix(privateKey))
          : Buffer.from(crypto.getRandomValues(new Uint8Array(32))),
      'Invalid private key',
    );

    if (!isValidPrivate(privateKeyBuffer)) {
      throw new Error('Invalid private key');
    }

    const address = toChecksumAddress(Address.fromPrivateKey(privateKeyBuffer).toString());
    return {privateKey: privateKeyBuffer.toString('hex'), address};
  }

  async #handleSigningRequest(method: string, params: Json): Promise<Json> {
    switch (method) {
      case EthMethod.PersonalSign: {
        const [message, from] = params as [string, string];
        return this.#signPersonalMessage(from, message);
      }

      case EthMethod.SignTransaction: {
        const [tx] = params as [any];
        const signedTx = await this.#signTransaction(tx);
        console.log('signedTx', signedTx);
        return signedTx;
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
    console.log('!!!!tx!!!!!', tx);
    // Patch the transaction to make sure that the `chainId` is a hex string.
    if (!tx.chainId.startsWith('0x')) {
      tx.chainId = `0x${parseInt(tx.chainId, 10).toString(16)}`;
    }

    const wallet = this.#getWalletByAddress(tx.from);
    const privateKey = Buffer.from(wallet.privateKey, 'hex');
    const common = Common.custom(
      {chainId: tx.chainId},
      {
        hardfork: tx.maxPriorityFeePerGas || tx.maxFeePerGas ? Hardfork.London : Hardfork.Istanbul,
      },
    );

    const signedTx = TransactionFactory.fromTxData(tx, {
      common,
    }).sign(privateKey);

    console.log('signed tx', signedTx, signedTx.toJSON(), signedTx.type);

    try {
      const serialized: any = serializeTransaction(signedTx.toJSON(), signedTx.type);

      console.log('serialized', serialized);

      const value = hexToBigInt(serialized.value);

      console.log('value', value);

      const userOp = await generateUserOp(
        wallet.account.address as Hex,
        serialized.to,
        value,
        serialized.data,
      );

      console.log('userOp', userOp);

      const sponsoredUserOp = await getSponsoredUserOp(userOp);

      console.log('sponsoredUserOp', sponsoredUserOp);

      const signedUserOp = await signUserOp(
        (wallet.privateKey.startsWith('0x') ? wallet.privateKey : `0x${wallet.privateKey}`) as Hex,
        sponsoredUserOp,
      );

      console.log('signedUserOp', signedUserOp);

      const userOpHash = await sendUserOp(signedUserOp);

      console.log('userOpHash', userOpHash);

      const {receipt, txHash} = await getReceipt(userOpHash);

      console.log('receipt', receipt, txHash);

      return serialized;
    } catch (err) {
      console.error(err);
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

  async #saveState(): Promise<void> {
    await saveState(this.#state);
  }

  async #emitEvent(event: KeyringEvent, data: Record<string, Json>): Promise<void> {
    await emitSnapKeyringEvent(snap, event, data);
  }

  async toggleSyncApprovals(): Promise<void> {
    this.#state.useSyncApprovals = !this.#state.useSyncApprovals;
    await this.#saveState();
  }

  isSynchronousMode(): boolean {
    return this.#state.useSyncApprovals;
  }
}
