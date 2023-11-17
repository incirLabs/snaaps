import {useEffect, useRef} from 'react';

const useMount = (effect: React.EffectCallback) => {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;

    mounted.current = true;
    effect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useMount;
