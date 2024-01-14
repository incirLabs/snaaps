import {KeyringRpcMethod} from '@metamask/keyring-api';

export enum InternalSnapMethod {
  NOOP = 'snap.internal.noop',
  GetAvailableSigners = 'snap.internal.getAvailableSigners',
}

export const OriginPermissions = new Map<string, string[]>([
  [
    'metamask',
    [
      // Keyring methods
      KeyringRpcMethod.ListAccounts,
      KeyringRpcMethod.GetAccount,
      KeyringRpcMethod.FilterAccountChains,
      KeyringRpcMethod.DeleteAccount,
      KeyringRpcMethod.ListRequests,
      KeyringRpcMethod.GetRequest,
      KeyringRpcMethod.SubmitRequest,
      KeyringRpcMethod.RejectRequest,
    ],
  ],
  [
    'http://localhost:3000',
    [
      // Keyring methods
      KeyringRpcMethod.ListAccounts,
      KeyringRpcMethod.GetAccount,
      KeyringRpcMethod.CreateAccount,
      KeyringRpcMethod.FilterAccountChains,
      KeyringRpcMethod.UpdateAccount,
      KeyringRpcMethod.DeleteAccount,
      KeyringRpcMethod.ExportAccount,
      KeyringRpcMethod.ListRequests,
      KeyringRpcMethod.GetRequest,
      KeyringRpcMethod.ApproveRequest,
      KeyringRpcMethod.RejectRequest,

      // Internal methods
      InternalSnapMethod.NOOP,
      InternalSnapMethod.GetAvailableSigners,
    ],
  ],
]);

/**
 * Verify if the caller can call the requested snap method.
 *
 * @param origin - Caller origin.
 * @param method - Method being called.
 * @returns True if the caller is allowed to call the method, false otherwise.
 */
export function hasPermission(origin: string, method: string): boolean {
  return OriginPermissions.get(origin)?.includes(method) ?? false;
}
