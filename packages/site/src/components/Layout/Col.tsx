import cx from 'classnames';

type Column = number | 'auto';

interface Props {
  children?: React.ReactNode;
  className?: string;
  span?: Column;
  sm?: Column;
  md?: Column;
  lg?: Column;
  xl?: Column;
  xxl?: Column;
  auto?: boolean;
}

const Col: React.FC<Props> = (props) => {
  const {
    children,
    className,
    span = -1,
    sm = -1,
    md = -1,
    lg = -1,
    xl = -1,
    xxl = -1,
    auto,
  } = props;

  return (
    <div
      className={cx(
        'col',
        {'col-auto': auto},
        {[`col-${span}`]: span !== -1},
        {[`col-sm-${sm}`]: sm !== -1},
        {[`col-md-${md}`]: md !== -1},
        {[`col-lg-${lg}`]: lg !== -1},
        {[`col-xl-${xl}`]: xl !== -1},
        {[`col-xxl-${xxl}`]: xxl !== -1},
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Col;
