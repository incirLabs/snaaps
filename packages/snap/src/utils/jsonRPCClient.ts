import {throwError} from './helpers';

/**
 * A simple JSON-RPC client. Throws on error.
 * @param url Endpoint URL
 * @param method Method name
 * @param params Method params
 * @param headers Optional headers
 * @returns JSON-RPC result
 */
export const JSONRPCClient = async (
  url: string,
  method: string,
  params: any = [],
  headers?: HeadersInit,
) => {
  let json;
  try {
    json = await (
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...headers,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method,
          params,
          id: 1,
        }),
      })
    ).json();
  } catch (e) {
    throwError('JSON-RPC Request failed');
  }

  console.log(
    'internal json-rpc',
    url,
    method,
    JSON.stringify(params, null, 2),
    JSON.stringify(json, null, 2),
  );

  if (typeof json !== 'object' && json !== null) throwError('Invalid JSON response');
  if (json.error) throwError(`Internal JSON-RPC error: ${JSON.stringify(json.error, null, 2)}`);
  if (json.result === undefined) throwError('Invalid JSON-RPC response');

  return json.result;
};
