import {NetworkKeys} from 'common';

import {
  // Wide
  LineaLogo,
  ScrollLogo,
  ArbitrumLogo,
  OptimismLogo,
  PolygonLogo,
  EthereumLogo,
  EthereumSepoliaLogo,
  GnosisLogo,
  BaseLogo,
  BNBChainLogo,

  // Square
  LineaLogoSquare,
  ScrollLogoSquare,
  ArbitrumLogoSquare,
  OptimismLogoSquare,
  PolygonLogoSquare,
  EthereumLogoSquare,
  EthereumSepoliaLogoSquare,
  GnosisLogoSquare,
  BaseLogoSquare,
  BNBChainLogoSquare,
} from './Networks';

export type NetworkLogos = {
  square: {
    preferredHeight: number;
    component: React.FC<JSX.IntrinsicElements['svg']>;
  };
  wide: {
    preferredHeight: number;
    component: React.FC<JSX.IntrinsicElements['svg']>;
  };
};

export const NetworksLogos: Record<NetworkKeys, NetworkLogos> = {
  linea: {
    square: {
      preferredHeight: 20,
      component: LineaLogoSquare,
    },
    wide: {
      preferredHeight: 18,
      component: LineaLogo,
    },
  },

  scroll: {
    square: {
      preferredHeight: 20,
      component: ScrollLogoSquare,
    },
    wide: {
      preferredHeight: 20,
      component: ScrollLogo,
    },
  },

  arbitrum: {
    square: {
      preferredHeight: 20,
      component: ArbitrumLogoSquare,
    },
    wide: {
      preferredHeight: 24,
      component: ArbitrumLogo,
    },
  },

  optimism: {
    square: {
      preferredHeight: 20,
      component: OptimismLogoSquare,
    },
    wide: {
      preferredHeight: 14,
      component: OptimismLogo,
    },
  },

  polygon: {
    square: {
      preferredHeight: 20,
      component: PolygonLogoSquare,
    },
    wide: {
      preferredHeight: 20,
      component: PolygonLogo,
    },
  },

  ethereum: {
    square: {
      preferredHeight: 20,
      component: EthereumLogoSquare,
    },
    wide: {
      preferredHeight: 22,
      component: EthereumLogo,
    },
  },

  ethereumSepolia: {
    square: {
      preferredHeight: 20,
      component: EthereumSepoliaLogoSquare,
    },
    wide: {
      preferredHeight: 22,
      component: EthereumSepoliaLogo,
    },
  },

  gnosis: {
    square: {
      preferredHeight: 20,
      component: GnosisLogoSquare,
    },
    wide: {
      preferredHeight: 16,
      component: GnosisLogo,
    },
  },

  base: {
    square: {
      preferredHeight: 18,
      component: BaseLogoSquare,
    },
    wide: {
      preferredHeight: 20,
      component: BaseLogo,
    },
  },

  bsc: {
    square: {
      preferredHeight: 20,
      component: BNBChainLogoSquare,
    },
    wide: {
      preferredHeight: 22,
      component: BNBChainLogo,
    },
  },
};
