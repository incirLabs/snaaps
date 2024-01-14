import {providers} from 'ethers';
import {NetworksConfig, NetworkKeys} from './NetworksConfig';

export const NetworksRPC = Object.fromEntries(
  NetworkKeys.map((network) => [
    network,
    new providers.JsonRpcProvider(NetworksConfig[network].rpcUrl),
  ]),
) as Record<NetworkKeys, providers.JsonRpcProvider>;

export const checkContractExists = async (network: NetworkKeys, address: string) => {
  try {
    const provider = NetworksRPC[network];
    const code = await provider.getCode(address);
    return code !== '0x';
  } catch (e) {
    return false;
  }
};

export const checkContractExistsAllNetworks = async (address: string) => {
  const results = await Promise.all(
    NetworkKeys.map(async (network) => [network, await checkContractExists(network, address)]),
  );

  return Object.fromEntries(results) as Record<NetworkKeys, boolean>;
};

export const checkContractExistsOnAnyNetwork = async (address: string) => {
  const results = checkContractExistsAllNetworks(address);

  return Object.values(results).some((result) => result);
};

export const getContractDeployedChains = async (address: string) => {
  const results = await checkContractExistsAllNetworks(address);

  return Object.entries(results)
    .filter(([, exists]) => exists)
    .map(([network]) => network) as NetworkKeys[];
};
