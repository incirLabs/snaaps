import {useLayoutEffect, useState} from 'react';

/**
 * Hook that returns the current window dimensions.
 * Kinda like useWindowDimensions from react-native.
 */
export const useWindowDimensions = () => {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return size;
};
