import {Env} from 'common';
import {SimpleAccount} from 'contracts';
import {useCallback, useEffect, useState} from 'react';
import {Contract} from 'ethers';
import {useProvider} from '@incirlabs/react-ethooks';
import {KeyringSnapRpcClient} from '@metamask/keyring-api';

export const useSnaapAddress = () => {
  const provider = useProvider();

  const [snaapAddress, setSnaapAddress] = useState<
    {snaap: string; signer: string} | null | undefined
  >(undefined);

  const fetchAcconts = useCallback(async () => {
    try {
      const client = new KeyringSnapRpcClient(Env.SNAP_ORIGIN, window.ethereum);

      const accounts = await client.listAccounts();

      if (accounts.length < 1 || !accounts[0]) {
        setSnaapAddress(null);
        return;
      }

      const {address} = accounts[0];

      const aaContract = new Contract(address, SimpleAccount, provider);

      const signer = await aaContract.owner();

      setSnaapAddress({snaap: address, signer});
    } catch (error) {
      console.error(error);
    }
  }, [provider]);

  useEffect(() => {
    fetchAcconts();

    const timer = setInterval(fetchAcconts, 5000);

    return () => clearInterval(timer);
  }, [fetchAcconts]);

  return snaapAddress;
};
