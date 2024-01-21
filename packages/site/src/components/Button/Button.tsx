import cx from 'classnames';
import {createAsAble} from '../../utils/createAsAble';

import './styles.scss';

export type ButtonProps = {
  children?: React.ReactNode;
  theme: 'primary' | 'chip' | 'text' | 'rounded';
  color?: 'default' | 'danger' | 'dark';
  block?: boolean;
  disabled?: boolean;
};

export const Button = createAsAble<'button', ButtonProps>('button', (AsAble, props) => {
  const {theme = 'chip', color, block, children, className, ...restProps} = props;

  return (
    <AsAble
      type="button"
      className={cx(
        'c-button',
        `c-button--${theme}`,
        {
          'c-button--block': block,

          'c-button_color--danger': color === 'danger',
          'c-button_color--dark': color === 'dark',

          'c-button--disabled': restProps.disabled,
        },
        className,
      )}
      {...restProps}
    >
      {children}
    </AsAble>
  );
});
