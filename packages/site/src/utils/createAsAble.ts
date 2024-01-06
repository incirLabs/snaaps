import {createElement} from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsType = keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>;

export type AsAbleProps<P = object, As extends AsType = 'div'> = P &
  React.ComponentPropsWithoutRef<As>;

export type AsAbleComponent<P = object, As extends AsType = 'div'> = AsAbleProps<P, As> & {
  as?: As;
};

export const createAsAble = <TAs extends AsType, TProps = object>(
  defaultAs: TAs,
  component: (
    props: AsAbleComponent<TProps, AsType>,
    AsAble: (props: AsAbleProps<object, TAs> & {as?: AsType}) => JSX.Element,
  ) => JSX.Element,
) => {
  return <TPAs extends AsType>(props: AsAbleComponent<TProps, TPAs> & {as?: TAs | AsType}) =>
    component(props, ({as, ...restProps}) =>
      createElement(as ?? defaultAs ?? 'div', restProps, props.children),
    );
};
