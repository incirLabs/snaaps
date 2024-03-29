import {NetworkKeys, NetworksConfig} from 'common';
import {SimpleAccountFactory} from 'contracts';
import {Hex} from 'viem';
import {getBytecode, readContract} from 'wagmi/actions';
import {wagmiConfig} from './WagmiConfig';

export const checkContractExists = async (network: NetworkKeys, address: string) => {
  try {
    const code = await getBytecode(wagmiConfig, {
      address: address as Hex,
      chainId: NetworksConfig[network].id,
    });

    return !!code;
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

export const getWalletAddress = async (
  signer: string,
  network: NetworkKeys = 'ethereum',
): Promise<string> => {
  const config = NetworksConfig[network];

  const address = await readContract(wagmiConfig, {
    abi: SimpleAccountFactory,
    address: config.accountFactory,
    functionName: 'getAddress',
    args: [signer, 0],
    chainId: config.id,
  });

  return address as string;
};

export const addHexPrefix = (hex: string) => {
  if (hex.startsWith('0x')) return hex;
  return `0x${hex}`;
};

export const stripHexPrefix = (hex: string) => {
  if (!hex.startsWith('0x')) return hex;
  return hex.slice(2);
};
