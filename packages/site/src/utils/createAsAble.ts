import {createElement} from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsType = keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>;
export type AsAbleComponent<P = object, As extends AsType = 'div'> = P & {
  as?: As;
} & React.ComponentPropsWithoutRef<As>;

const AsAbleComponent = <TDefaultAs extends AsType = 'div'>(
  defaultAs: TDefaultAs,
  props: AsAbleComponent<object, TDefaultAs>,
) => {
  const {as, children, ...restProps} = props;

  // eslint-disable-next-line react/destructuring-assignment
  return createElement(as ?? defaultAs, restProps, children);
};

export const createAsAble = <TDefaultAs extends AsType = 'div', TProps = object>(
  defaultAs: TDefaultAs,
  component: <TAs extends AsType>(
    AsAble: React.FC<AsAbleComponent<object, TDefaultAs>>,
    props: AsAbleComponent<TProps, TAs>,
  ) => React.ReactNode,
): (<TAs extends AsType = TDefaultAs>(props: AsAbleComponent<TProps, TAs>) => React.ReactNode) => {
  const asAbleWithDefault = AsAbleComponent.bind(null, defaultAs);

  return component.bind(null, asAbleWithDefault);
};
