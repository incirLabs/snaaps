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

export const NetworksConfig = {
  linea: {
    name: 'Linea',
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
};

export type NetworkKeys = keyof typeof NetworksConfig;
