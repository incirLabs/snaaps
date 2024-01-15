import {useEffect, useState} from 'react';
import {NetworkKeys} from '../utils/NetworksConfig';
import {getContractDeployedChains} from '../utils/Networks';

export const useDeployedNetworks = (walletAddress?: string, pause?: boolean) => {
  const [loading, setLoading] = useState(true);
  const [deployedNetworks, setDeployedNetworks] = useState<NetworkKeys[]>([]);

  useEffect(() => {
    if (pause || !walletAddress) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);

      const chains = await getContractDeployedChains(walletAddress);

      setDeployedNetworks(chains);
      setLoading(false);
    })();
  }, [walletAddress, pause]);

  return {deployedNetworks, loading};
};
