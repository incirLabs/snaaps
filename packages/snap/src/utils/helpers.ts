import {Common, Hardfork} from '@ethereumjs/common';
import {stripHexPrefix} from '@ethereumjs/util';
import {bytesToHex} from '@metamask/utils';
import {getNetworkByChainId} from 'common';
import {keccak256 as ecKeccak256} from 'ethereum-cryptography/keccak';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

/**
 * Throws an error with the specified message.
 *
 * @param message - The error message.
 */
export function throwError(message: string): never {
  throw new Error(message);
}

/**
 * Converts a number to a 0x-prefixed hex string.
 * @param value The number to convert
 * @returns 0x-prefixed hex string
 */
export const numberToHexString = (value: number | string): `0x${string}` => {
  if (typeof value === 'string') {
    if (value.startsWith('0x')) return value as `0x${string}`;

    return `0x${parseInt(value, 10).toString(16)}`;
  }

  return `0x${value.toString(16)}`;
};

export const getCommonForTx = (tx: any): Common => {
  return Common.custom(
    {chainId: tx.chainId},
    {
      hardfork: tx.maxPriorityFeePerGas || tx.maxFeePerGas ? Hardfork.London : Hardfork.Istanbul,
    },
  );
};

/**
 * Hex-to-Hex keccak256 hash function
 * @param hex The hex string to hash
 * @returns The hashed 0x-prefixed hex string
 */
export const keccak256 = (hex: string) => {
  return bytesToHex(ecKeccak256(Buffer.from(stripHexPrefix(hex), 'hex')));
};

/**
 * Sleeps for the specified amount of time
 * @param ms The time to sleep in milliseconds
 * @returns A promise that resolves after the specified amount of time
 */
export const sleep = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/**
 * Retries a function until it returns a truthy value or the timeout is reached
 * @param fn The function to retry
 * @param condition The condition function to check the result against
 * @param interval The interval between retries
 * @param timeout The timeout in milliseconds
 * @param [start=Date.now()] - The start time of the function (Do not set this manually)
 * @returns A promise that resolves to the result of the function
 */
export const retryUntil = async <TResult>(
  fn: () => Promise<TResult>,
  condition: (result: TResult) => boolean,
  interval = 1000,
  timeout = Number.MAX_SAFE_INTEGER,
  start = Date.now(),
): Promise<{ok: true; result: TResult} | {ok: false}> => {
  if (Date.now() - start > timeout) return {ok: false};

  const result = await fn();

  if (!condition(result)) {
    await sleep(interval);

    return retryUntil(fn, condition, interval, timeout, start);
  }

  return {
    ok: true,
    result,
  };
};

/**
 * Returns the chain ID from a CAIP-2 chain ID, throwing an error if it is not valid EVM chain ID.
 * @param caip2 The CAIP-2 chain ID
 * @returns The chain ID as a number
 */
export const getChainIdFromCAIP2 = (caip2: string): number => {
  if (!caip2.startsWith('eip155:')) {
    throwError(`Non-EVM CAIP-2 Chain ID: ${caip2}`);
  }

  const chainId = Number(caip2.split(':')[1]);

  if (!chainId) {
    throwError(`Invalid CAIP-2 Chain ID: ${caip2}`);
  }

  return chainId;
};

/**
 * Returns the chain ID from a CAIP-2 chain ID, throwing an error if it is not supported.
 * @param caip2 The CAIP-2 chain ID
 * @returns The chain ID as a number
 */
export const getChainIdFromCAIP2Safe = (caip2: string): number => {
  const chainId = getChainIdFromCAIP2(caip2);

  if (!getNetworkByChainId(chainId)) {
    throwError(`Unsupported Chain ID: ${chainId}`);
  }

  return chainId;
};
