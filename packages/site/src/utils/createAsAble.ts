import {createElement, forwardRef} from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsType = keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>;
export type AsAbleComponent<P = object, As extends AsType = 'div'> = P & {
  as?: As;
} & React.ComponentPropsWithoutRef<As>;

const AsAbleComponent = <TDefaultAs extends AsType = 'div'>(defaultAs: TDefaultAs) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  forwardRef<any, AsAbleComponent<object, TDefaultAs>>((props, ref) => {
    const {as, children, ...restProps} = props;

    // eslint-disable-next-line react/destructuring-assignment
    return createElement(as ?? defaultAs, {...restProps, ref}, children);
  });

export const createAsAble = <TDefaultAs extends AsType = 'div', TProps = object>(
  defaultAs: TDefaultAs,
  component: <TAs extends AsType>(
    AsAble: React.FC<AsAbleComponent<object, TDefaultAs>>,
    props: AsAbleComponent<TProps, TAs>,
  ) => React.ReactNode,
): (<TAs extends AsType = TDefaultAs>(props: AsAbleComponent<TProps, TAs>) => React.ReactNode) => {
  const asAbleWithDefault = AsAbleComponent(defaultAs);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return component.bind(null, asAbleWithDefault as any);
};
