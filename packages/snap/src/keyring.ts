import {ChainIdsToKeys, NetworksConfig} from 'common';
import {v4 as uuid} from 'uuid';
import {ecsign, stripHexPrefix, toBuffer} from '@ethereumjs/util';
import {
  concatSig,
  personalSign,
  recoverPersonalSignature,
  signTypedData,
  SignTypedDataVersion,
  type TypedDataV1,
  type TypedMessage,
} from '@metamask/eth-sig-util';
import {
  emitSnapKeyringEvent,
  EthAccountType,
  EthMethod,
  KeyringEvent,
  type Keyring,
  type KeyringAccount,
  type KeyringRequest,
  type SubmitRequestResponse,
  type EthBaseTransaction,
  type EthBaseUserOperation,
  type EthUserOperation,
  type EthUserOperationPatch,
} from '@metamask/keyring-api';
import {hexToNumber, type Json, type JsonRpcRequest} from '@metamask/utils';

import {saveState, type State} from './state';
import {
  getChainIdFromCAIP2Safe,
  getNetworkKeyFromCAIP2Safe,
  keccak256,
  numberToHexString,
  throwError,
} from './utils/helpers';
import {CreateAccountOptionsSchema, AccountOptionsSchema} from './utils/zod';
import {getSignerPrivateKey, privateKeyToAddress} from './utils/privateKey';
import {PimlicoClient, getPimlicoUrl} from './utils/pimlico';
import {createExecuteCall, createGetNonceCall} from './utils/callData';
import {DefaultsForBaseUserOp, DefaultsForETHUserOp, fillUserOp, signUserOp} from './utils/userOp';

export class SimpleKeyring implements Keyring {
  #state: State;
  #userOp = DefaultsForETHUserOp;

  constructor(state: State) {
    this.#state = state;
  }

  get #wallets() {
    return Object.values(this.#state.wallets);
  }

