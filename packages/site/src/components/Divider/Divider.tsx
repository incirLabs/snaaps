import cx from 'classnames';
import {createAsAble} from '../../utils/createAsAble';

import './styles.scss';

export type DividerProps = {
  vertical?: boolean;
};

export const Divider = createAsAble<'div', DividerProps>('div', (AsAble, props) => {
  const {vertical, className, children, ...restProps} = props;

  return (
    <AsAble
      className={cx(
        'c-divider',
        {
          'c-divider--horizontal': !vertical,
          'c-divider--vertical': vertical,
        },
        className,
      )}
      {...restProps}
    >
      {children}
    </AsAble>
  );
});
