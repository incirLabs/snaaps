import cx from 'classnames';
import {createAsAble} from '../../utils/createAsAble';

export type RowProps = {
  children?: React.ReactNode;
  className?: string;
};

const Row = createAsAble<'div', RowProps>('div', (AsAble, props) => {
  const {children, className, ...restProps} = props;

  return (
    <AsAble className={cx('row', className)} {...restProps}>
      {children}
    </AsAble>
  );
});

export default Row;
