import cx from 'classnames';

import './styles.scss';

export type ButtonProps = JSX.IntrinsicElements['button'] & {
  children?: React.ReactNode;
  theme: 'primary' | 'chip' | 'text';
  color?: 'default' | 'danger';
  block?: boolean;
};

export const Button: React.FC<ButtonProps> = (props) => {
  const {theme = 'chip', color, block, children, className, ...restProps} = props;

  return (
    <button
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
    </button>
  );
};
