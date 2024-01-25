export type NetworkConfig = {
  id: number;
  name: string;
  pimlico: string;
  entryPoint: `0x${string}`;
  accountFactory: `0x${string}`;
};

export const NetworksConfig = {
  linea: {
    id: 59144,
    name: 'Linea',
    pimlico: 'linea',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },

  scroll: {
    id: 534352,
    name: 'Scroll',
    pimlico: 'scroll',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },

  arbitrum: {
    id: 42161,
    name: 'Arbitrum',
    pimlico: 'arbitrum',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },

  optimism: {
    id: 10,
    name: 'Optimism',
    pimlico: 'optimism',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },

  polygon: {
    id: 137,
    name: 'Polygon',
    pimlico: 'polygon',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },

  ethereum: {
    id: 1,
    name: 'Ethereum',
    pimlico: 'ethereum',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },

  ethereumSepolia: {
    id: 11155111,
    name: 'Ethereum Sepolia',
    pimlico: 'sepolia',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },

  gnosis: {
    id: 100,
    name: 'Gnosis',
    pimlico: 'gnosis',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },

  base: {
    id: 8453,
    name: 'Base',
    pimlico: 'base',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },

  bsc: {
    id: 56,
    name: 'BNB Chain',
    pimlico: 'binance',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  },
} satisfies Record<string, NetworkConfig>;

export type NetworkKeys = keyof typeof NetworksConfig;
export const NetworkKeys = Object.keys(NetworksConfig) as NetworkKeys[];
