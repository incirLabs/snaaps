import type {KeyringAccount} from '@metamask/keyring-api';

export type Wallet = {
  account: KeyringAccount;
  privateKey: string;
  signerAddress: string;
};

export type KeyringState = {
  wallets: Record<string, Wallet>;
};

export type State = KeyringState;

/**
 * Default state.
 */
const defaultState: State = {
  wallets: {},
};

/**
 * Retrieves the current state.
 *
 * @returns The current state of the keyring.
 */
export async function getState(): Promise<State> {
  const state = (await snap.request({
    method: 'snap_manageState',
    params: {operation: 'get'},
  })) as any;

  return {
    ...defaultState,
    ...state,
  };
}

/**
 * Persists the given snap state.
 *
 * @param state - New snap state.
 */
export async function saveState(state: State) {
  await snap.request({
    method: 'snap_manageState',
    params: {operation: 'update', newState: state},
  });
}
