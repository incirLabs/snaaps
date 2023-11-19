import {KeyringSnapRpcClient} from '@metamask/keyring-api';
import {useSnaapAddress} from './useSnaapAddress';

export const useAddToMetamask = () => {
  const addresses = useSnaapAddress();

  return async () => {
    if (!addresses) return;

    const snapId = 'local:http://localhost:8080';

    try {
      const client = new KeyringSnapRpcClient(snapId, window.ethereum);

      const account = await client.createAccount({
        type: 'eip155:eip4337',
        address: addresses.snaap,
      });
    } catch (error) {
      // TODO: USE POPUP instead of an ALERT
      alert((error as any).message);
    }
  };
};
