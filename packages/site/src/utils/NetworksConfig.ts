import {
  type Chain,
  linea,
  scroll,
  arbitrum,
  optimism,
  polygon,
  mainnet,
  goerli,
} from 'wagmi/chains';

import {
  // Wide
  LineaLogo,
  ScrollLogo,
  ArbitrumLogo,
  OptimismLogo,
  PolygonLogo,
  EthereumLogo,
  EthereumGoerliLogo,

  // Square
  LineaLogoSquare,
  ScrollLogoSquare,
  ArbitrumLogoSquare,
  OptimismLogoSquare,
  PolygonLogoSquare,
  EthereumLogoSquare,
  EthereumGoerliLogoSquare,
} from '../assets/Networks';

export type NetworkConfig = {
  name: string;
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

  ethereumGoerli: {
    name: 'Ethereum Goerli',
    chain: goerli,
    logo: {
      square: {
        preferredHeight: 20,
        component: EthereumGoerliLogoSquare,
      },
      wide: {
        preferredHeight: 22,
        component: EthereumGoerliLogo,
      },
    },
  },
} satisfies Record<string, NetworkConfig>;

export type NetworkKeys = keyof typeof NetworksConfig;
export const NetworkKeys = Object.keys(NetworksConfig) as NetworkKeys[];
