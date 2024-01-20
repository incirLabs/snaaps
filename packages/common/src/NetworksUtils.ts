import {NetworksConfig, NetworkConfig, NetworkKeys} from './Networks';

export const ChainIdsToKeys = Object.fromEntries(
  Object.entries(NetworksConfig).map(([key, {id}]) => [id, key]),
) as {[key: number]: NetworkKeys};

export const getNetworkByChainId = (chainId: number): [NetworkKeys, NetworkConfig] | null => {
  const networkKey = ChainIdsToKeys[chainId];
  if (!networkKey) return null;

  return [networkKey, NetworksConfig[networkKey]];
};
