import cx from 'classnames';
import {createAsAble} from '../../../utils/createAsAble';

import './styles.scss';

export type NetworkButtonProps = {
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;

  /**
   * Whether the button is active
   */
  active?: boolean;

  left?: React.ReactNode;
  right?: React.ReactNode;
  children?: React.ReactNode;
};

export const NetworkButton = createAsAble<'button', NetworkButtonProps>(
  'button',
  (props, AsAble) => {
    const {disabled, active, left, right, children, className, ...restProps} = props;

    return (
      <AsAble
        className={cx(
          'p-networks_network-button',
          {
            'p-networks_network-button--disabled': disabled,
            'p-networks_network-button--active': active,
          },
          className,
        )}
        disabled={disabled}
        {...restProps}
      >
        <div className="p-networks_network-button_left">{left}</div>
        {children}
        <div className="p-networks_network-button_right">{right}</div>
      </AsAble>
    );
  },
);
