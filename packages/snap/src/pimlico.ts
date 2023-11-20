import {UserOperation, bundlerActions, signUserOperationHashWithECDSA} from 'permissionless';
import {
  GetUserOperationGasPriceReturnType,
  SponsorUserOperationReturnType,
  pimlicoBundlerActions,
  pimlicoPaymasterActions,
} from 'permissionless/actions/pimlico';
import {Hex, createClient, encodeFunctionData, http} from 'viem';
import {privateKeyToAccount} from 'viem/accounts';
import {goerli, baseGoerli, lineaTestnet} from 'viem/chains';
import {createExecuteCall} from './callData';

const PIMLICO_API_KEY = process.env.SNAP_PIMLICO_API_KEY;
const ENTRYPOINT_ADDRESS = process.env.SNAP_ENTRYPOINT_ADDRESS;

export const SupportedChains = {
  goerli: goerli,
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

  public createUserOp(
    sender: Hex,
    callData: Hex,
    gasPrice: GetUserOperationGasPriceReturnType,
    nonce: bigint,
  ) {
    return {
      sender,
      nonce,
      initCode: '0x' as Hex,
      callData,
      maxFeePerGas: gasPrice.fast.maxFeePerGas,
      maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
      // dummy signature
      signature:
        '0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c' as Hex,
    };
  }

  public async generateUserOp(from: Hex, to: Hex, value: bigint, data: Hex, nonce: bigint) {
    const callData = createExecuteCall(to, value, data);
    const gasPrice = await this.getGasPrice();

    const userOp = this.createUserOp(from, callData, gasPrice, nonce);

    return userOp;
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
