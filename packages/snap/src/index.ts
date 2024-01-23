import {MethodNotSupportedError, handleKeyringRequest} from '@metamask/keyring-api';
import type {OnKeyringRequestHandler, OnRpcRequestHandler} from '@metamask/snaps-types';
import {InternalSnapMethod, hasPermission} from 'common';

import {SimpleKeyring} from './keyring';
import {logger} from './utils/logger';
import {getState} from './state';
import {getSignerAddress} from './utils/privateKey';

let keyring: SimpleKeyring;

/**
 * Return the keyring instance. If it doesn't exist, create it.
 */
const getKeyring = async (): Promise<SimpleKeyring> => {
  if (!keyring) {
    const state = await getState();

    keyring = new SimpleKeyring(state);
  }

  return keyring;
};

export const onRpcRequest: OnRpcRequestHandler = async ({origin, request}) => {
  logger.debug(`RPC request (origin="${origin}"):`, JSON.stringify(request, undefined, 2));

  // Check if origin is allowed to call method.
  if (!hasPermission(origin, request.method)) {
    throw new Error(`Origin '${origin}' is not allowed to call '${request.method}'`);
  }

  // Handle custom methods.
  switch (request.method) {
    case InternalSnapMethod.NOOP: {
      return undefined;
    }

    case InternalSnapMethod.GetAvailableSigners: {
      const page = Number((request.params as any)?.page) ?? 0;

      const pageLength = 5;

      const addresses = await Promise.all(
        Array.from({length: pageLength}, async (_, i) => {
          const idx = page * pageLength + i;

          return {
            address: await getSignerAddress(idx),
            index: idx,
          };
        }),
      );

      return addresses;
    }

    default: {
      throw new MethodNotSupportedError(request.method);
    }
  }
};

export const onKeyringRequest: OnKeyringRequestHandler = async ({origin, request}) => {
  logger.debug(`Keyring request (origin="${origin}"):`, JSON.stringify(request, undefined, 2));

  // Check if origin is allowed to call method.
  if (!hasPermission(origin, request.method)) {
    throw new Error(`Origin '${origin}' is not allowed to call '${request.method}'`);
  }

  // Handle keyring methods.
  return handleKeyringRequest(await getKeyring(), request);
};
