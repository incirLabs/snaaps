import cx from 'classnames';
import {PageCard} from './PageCard';

export type PageContainerProps = JSX.IntrinsicElements['div'] & {
  area?: 'top' | 'center' | 'bottom';
};

export type PageContainerSubComponents = {
  Card: typeof PageCard;
};

export const PageContainer: React.FC<PageContainerProps> & PageContainerSubComponents = ({
  area = 'center',
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

PageContainer.Card = PageCard;
