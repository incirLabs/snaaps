import {NetworksConfig, type NetworkConfig, type NetworkKeys} from 'common';
import {bundlerActions, signUserOperationHashWithECDSA, type UserOperation} from 'permissionless';
import {
  pimlicoBundlerActions,
  pimlicoPaymasterActions,
  type SponsorUserOperationReturnType,
} from 'permissionless/actions/pimlico';
import {createClient, http, type Hex} from 'viem';
import {privateKeyToAccount} from 'viem/accounts';
import {createExecuteCall} from './callData';
import {fillUserOp} from './userOp';

const PIMLICO_API_KEY = process.env.SNAP_PIMLICO_API_KEY ?? '';

const getPimlicoUrl = (type: 'bundler' | 'paymaster', chain: string) =>
  `https://api.pimlico.io/v${type === 'bundler' ? 1 : 2}/${chain}/rpc?apikey=${PIMLICO_API_KEY}`;

export class PimlicoClient {
  chain: NetworkConfig;

  bundlerUrl: string;
  paymasterUrl: string;

  constructor(chain: NetworkKeys) {
    this.chain = NetworksConfig[chain];

    this.bundlerUrl = getPimlicoUrl('bundler', this.chain.pimlico);

    this.paymasterUrl = getPimlicoUrl('paymaster', this.chain.pimlico);
  }

  public get bundlerClient() {
    return createClient({
      transport: http(this.bundlerUrl),
      chain: this.chain.viem as any,
    })
      .extend(bundlerActions)
      .extend(pimlicoBundlerActions);
  }

  public get paymasterClient() {
    return createClient({
      transport: http(this.paymasterUrl),
      chain: this.chain.viem as any,
    }).extend(pimlicoPaymasterActions);
  }

  public async getGasPrice() {
    return this.bundlerClient.getUserOperationGasPrice();
  }

  public async generateUserOp(from: Hex, to: Hex, value: bigint, data: Hex, nonce: bigint) {
    const callData = createExecuteCall(to, value, data);
    const gasPrice = await this.getGasPrice();

    return fillUserOp({
      sender: from,
      nonce,
      callData,
      maxFeePerGas: gasPrice.fast.maxFeePerGas,
      maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
    });
  }

  public async getSponsoredUserOp(userOp: Awaited<ReturnType<typeof this.generateUserOp>>) {
    const sponsorUserOperationResult: SponsorUserOperationReturnType =
      await this.paymasterClient.sponsorUserOperation({
        userOperation: userOp,
        entryPoint: this.chain.entryPoint,
      });

    return {
      ...userOp,
      preVerificationGas: sponsorUserOperationResult.preVerificationGas,
      verificationGasLimit: sponsorUserOperationResult.verificationGasLimit,
      callGasLimit: sponsorUserOperationResult.callGasLimit,
      paymasterAndData: sponsorUserOperationResult.paymasterAndData,
    } satisfies UserOperation;
  }

  public async signUserOp(ownerPK: string, sponsoredUserOperation: UserOperation) {
    const owner = privateKeyToAccount(ownerPK as Hex);

    const signature = await signUserOperationHashWithECDSA({
      account: owner,
      userOperation: sponsoredUserOperation,
      chainId: this.chain.viem.id,
      entryPoint: this.chain.entryPoint,
    });

    return {
      ...sponsoredUserOperation,
      signature,
    };
  }

  public async sendUserOp(signedSponsoredUserOperation: UserOperation) {
    const userOpHash = await this.bundlerClient.sendUserOperation({
      userOperation: signedSponsoredUserOperation,
      entryPoint: this.chain.entryPoint,
    });

    return userOpHash;
  }

  public async getReceipt(userOpHash: Hex) {
    const receipt = await this.bundlerClient.waitForUserOperationReceipt({hash: userOpHash});
    const txHash = receipt.receipt.transactionHash;

    return {
      receipt,
      txHash,
    };
  }
}
