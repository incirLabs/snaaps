import {encode} from '@metamask/abi-utils';
import {bytesToHex} from '@metamask/utils';
import type {EthBaseUserOperation, EthUserOperation} from '@metamask/keyring-api';

import {keccak256} from './helpers';

export const DefaultsForBaseUserOp: EthBaseUserOperation = {
  nonce: '0x',
  initCode: '0x',
  callData: '0x',
  gasLimits: {
    callGasLimit: '0x100000',
    verificationGasLimit: '0x20000',
    preVerificationGas: '0x10000',
  },
  bundlerUrl: '',

  dummySignature:
    '0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c',
  dummyPaymasterAndData: '0x',
};

export const fillUserOp = <TUserOP extends object>(
  defaults: TUserOP,
  userOp: Partial<TUserOP>,
): TUserOP => {
  const partial = Object.fromEntries(Object.entries(userOp).filter(([, value]) => value !== null));

  return {...defaults, ...partial};
};

export const packUserOp = (userOp: EthUserOperation): string => {
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
