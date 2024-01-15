import {useEffect, useState} from 'react';
import {getWalletAddress} from '../utils/Networks';
import {NetworkKeys} from '../utils/NetworksConfig';

export const useContractAddress = (signerAddress?: string, network?: NetworkKeys) => {
  const [contractAddress, setContractAddress] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (!signerAddress) return;

      const address = await getWalletAddress(signerAddress, network);

      setContractAddress(typeof address === 'string' ? address : undefined);
    })();
  }, [signerAddress, network]);

  return contractAddress;
};
