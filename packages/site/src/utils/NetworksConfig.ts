import {type Chain, linea, scroll, arbitrum, optimism, polygon, mainnet} from 'wagmi/chains';

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
  chain: Chain;
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
    chain: linea,
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
    chain: scroll,
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
    chain: arbitrum,
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
    chain: optimism,
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
    chain: polygon,
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
    chain: mainnet,
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
