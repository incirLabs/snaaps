import cx from 'classnames';

export type PageContainerProps = JSX.IntrinsicElements['div'] & {
  area: 'top' | 'left' | 'center' | 'right';
};

export const PageContainer: React.FC<PageContainerProps> = ({
  area,
  children,
  className,
  ...props
}) => {
  return (
    <div className={cx(`c-page-layout_${area}`, className)} {...props}>
      {children}
    </div>
  );
};
