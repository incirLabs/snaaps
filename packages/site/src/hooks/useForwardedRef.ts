import {useImperativeHandle, useRef} from 'react';

export const useForwardedRef = <T>(forwardedRef?: React.Ref<T>): React.MutableRefObject<T> => {
  const ref = useRef<T>();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  useImperativeHandle(forwardedRef, () => ref.current!, []);

  return ref as React.MutableRefObject<T>;
};
