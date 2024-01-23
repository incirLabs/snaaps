import {useEffect, useMemo, useState} from 'react';
import {useSnapAccounts} from './SnapAccountsContext';

export const useSignerAddress = (contractAddress?: string) => {
  const [loading, setLoading] = useState(true);
  const [signerAddress, setSignerAddress] = useState<string | undefined>(undefined);
  const [snapAccounts] = useSnapAccounts();

  useEffect(() => {
    (async () => {
      if (!contractAddress) return;

      const account = snapAccounts[contractAddress.toLowerCase()];
      if (!account) {
        setSignerAddress(undefined);
        setLoading(false);
        return;
      }

      const signer = account.options?.signerAddress;

      setSignerAddress(typeof signer === 'string' ? signer : undefined);
      setLoading(false);
    })();
  }, [contractAddress, snapAccounts]);

  return useMemo(() => ({loading, signerAddress}), [loading, signerAddress]);
};
