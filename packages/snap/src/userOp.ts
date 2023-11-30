import {zeroAddress, type Address, type Hex} from 'viem';

export type UserOperation = {
  sender: Address;
  nonce: bigint;
  initCode: Hex;
  callData: Hex;
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  paymasterAndData: Hex;
  signature: Hex;
};

export const DefaultsForUserOp: UserOperation = {
  sender: zeroAddress,
  nonce: 0n,
  initCode: '0x',
  callData: '0x',
  callGasLimit: 0n,
  verificationGasLimit: 0n,
  preVerificationGas: 0n,
  maxFeePerGas: 0n,
  maxPriorityFeePerGas: 0n,
  paymasterAndData: '0x',

  // dummy signature
  signature:
    '0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c',
};

export const fillUserOp = (
  op: Partial<UserOperation>,
  defaults = DefaultsForUserOp,
): UserOperation => {
  const partial = Object.fromEntries(Object.entries(op).filter(([, value]) => value !== null));

  return {...defaults, ...partial};
};
