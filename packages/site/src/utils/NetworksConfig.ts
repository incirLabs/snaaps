import {ChainObject, type Chain} from '@incirlabs/react-ethooks';

import {
  // Wide
  LineaLogo,
  ScrollLogo,
  ArbitrumLogo,
  OptimismLogo,
  PolygonLogo,
  EthereumLogo,

  // Square
  LineaLogoSquare,
  ScrollLogoSquare,
  ArbitrumLogoSquare,
  OptimismLogoSquare,
  PolygonLogoSquare,
  EthereumLogoSquare,
} from '../assets/Networks';

export type NetworkConfig = {
  name: string;
  rpcUrl: string;
  chain: ChainObject;
  logo: {
    square: {
      preferredHeight: number;
      component: React.FC<JSX.IntrinsicElements['svg']>;
    };
    wide: {
      preferredHeight: number;
      component: React.FC<JSX.IntrinsicElements['svg']>;
    };
  };
};

export const NetworksConfig = {
  linea: {
    name: 'Linea',
    rpcUrl: 'https://rpc.linea.build',
    chain: {
      blockExplorerUrls: ['https://explorer.linea.build'],
      chainId: 59144,
      chainName: 'Linea',
      nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
      },
      rpcUrls: ['https://rpc.linea.build'],
    },
    logo: {
      square: {
        preferredHeight: 20,
        component: LineaLogoSquare,
      },
      wide: {
        preferredHeight: 18,
        component: LineaLogo,
      },
    },
  },

  scroll: {
    name: 'Scroll',
    rpcUrl: 'https://rpc.scroll.io',
    chain: {
      blockExplorerUrls: ['https://scrollscan.com'],
      chainId: 534352,
      chainName: 'Scroll',
      nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
      },
      rpcUrls: ['https://rpc.scroll.io'],
    },
    logo: {
      square: {
        preferredHeight: 20,
        component: ScrollLogoSquare,
      },
      wide: {
        preferredHeight: 20,
        component: ScrollLogo,
      },
    },
  },

  arbitrum: {
    name: 'Arbitrum',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    chain: {
      blockExplorerUrls: ['https://arbiscan.io'],
      chainId: 42161,
      chainName: 'Arbitrum One',
      nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
      },
      rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    },
    logo: {
      square: {
        preferredHeight: 20,
        component: ArbitrumLogoSquare,
      },
      wide: {
        preferredHeight: 24,
        component: ArbitrumLogo,
      },
    },
  },

  optimism: {
    name: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
    chain: {
      blockExplorerUrls: ['https://optimistic.etherscan.io'],
      chainId: 10,
      chainName: 'OP Mainnet',
      nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
      },
      rpcUrls: ['https://mainnet.optimism.io'],
    },
    logo: {
      square: {
        preferredHeight: 20,
        component: OptimismLogoSquare,
      },
      wide: {
        preferredHeight: 14,
        component: OptimismLogo,
      },
    },
  },

  polygon: {
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    chain: {
      blockExplorerUrls: ['https://polygonscan.com'],
      chainId: 137,
      chainName: 'Polygon',
      nativeCurrency: {
        decimals: 18,
        name: 'Matic',
        symbol: 'MATIC',
      },
      rpcUrls: ['https://polygon-rpc.com'],
    },
    logo: {
      square: {
        preferredHeight: 20,
        component: PolygonLogoSquare,
      },
      wide: {
        preferredHeight: 20,
        component: PolygonLogo,
      },
    },
  },

  ethereum: {
    name: 'Ethereum',
    rpcUrl: 'https://eth.llamarpc.com',
    chain: {
      blockExplorerUrls: ['https://etherscan.io'],
      chainId: 1,
      chainName: 'Ethereum',
      nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
      },
      rpcUrls: ['https://eth.llamarpc.com'],
    },
    logo: {
      square: {
        preferredHeight: 20,
        component: EthereumLogoSquare,
      },
      wide: {
        preferredHeight: 22,
        component: EthereumLogo,
      },
    },
  },
} satisfies Record<string, NetworkConfig>;

export type NetworkKeys = keyof typeof NetworksConfig;
export const NetworkKeys = Object.keys(NetworksConfig) as NetworkKeys[];
