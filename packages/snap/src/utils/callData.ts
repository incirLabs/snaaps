import {encode, encodePacked} from '@metamask/abi-utils';
import {bytesToHex} from '@metamask/utils';
import {keccak256} from './helpers';

export const getFunctionSignature = (name: string, inputs: any[]) => {
  const functionSelector = `${name}(${inputs.join(',')})`;

  return keccak256(Buffer.from(functionSelector, 'utf-8').toString('hex')).slice(
    0,
    10, // 4 bytes = 8 chars + 0x prefix
  );
};

export const encodeFunctionCall = (name: string, inputs: any[], params: any[]) => {
  const signature = getFunctionSignature(name, inputs);
  const data = encode(inputs, params);

  if (inputs.length === 0) {
    return signature;
  }

  return bytesToHex(encodePacked(['bytes4', 'bytes'], [signature, data]));
};

export const createExecuteCall = (to: string, value: number | string, data: string) => {
  return encodeFunctionCall('execute', ['address', 'uint256', 'bytes'], [to, value, data]);
};

export const createGetNonceCall = () => {
  return encodeFunctionCall('getNonce', [], []);
};