  get #idToWallets() {
    return this.#state.wallets;
  }

  #getWalletByIDSafe(id: string) {
    return this.#idToWallets[id] ?? throwError(`Account with id '${id}' not found`);
  }

  get #addressToWallets() {
    return Object.fromEntries(this.#wallets.map((wallet) => [wallet.account.address, wallet]));
  }

  #getWalletByAddressSafe(address: string) {
    return (
      this.#addressToWallets[address] ?? throwError(`Account with address '${address}' not found`)
    );
  }

  async #saveState() {
    await saveState(this.#state);
  }

  async #emitEvent(event: KeyringEvent, data: Record<string, Json>): Promise<void> {
    await emitSnapKeyringEvent(snap, event, data);
  }

  async listAccounts(): Promise<KeyringAccount[]> {
    return this.#wallets.map((wallet) => wallet.account);
  }

  async getAccount(id: string): Promise<KeyringAccount> {
    return this.#getWalletByIDSafe(id).account;
  }

  async createAccount(unsafeOptions: Record<string, Json> = {}): Promise<KeyringAccount> {
    const result = CreateAccountOptionsSchema.safeParse(unsafeOptions);
    if (!result.success) throwError(result.error.message);

    const address = result.data.address.toLowerCase();

    const signerPrivateKey =
      'privateKey' in result.data
        ? result.data.privateKey
        : await getSignerPrivateKey(result.data.signerIndex);

    if (this.#addressToWallets[address]) {
      throw new Error(`Account address already in use: ${address}`);
    }

    try {
      const account = await this.#createAccount({address, signerPrivateKey});

      return account;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  #createAccount = async (data: {
    address: string;
    signerPrivateKey: string;
  }): Promise<KeyringAccount> => {
    const signerAddress = await privateKeyToAddress(data.signerPrivateKey);

    const account: KeyringAccount = {
      id: uuid(),
      options: {
        signerAddress,
      },
      address: data.address,
      methods: [
        EthMethod.PrepareUserOperation,
        EthMethod.PatchUserOperation,
        EthMethod.SignUserOperation,
        EthMethod.Sign,
        EthMethod.PersonalSign,
        EthMethod.SignTypedDataV1,
        EthMethod.SignTypedDataV3,
        EthMethod.SignTypedDataV4,
      ],
      type: EthAccountType.Erc4337,
    };

    await this.#emitEvent(KeyringEvent.AccountCreated, {account});

    this.#state.wallets[account.id] = {
      account,
      privateKey: stripHexPrefix(data.signerPrivateKey),
      signerAddress,
    };

    await this.#saveState();

    return account;
  };

  async filterAccountChains(_id: string, chains: string[]): Promise<string[]> {
    // The `id` argument is not used because all accounts uses the same bundler.
    // This may change in the future if we support multiple bundlers.

    return chains.filter((chain) => {
      try {
        getChainIdFromCAIP2Safe(chain);
        return true;
      } catch (error) {
        return false;
      }
    });
  }

  async updateAccount(account: KeyringAccount): Promise<void> {
    const wallet = this.#getWalletByIDSafe(account.id);

    const options = AccountOptionsSchema.safeParse(account.options);
    if (!options.success) throwError(options.error.message);

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
    this.#getWalletByIDSafe(id);

    try {
      await this.#emitEvent(KeyringEvent.AccountDeleted, {id});

      delete this.#state.wallets[id];

      await this.#saveState();
    } catch (error) {
      throwError((error as Error).message);
    }
  }

  async submitRequest(request: KeyringRequest): Promise<SubmitRequestResponse> {
    const {method, params = []} = request.request as JsonRpcRequest;

    const signature = await this.#handleSignRequest(method as EthMethod, params, request);

    return {
      pending: false,
      result: signature,
    };
  }

  async #handleSignRequest(
    method: EthMethod,
    params: Json,
    request: KeyringRequest,
  ): Promise<Json> {
    console.log('req', method, JSON.stringify(request, null, 2));

    switch (method) {
      case EthMethod.PrepareUserOperation: {
        const txs = params as EthBaseTransaction[];
        return this.#prepareUserOperation(txs, request);
      }

      case EthMethod.PatchUserOperation: {
        const [userOp] = params as [EthUserOperation];
        return this.#patchUserOperation(userOp, request);
      }

      case EthMethod.SignUserOperation: {
        const [userOp] = params as [EthUserOperation];
        return this.#signUserOperation(userOp, request);
      }

      case EthMethod.PersonalSign: {
        const [message, from] = params as [string, string];
        return this.#signPersonalMessage(from, message);
      }

      case EthMethod.SignTypedDataV1:
      case EthMethod.SignTypedDataV3:
      case EthMethod.SignTypedDataV4: {
        const [from, data] = params as [string, Json];

        const version = method.replace('eth_signTypedData_v', 'V') as SignTypedDataVersion;

        return this.#signTypedData(from, data, {
          version,
        });
      }

      case EthMethod.Sign: {
        const [from, data] = params as [string, string];
        return this.#signMessage(from, data);
      }

      default: {
        throw new Error(`EVM method '${method as string}' not supported`);
      }
    }
  }

  async #prepareUserOperation(
    txs: EthBaseTransaction[],
    request: KeyringRequest,
  ): Promise<EthBaseUserOperation> {
    // Not handling multiple txs for now as it is still unclear if it will be supported.
    const tx = txs[0];
    if (!tx) throwError('No transaction provided');

    const wallet = this.#getWalletByIDSafe(request.account);

    const nonceHex = (await ethereum.request({
      method: 'eth_call',
      params: [{to: wallet.account.address, data: createGetNonceCall()}, 'latest'],
    })) as string;
    const nonce = numberToHexString(hexToNumber(nonceHex));
    const chainId = (await ethereum.request({method: 'eth_chainId'})) as string;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const chainKey = ChainIdsToKeys[parseInt(chainId, 16)]!;
    const chain = NetworksConfig[chainKey];

    const pimlico = new PimlicoClient(chainKey, chain.entryPoint);

    const callData = createExecuteCall(tx.to, tx.value, tx.data || '0x');

    this.#userOp = fillUserOp(DefaultsForETHUserOp, {
      sender: wallet.account.address,
      callData,
      nonce,
      maxFeePerGas: '0x0',
      maxPriorityFeePerGas: '0x0',
    });

    const sponsored = await pimlico.sponsorUserOp(this.#userOp);

    this.#userOp = fillUserOp(this.#userOp, sponsored);

    const baseUserOp = fillUserOp(DefaultsForBaseUserOp, {
      callData: this.#userOp.callData,
      nonce: this.#userOp.nonce,
      bundlerUrl: pimlico.bundlerUrl,
      gasLimits: {
        callGasLimit: this.#userOp.callGasLimit,
        preVerificationGas: this.#userOp.preVerificationGas,
        verificationGasLimit: this.#userOp.verificationGasLimit,
      },
    });

    console.log('prepare return', JSON.stringify(baseUserOp, null, 2));
    return baseUserOp;
  }

  async #patchUserOperation(
    userOp: EthUserOperation,
    request: KeyringRequest,
  ): Promise<EthUserOperationPatch> {
    return {
      paymasterAndData: this.#userOp.paymasterAndData,
    };
  }

  async #signUserOperation(userOp: EthUserOperation, _request: KeyringRequest): Promise<string> {
    const {privateKey} = this.#getWalletByAddressSafe(userOp.sender);

    const chainId = (await ethereum.request({method: 'eth_chainId'})) as string;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const chainKey = ChainIdsToKeys[parseInt(chainId, 16)]!;
    const chain = NetworksConfig[chainKey];

    const ret = signUserOp(privateKey, this.#userOp, chain.entryPoint, parseInt(chainId, 16));

    console.log('sign end', ret);

    return ret;
  }

  #signMessage(from: string, data: string): string {
    const {privateKey} = this.#getWalletByAddressSafe(from);
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');

    const message = stripHexPrefix(data);

    const signature = ecsign(Buffer.from(message, 'hex'), privateKeyBuffer);

    return concatSig(toBuffer(signature.v), signature.r, signature.s);
  }

  #signPersonalMessage(from: string, request: string): string {
    const {privateKey, signerAddress} = this.#getWalletByAddressSafe(from);
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

    if (recoveredAddress !== signerAddress) {
      throw new Error(
        `Signature verification failed for account signer '${signerAddress}' (got '${recoveredAddress}')`,
      );
    }

    return signature;
  }

  #signTypedData(
    from: string,
    data: Json,
    opts: {version: SignTypedDataVersion} = {
      version: SignTypedDataVersion.V1,
    },
  ): string {
    const {privateKey} = this.#getWalletByAddressSafe(from);
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');

    return signTypedData({
      privateKey: privateKeyBuffer,
      data: data as unknown as TypedDataV1 | TypedMessage<any>,
      version: opts.version,
    });
  }
}
