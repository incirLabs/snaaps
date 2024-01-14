import {memo} from 'react';
import cx from 'classnames';

import './styles.scss';

export type ActivityIndicatorProps = JSX.IntrinsicElements['div'] & {
  size?: 'small' | 'normal' | 'large';
  color?: string;
};

export const ActivityIndicator = memo(
  ({size = 'normal', color, className, ...restProps}: ActivityIndicatorProps) => {
    return (
      <div
        className={cx('c-activity-indicator', `c-activity-indicator--${size}`, className)}
        {...restProps}
      >
        {Array(4)
          .fill('')
          .map((_, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index.toString()}
              style={color ? {borderTopColor: color} : undefined}
            />
          ))}
      </div>
    );
  },
);
