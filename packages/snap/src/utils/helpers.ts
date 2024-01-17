import {Common, Hardfork} from '@ethereumjs/common';
import type {Hex} from 'viem';

/**
 * Throws an error with the specified message.
 *
 * @param message - The error message.
 */
export function throwError(message: string): never {
  throw new Error(message);
}

export function numberToHexString(value: number | string): Hex {
  if (typeof value === 'string') {
    if (value.startsWith('0x')) return value as Hex;

    return `0x${parseInt(value, 10).toString(16)}`;
  }

  return `0x${value.toString(16)}`;
}

export function getCommonForTx(tx: any): Common {
  return Common.custom(
    {chainId: tx.chainId},
    {
      hardfork: tx.maxPriorityFeePerGas || tx.maxFeePerGas ? Hardfork.London : Hardfork.Istanbul,
    },
  );
}
