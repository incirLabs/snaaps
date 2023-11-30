import {bundlerActions, signUserOperationHashWithECDSA, type UserOperation} from 'permissionless';
import {
  pimlicoBundlerActions,
  pimlicoPaymasterActions,
  type SponsorUserOperationReturnType,
} from 'permissionless/actions/pimlico';
import {createClient, http, type Hex} from 'viem';
import {privateKeyToAccount} from 'viem/accounts';
import {goerli, baseGoerli, lineaTestnet} from 'viem/chains';
import {createExecuteCall} from './callData';
import {fillUserOp} from './userOp';

const PIMLICO_API_KEY = process.env.SNAP_PIMLICO_API_KEY ?? '';
const ENTRYPOINT_ADDRESS = process.env.SNAP_ENTRYPOINT_ADDRESS ?? '';

export const SupportedChains = {
  goerli,
  'base-goerli': baseGoerli,
  'linea-testnet': lineaTestnet,
} as const;

export type SupportedChains = keyof typeof SupportedChains;

const getPimlicoUrl = (type: 'bundler' | 'paymaster', chain: SupportedChains) =>
  `https://api.pimlico.io/v${type === 'bundler' ? 1 : 2}/${chain}/rpc?apikey=${PIMLICO_API_KEY}`;

export class PimlicoClient {
  chain: SupportedChains;

  bundlerUrl: string;
  paymasterUrl: string;

  constructor(chain: SupportedChains) {
    this.chain = chain;

    this.bundlerUrl = getPimlicoUrl('bundler', this.chain);

    this.paymasterUrl = getPimlicoUrl('paymaster', this.chain);
  }

  public get bundlerClient() {
    return createClient({
      transport: http(this.bundlerUrl),
      chain: SupportedChains[this.chain],
    })
      .extend(bundlerActions)
      .extend(pimlicoBundlerActions);
  }

  public get paymasterClient() {
    return createClient({
      transport: http(this.paymasterUrl),
      chain: SupportedChains[this.chain],
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
        entryPoint: ENTRYPOINT_ADDRESS as Hex,
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
      chainId: SupportedChains[this.chain].id,
      entryPoint: ENTRYPOINT_ADDRESS as Hex,
    });

    return {
      ...sponsoredUserOperation,
      signature,
    };
  }

  public async sendUserOp(signedSponsoredUserOperation: UserOperation) {
    const userOpHash = await this.bundlerClient.sendUserOperation({
      userOperation: signedSponsoredUserOperation,
      entryPoint: ENTRYPOINT_ADDRESS as Hex,
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
