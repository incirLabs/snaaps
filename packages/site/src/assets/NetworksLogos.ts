import {NetworkKeys} from 'common';

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

  ethereumGoerli: {
    square: {
      preferredHeight: 20,
      component: EthereumGoerliLogoSquare,
    },
    wide: {
      preferredHeight: 22,
      component: EthereumGoerliLogo,
    },
  },
};
