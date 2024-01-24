import {useRef, useState} from 'react';
import {createAsAble} from '../../utils/createAsAble';

export const PseudoButton = createAsAble<'div'>('div', (AsAble, props) => {
  const {children, onKeyDown, ...restProps} = props;

  const ref = useRef<HTMLDivElement>(null);
  const [pressed, setPressed] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      ref.current?.click();
      setPressed((value) => !value);
    }

    onKeyDown?.(event);
  };

  return (
    <AsAble
      ref={ref}
      role="button"
      tabIndex={0}
      aria-pressed={pressed}
      onKeyDown={handleKeyDown}
      onBlur={() => setPressed(false)}
      {...restProps}
    >
      {children}
    </AsAble>
  );
});
