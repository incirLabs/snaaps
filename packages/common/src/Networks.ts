import {
  type Chain as ViemChain,
  linea,
  scroll,
  arbitrum,
  optimism,
  polygon,
  mainnet,
  goerli,
  gnosis,
  base,
  bsc,
} from 'viem/chains';

export type NetworkConfig = {
  id: number;
  name: string;
  viem: ViemChain;
  pimlico: string;
};

export const NetworksConfig = {
  linea: {
    id: linea.id,
    name: 'Linea',
    viem: linea,
    pimlico: 'linea',
  },

  scroll: {
    id: scroll.id,
    name: 'Scroll',
    viem: scroll,
    pimlico: 'scroll',
  },

  arbitrum: {
    id: arbitrum.id,
    name: 'Arbitrum',
    viem: arbitrum,
    pimlico: 'arbitrum',
  },

  optimism: {
    id: optimism.id,
    name: 'Optimism',
    viem: optimism,
    pimlico: 'optimism',
  },

  polygon: {
    id: polygon.id,
    name: 'Polygon',
    viem: polygon,
    pimlico: 'polygon',
  },

  ethereum: {
    id: mainnet.id,
    name: 'Ethereum',
    viem: mainnet,
    pimlico: 'ethereum',
  },

  ethereumGoerli: {
    id: goerli.id,
    name: 'Ethereum Goerli',
    viem: goerli,
    pimlico: 'goerli',
  },

  gnosis: {
    id: gnosis.id,
    name: 'Gnosis',
    viem: gnosis,
    pimlico: 'gnosis',
  },

  base: {
    id: base.id,
    name: 'Base',
    viem: base,
    pimlico: 'base',
  },

  bsc: {
    id: bsc.id,
    name: 'BNB Chain',
    viem: bsc,
    pimlico: 'binance',
  },
} satisfies Record<string, NetworkConfig>;

export type NetworkKeys = keyof typeof NetworksConfig;
export const NetworkKeys = Object.keys(NetworksConfig) as NetworkKeys[];
