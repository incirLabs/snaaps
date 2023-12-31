import cx from 'classnames';
import {createAsAble} from '../../utils/createAsAble';

import './styles.scss';

export type ButtonProps = JSX.IntrinsicElements['button'] & {
  children?: React.ReactNode;
  theme: 'primary' | 'chip' | 'text';
  color?: 'default' | 'danger';
  block?: boolean;
};

export const Button = createAsAble<'button', ButtonProps>('button', (props, AsAble) => {
  const {theme = 'chip', color, block, children, className, ...restProps} = props;

  return (
    <AsAble
      type="button"
      className={cx(
        'c-button',
        {
          'c-button--block': block,

          'c-button--primary': theme === 'primary',
          'c-button--chip': theme === 'chip',
          'c-button--text': theme === 'text',

          'c-button_color--danger': color === 'danger',
        },
        className,
      )}
      {...restProps}
    >
      {children}
    </AsAble>
  );
});
