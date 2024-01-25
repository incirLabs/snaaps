import {type NetworkKeys} from 'common';
import {createConfig, http} from 'wagmi';
import {injected} from 'wagmi/connectors';

import {
  type Chain,
  linea,
  scroll,
  arbitrum,
  optimism,
  polygon,
  mainnet,
  sepolia,
  gnosis,
  base,
  bsc,
} from 'viem/chains';

const chains = Object.values({
  linea,
  scroll,
  arbitrum,
  optimism,
  polygon,
  ethereum: mainnet,
  ethereumSepolia: sepolia,
  gnosis,
  base,
  bsc,
} satisfies Record<NetworkKeys, Chain>) as unknown as [Chain, ...Chain[]];

export const wagmiConfig = createConfig({
  chains,
  connectors: [injected()],
  transports: Object.fromEntries(chains.map((chain) => [chain.id, http()])),
});
