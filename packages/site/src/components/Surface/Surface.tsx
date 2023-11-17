import cx from 'classnames';

import './styles.scss';

export type SurfaceProps = JSX.IntrinsicElements['div'] & {
  noShadow?: boolean;
};

export type SurfaceContentProps = SurfaceProps & {
  children?: React.ReactNode;
};

export type SurfaceSubComponents = {
  Content: React.FC<SurfaceContentProps & {left: React.ReactNode; right: React.ReactNode}>;
};

export const Surface: React.FC<SurfaceProps> & SurfaceSubComponents = ({
  noShadow,
  children,
  className,
  ...props
}) => {
  return (
    <div className={cx('c-surface', {'c-surface--no-shadow': noShadow}, className)} {...props}>
      {children}
    </div>
  );
};

// eslint-disable-next-line react/function-component-definition
Surface.Content = ({className, left, right, ...props}) => {
  return (
    <Surface noShadow className={cx('c-surface_content', className)} {...props}>
      {left}

      {right}
    </Surface>
  );
};
