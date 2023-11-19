import {Hex, encodeFunctionData} from 'viem';

export const createExecuteCall = (to: Hex, value: bigint, data: Hex) => {
  return encodeFunctionData({
    abi: [
      {
        inputs: [
          {name: 'dest', type: 'address'},
          {name: 'value', type: 'uint256'},
          {name: 'func', type: 'bytes'},
        ],
        name: 'execute',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    args: [to, value, data],
  });
};

export const createGetNonceCall = () => {
  return encodeFunctionData({
    abi: [
      {
        inputs: [],
        name: 'getNonce',
        outputs: [{name: '', type: 'uint256'}],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
  });
};
