/* eslint no-restricted-syntax: "off" */

import type {MetaMaskInpageProvider} from '@metamask/providers';
import {GetSnapsResponse, Snap} from '../types';
import {SNAP_ORIGIN} from './Env';

/**
 * Get the installed snaps in MetaMask.
 *
 * @param provider - The MetaMask inpage provider.
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (provider?: MetaMaskInpageProvider): Promise<GetSnapsResponse> => {
  return (provider ?? window.ethereum).request({
    method: 'wallet_getSnaps',
  }) as unknown as Promise<GetSnapsResponse>;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = (
  snapId: string = SNAP_ORIGIN,
  params: Record<'version' | string, unknown> = {},
) => {
  return window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) => snap.id === SNAP_ORIGIN && (!version || snap.version === version),
    );
  } catch (error) {
    console.error('Failed to obtain installed snap', error);
    return undefined;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */

export const invokeSnap = async (request: {method: string; params?: Record<string, unknown>}) => {
  return window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: SNAP_ORIGIN,
      request,
    },
  });
};

/**
 * Tries to detect if one of the injected providers is MetaMask and checks if snaps is available in that MetaMask version.
 *
 * @returns True if the MetaMask version supports Snaps, false otherwise.
 */
export const detectSnaps = async () => {
  if (window.ethereum?.detected) {
    for (const provider of window.ethereum.detected) {
      try {
        // Detect snaps support
        // eslint-disable-next-line no-await-in-loop
        await getSnaps(provider);

        // enforces MetaMask as provider
        if (window.ethereum.setProvider) {
          window.ethereum.setProvider(provider);
        }

        return true;
      } catch {
        // no-op
      }
    }
  }

  if (window.ethereum?.providers) {
    for (const provider of window.ethereum.providers) {
      try {
        // Detect snaps support
        // eslint-disable-next-line no-await-in-loop
        await getSnaps(provider);

        window.ethereum = provider;

        return true;
      } catch {
        // no-op
      }
    }
  }

  try {
    await getSnaps();

    return true;
  } catch {
    return false;
  }
};

/**
 * Detect if the wallet injecting the ethereum object is MetaMask Flask.
 *
 * @returns True if the MetaMask version is Flask, false otherwise.
 */
export const isFlask = async () => {
  const provider = window.ethereum;

  try {
    const clientVersion = await provider?.request({
      method: 'web3_clientVersion',
    });

    const isFlaskDetected = (clientVersion as string[])?.includes('flask');

    return Boolean(provider && isFlaskDetected);
  } catch {
    return false;
  }
};
