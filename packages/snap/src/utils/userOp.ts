import {encode} from '@metamask/abi-utils';
import {bytesToHex} from '@metamask/utils';
import {ZERO_ADDRESS, keccak256} from './helpers';

export type UserOperation = {
  sender: string;
  nonce: string;
  initCode: string;
  callData: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  paymasterAndData: string;
  signature: string;
};

export const DefaultsForUserOp: UserOperation = {
  sender: ZERO_ADDRESS,
  nonce: '0x',
  initCode: '0x',
  callData: '0x',
  callGasLimit: '0x100000',
  verificationGasLimit: '0x20000',
  preVerificationGas: '0x10000',
  maxFeePerGas: '0x',
  maxPriorityFeePerGas: '0x',
  paymasterAndData: '0x',

  // dummy signature
  signature:
    '0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c',
};

export const fillUserOp = (
  userOp: Partial<UserOperation>,
  defaults = DefaultsForUserOp,
): UserOperation => {
  const partial = Object.fromEntries(Object.entries(userOp).filter(([, value]) => value !== null));

  return {...defaults, ...partial};
};

export const packUserOp = (userOp: UserOperation): string => {
  const hashedInitCode = keccak256(userOp.initCode);
  const hashedCallData = keccak256(userOp.callData);
  const hashedPaymasterAndData = keccak256(userOp.paymasterAndData);

  return bytesToHex(
    encode(
      [
        'address',
        'uint256',
        'bytes32',
        'bytes32',
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'bytes32',
      ],
      [
        userOp.sender,
        userOp.nonce,
        hashedInitCode,
        hashedCallData,
        userOp.callGasLimit,
        userOp.verificationGasLimit,
        userOp.preVerificationGas,
        userOp.maxFeePerGas,
        userOp.maxPriorityFeePerGas,
        hashedPaymasterAndData,
      ],
    ),
  );
};
