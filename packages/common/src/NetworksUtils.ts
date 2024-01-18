import {NetworksConfig, NetworkConfig, NetworkKeys} from './Networks';

export const getNetworkByChainId = (chainId: number): [NetworkKeys, NetworkConfig] | null => {
  const chainKey = (Object.keys(NetworksConfig) as NetworkKeys[]).find(
    (key) => NetworksConfig[key].id === chainId,
  );

  if (!chainKey) return null;

  return [chainKey, NetworksConfig[chainKey]];
};
