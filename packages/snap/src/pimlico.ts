import {UserOperation, bundlerActions, signUserOperationHashWithECDSA} from 'permissionless';
import {pimlicoBundlerActions, pimlicoPaymasterActions} from 'permissionless/actions/pimlico';
import {Hex, createClient, encodeFunctionData, http} from 'viem';
import {privateKeyToAccount} from 'viem/accounts';
import {goerli} from 'viem/chains';
import {createExecuteCall} from './callData';

const PIMLICO_API_KEY = process.env.SNAP_PIMLICO_API_KEY;
const ENTRYPOINT_ADDRESS = process.env.SNAP_ENTRYPOINT_ADDRESS;

const chain = 'goerli';

const pimlicoUrl = (ver: 1 | 2) =>
  `https://api.pimlico.io/v${ver}/${chain}/rpc?apikey=${PIMLICO_API_KEY}`;

const bundlerClient = createClient({
  transport: http(pimlicoUrl(1)),
  chain: goerli,
})
  .extend(bundlerActions)
  .extend(pimlicoBundlerActions);

const paymasterClient = createClient({
  transport: http(pimlicoUrl(2)),
  chain: goerli,
}).extend(pimlicoPaymasterActions);

export const getGasPrice = async () => {
  return bundlerClient.getUserOperationGasPrice();
};

export type GasPrice = Awaited<ReturnType<typeof getGasPrice>>;

export const createUserOp = (sender: Hex, callData: Hex, gasPrice: GasPrice, nonce: bigint) => {
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
};

export const generateUserOp = async (
  from: Hex,
  to: Hex,
  value: bigint,
  data: Hex,
  nonce: bigint,
) => {
  console.log('generateUserOp');
  const callData = createExecuteCall(to, value, data);
  console.log('callData', callData);
  const gasPrice = await getGasPrice();
  console.log('gasPrice', gasPrice);

  const userOp = createUserOp(from, callData, gasPrice, nonce);
  console.log('userOp', userOp);

  return userOp;
};

export const getSponsoredUserOp = async (userOp: Awaited<ReturnType<typeof generateUserOp>>) => {
  const sponsorUserOperationResult = await paymasterClient.sponsorUserOperation({
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
};

export const signUserOp = async (ownerPK: string, sponsoredUserOperation: UserOperation) => {
  const owner = privateKeyToAccount(ownerPK as Hex);

  const signature = await signUserOperationHashWithECDSA({
    account: owner,
    userOperation: sponsoredUserOperation,
    chainId: goerli.id,
    entryPoint: ENTRYPOINT_ADDRESS as Hex,
  });

  return {
    ...sponsoredUserOperation,
    signature,
  };
};

export const sendUserOp = async (signedSponsoredUserOperation: UserOperation) => {
  const userOpHash = await bundlerClient.sendUserOperation({
    userOperation: signedSponsoredUserOperation,
    entryPoint: ENTRYPOINT_ADDRESS as Hex,
  });

  return userOpHash;
};

export const getReceipt = async (userOpHash: Hex) => {
  const receipt = await bundlerClient.waitForUserOperationReceipt({hash: userOpHash});
  const txHash = receipt.receipt.transactionHash;

  return {
    receipt,
    txHash,
  };
};
