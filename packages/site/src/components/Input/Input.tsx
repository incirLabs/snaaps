import cx from 'classnames';
import {createAsAble} from '../../utils/createAsAble';

import './styles.scss';

export type InputProps = JSX.IntrinsicElements['input'] & {
  /**
   * Label to display above the input.
   */
  label?: string;

  /**
   * Error message to display or `true` to style as an error without a message.
   * If provided, the input will be styled as an error.
   */
  error?: string | true;

  containerProps?: JSX.IntrinsicElements['label'];
};

export const Input = createAsAble<'input', InputProps>('input', (AsAble, props) => {
  const {label, error, className, containerProps, ...restProps} = props;

  return (
    <label {...containerProps} className={cx('c-input', containerProps?.className)}>
      {label ? <span className="c-input_label">{label}</span> : null}

      <AsAble
        type="text"
        className={cx(
          'c-input_input',
          {
            'c-input--error': !!error,
          },
          className,
        )}
        {...restProps}
      />

      {error && error !== true ? <span className="c-input_error">{error}</span> : null}
    </label>
  );
});
