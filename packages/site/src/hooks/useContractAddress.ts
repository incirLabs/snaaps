import {useEffect, useMemo, useState} from 'react';
import {getWalletAddress} from '../utils/Networks';
import {NetworkKeys} from '../utils/NetworksConfig';

export const useContractAddress = (signerAddress?: string, network?: NetworkKeys) => {
  const [loading, setLoading] = useState(true);
  const [contractAddress, setContractAddress] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (!signerAddress) return;

      setLoading(true);

      const address = await getWalletAddress(signerAddress, network);

      setContractAddress(typeof address === 'string' ? address : undefined);
      setLoading(false);
    })();
  }, [signerAddress, network]);

  return useMemo(() => ({loading, contractAddress}), [loading, contractAddress]);
};
