import type {KeyringState} from '../keyring';

export type State = {
  keyring: KeyringState;
};

/**
 * Default state.
 */
const defaultState: State = {
  keyring: {
    wallets: {},
    pendingRequests: {},
  },
};

/**
 * Retrieves the current state.
 *
 * @returns The current state of the keyring.
 */
export async function getState(): Promise<KeyringState> {
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
export async function saveState(state: KeyringState) {
  await snap.request({
    method: 'snap_manageState',
    params: {operation: 'update', newState: state},
  });
}
