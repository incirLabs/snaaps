import {forwardRef, useLayoutEffect} from 'react';
import {useForwardedRef, useWindowDimensions} from '../../hooks';

export type MarqueeProps = JSX.IntrinsicElements['div'] & {
  /**
   * The duration of the animation in milliseconds.
   */
  duration?: number;

  /**
   * Whether the animation should be reversed.
   */
  reversed?: boolean;
};

export type MarqueeRef = HTMLDivElement;

const Marquee = forwardRef<MarqueeRef, MarqueeProps>((props, ref) => {
  const {children, duration = 10_000, reversed = false, ...restProps} = props;

  const forwardedRef = useForwardedRef(ref);

  const {width, height} = useWindowDimensions();

  useLayoutEffect(() => {
    const container = forwardedRef.current;

    if (!container || !children) return;

    Array.from(container.children).forEach((elem) => {
      if (elem.classList.contains('marquee__clone')) elem.remove();
    });

    const containerWidth = container.getBoundingClientRect().width;

    const contentWidth = Array.from(container.children).reduce(
      (acc, elem) => acc + elem.getBoundingClientRect().width,
      0,
    );

    const diff = Math.floor((containerWidth * 2) / contentWidth);

    if (diff >= 1) {
      const childrenArr = Array.from(container.children);

      Array.from({length: diff}).forEach(() => {
        childrenArr.forEach((elem) => {
          const clone = elem.cloneNode(true) as Element;
          clone.classList.add('marquee__clone');
          container.append(clone);
        });
      });
    }

    const rightBound = (container.scrollWidth - containerWidth) * -1;
    const contentScrollWidth = container.scrollWidth / 2;

    const anim = container.animate(
      reversed
        ? [
            {transform: `translateX(${rightBound}px)`},
            {
              transform: `translateX(${rightBound + contentScrollWidth}px)`,
            },
          ]
        : [{transform: 'translateX(0)'}, {transform: `translateX(${contentScrollWidth * -1}px)`}],
      {duration, iterations: Infinity},
    );

    // eslint-disable-next-line consistent-return
    return () => {
      anim.cancel();
    };
  }, [forwardedRef, children, duration, reversed, width, height]);

  return (
    <div ref={forwardedRef} {...restProps}>
      {children}
    </div>
  );
});

type Marquee = MarqueeRef;

export {Marquee};
