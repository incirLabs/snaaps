import {
  type Chain as ViemChain,
  linea,
  scroll,
  arbitrum,
  optimism,
  polygon,
  mainnet,
  goerli,
} from 'viem/chains';

export type NetworkConfig = {
  name: string;
  viem: ViemChain;
};

export const NetworksConfig = {
  linea: {
    name: 'Linea',
    viem: linea,
  },

  scroll: {
    name: 'Scroll',
    viem: scroll,
  },

  arbitrum: {
    name: 'Arbitrum',
    viem: arbitrum,
  },

  optimism: {
    name: 'Optimism',
    viem: optimism,
  },

  polygon: {
    name: 'Polygon',
    viem: polygon,
  },

  ethereum: {
    name: 'Ethereum',
    viem: mainnet,
  },

  ethereumGoerli: {
    name: 'Ethereum Goerli',
    viem: goerli,
  },
} satisfies Record<string, NetworkConfig>;

export type NetworkKeys = keyof typeof NetworksConfig;
export const NetworkKeys = Object.keys(NetworksConfig) as NetworkKeys[];
