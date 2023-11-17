import cx from 'classnames';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

const Row: React.FC<Props> = (props) => {
  const {children, className} = props;

  return <div className={cx('row', className)}>{children}</div>;
};

export default Row;
