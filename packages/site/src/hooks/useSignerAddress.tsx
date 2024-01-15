import {Env} from 'common';
import {useEffect, useState} from 'react';
import {KeyringSnapRpcClient} from '@metamask/keyring-api';

export const useSignerAddress = (contractAddress?: string) => {
  const [signerAddress, setSignerAddress] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (!contractAddress) return;

      const client = new KeyringSnapRpcClient(Env.SNAP_ORIGIN, window.ethereum);

      const wallets = await client.listAccounts();

      const found = wallets.find((wallet) => wallet.address === contractAddress);
      if (!found) return;

      const signer = found.options?.signerAddress;

      setSignerAddress(typeof signer === 'string' ? signer : undefined);
    })();
  }, [contractAddress]);

  return signerAddress;
};
