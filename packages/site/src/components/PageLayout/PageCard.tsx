import cx from 'classnames';
import {Surface, SurfaceProps} from '../Surface/Surface';

export type PageCardProps = SurfaceProps & {
  title?: string;
  titleRight?: React.ReactNode;
};

export const PageCard: React.FC<PageCardProps> = ({
  children,
  className,
  title,
  titleRight,
  ...props
}) => {
  return (
    <Surface className={cx('c-page-layout_card', className)} {...props}>
      {title || titleRight ? (
        <div className="d-flex align-center justify-between">
          {title ? <h2 className="c-page-layout_card_title">{title}</h2> : null}

          {titleRight}
        </div>
      ) : null}

      {children}
    </Surface>
  );
};
