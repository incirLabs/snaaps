import {useMediaQuery} from 'react-responsive';

const useResponsive = (): {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  xxl: boolean;
} => {
  return {
    xs: useMediaQuery({query: `(min-width: 0px)`}),
    sm: useMediaQuery({query: `(min-width: 576px)`}),
    md: useMediaQuery({query: `(min-width: 768px)`}),
    lg: useMediaQuery({query: `(min-width: 992px)`}),
    xl: useMediaQuery({query: `(min-width: 1200px)`}),
    xxl: useMediaQuery({query: `(min-width: 1400px)`}),
  };
};

export default useResponsive;
