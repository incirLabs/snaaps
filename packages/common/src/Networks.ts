import {Hex} from 'viem';
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
  entryPoint: Hex;
  accountFactory: Hex;
};

export const NetworksConfig = {
  linea: {
    id: linea.id,
    name: 'Linea',
    viem: linea,
    pimlico: 'linea',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },

  scroll: {
    id: scroll.id,
    name: 'Scroll',
    viem: scroll,
    pimlico: 'scroll',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },

  arbitrum: {
    id: arbitrum.id,
    name: 'Arbitrum',
    viem: arbitrum,
    pimlico: 'arbitrum',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },

  optimism: {
    id: optimism.id,
    name: 'Optimism',
    viem: optimism,
    pimlico: 'optimism',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },

  polygon: {
    id: polygon.id,
    name: 'Polygon',
    viem: polygon,
    pimlico: 'polygon',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },

  ethereum: {
    id: mainnet.id,
    name: 'Ethereum',
    viem: mainnet,
    pimlico: 'ethereum',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },

  ethereumGoerli: {
    id: goerli.id,
    name: 'Ethereum Goerli',
    viem: goerli,
    pimlico: 'goerli',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },

  gnosis: {
    id: gnosis.id,
    name: 'Gnosis',
    viem: gnosis,
    pimlico: 'gnosis',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },

  base: {
    id: base.id,
    name: 'Base',
    viem: base,
    pimlico: 'base',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },

  bsc: {
    id: bsc.id,
    name: 'BNB Chain',
    viem: bsc,
    pimlico: 'binance',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },
} satisfies Record<string, NetworkConfig>;

export type NetworkKeys = keyof typeof NetworksConfig;
export const NetworkKeys = Object.keys(NetworksConfig) as NetworkKeys[];
