import {NetworksConfig, type NetworkConfig, type NetworkKeys} from 'common';
import {personalSign} from '@metamask/eth-sig-util';
import {encode} from '@metamask/abi-utils';
import {bytesToHex} from '@metamask/utils';
import type {EthUserOperation} from '@metamask/keyring-api';

import {packUserOp} from './userOp';
import {JSONRPCClient} from './jsonRPCClient';
import {throwError, keccak256, retryUntil} from './helpers';
import type {
  GetGasPriceResult,
  GetUserOpReceiptResult,
  GetUserOpStatusResult,
  SendUserOpResult,
  SponsorUserOpResult,
  WaitForUserOpReceiptResult,
} from '../types/pimlico';

const PIMLICO_API_KEY = process.env.SNAP_PIMLICO_API_KEY ?? '';

export const getPimlicoUrl = (type: 'bundler' | 'paymaster', chain: string) =>
  `https://api.pimlico.io/v${type === 'bundler' ? 1 : 2}/${chain}/rpc?apikey=${PIMLICO_API_KEY}`;

export class PimlicoClient {
  chain: NetworkConfig;
  entryPoint: string;

  bundlerUrl: string;
  paymasterUrl: string;

  #bundlerClient: (method: string, params?: any) => Promise<any>;
  #paymasterClient: (method: string, params?: any) => Promise<any>;

  constructor(chain: NetworkKeys, entryPoint: string) {
    this.chain = NetworksConfig[chain];
    this.entryPoint = entryPoint;

    this.bundlerUrl = getPimlicoUrl('bundler', this.chain.pimlico);
    this.paymasterUrl = getPimlicoUrl('paymaster', this.chain.pimlico);

    this.#bundlerClient = JSONRPCClient.bind(null, this.bundlerUrl);
    this.#paymasterClient = JSONRPCClient.bind(null, this.paymasterUrl);
  }

  async #sponsorUserOp(userOp: EthUserOperation): Promise<SponsorUserOpResult> {
    return this.#paymasterClient('pm_sponsorUserOperation', [userOp, this.entryPoint]);
  }

  #getUserOpHash(userOp: EthUserOperation) {
    const encoded = encode(
      ['bytes32', 'address', 'uint256'],
      [keccak256(packUserOp(userOp)), this.entryPoint, this.chain.id.toString()],
    );

    return keccak256(bytesToHex(encoded));
  }

  async #sendUserOp(signedUserOp: EthUserOperation): Promise<SendUserOpResult> {
    return this.#bundlerClient('eth_sendUserOperation', [signedUserOp, this.entryPoint]);
  }

  async #getUserOpReceipt(userOpHash: string): Promise<GetUserOpReceiptResult> {
    return this.#bundlerClient('eth_getUserOperationReceipt', [userOpHash]);
  }

  async #getUserOpStatus(userOpHash: string): Promise<GetUserOpStatusResult> {
    return this.#bundlerClient('pimlico_getUserOperationStatus', [userOpHash]);
  }

  async #waitForUserOpReceipt(
    userOpHash: string,
    options: {pollingInterval: number},
  ): Promise<WaitForUserOpReceiptResult> {
    const {pollingInterval} = options;

    const status = await retryUntil(
      async () => this.#getUserOpStatus(userOpHash),
      (s) => s.status !== 'not_submitted' && s.status !== 'queued',
      pollingInterval,
      120_000, // 2 minutes
    );

    if (!status.ok) {
      return {
        success: false,
        error: 'timeout',
      };
    }
    if (status.result.status === 'not_found' || status.result.status === 'rejected') {
      return {
        success: false,
        error: status.result.status,
      };
    }

    const receipt = await retryUntil(
      async () => this.#getUserOpReceipt(userOpHash),
      (r) => !!r?.receipt,
      pollingInterval,
      120_000, // 2 minutes
    );

    if (!receipt.ok) {
      return {
        success: false,
        error: 'timeout',
      };
    }

    return {
      success: true,
      receipt: receipt.result.receipt,
      transactionHash: receipt.result.receipt.transactionHash,
    };
  }

  async getGasPrice(): Promise<GetGasPriceResult> {
    return this.#bundlerClient('pimlico_getUserOperationGasPrice', []);
  }

  async getSponsoredUserOp(userOp: EthUserOperation) {
    const sponsored = await this.#sponsorUserOp(userOp);

    return {
      ...userOp,
      preVerificationGas: sponsored.preVerificationGas,
      verificationGasLimit: sponsored.verificationGasLimit,
      callGasLimit: sponsored.callGasLimit,
      paymasterAndData: sponsored.paymasterAndData,
    } satisfies EthUserOperation;
  }

  async signUserOp(privateKey: string, sponsoredUserOperation: EthUserOperation) {
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');

    const userOpHash = this.#getUserOpHash(sponsoredUserOperation);

    const signature = personalSign({
      privateKey: privateKeyBuffer,
      data: userOpHash,
    }) as `0x${string}`;

    return {
      ...sponsoredUserOperation,
      signature,
    };
  }

  async sendUserOp(signedSponsoredUserOperation: EthUserOperation) {
    const userOpHash = await this.#sendUserOp(signedSponsoredUserOperation);

    return userOpHash;
  }

  async getReceipt(userOpHash: string) {
    const receipt = await this.#waitForUserOpReceipt(userOpHash, {
      pollingInterval: 2_000,
    });

    if (!receipt.success) {
      throwError(`Could not get receipt. Reason: ${receipt.error}`);
    }

    return {
      receipt: receipt.receipt,
      txHash: receipt.transactionHash,
    };
  }
}
