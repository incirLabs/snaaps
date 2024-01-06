import {forwardRef, useLayoutEffect} from 'react';
import {useForwardedRef} from '../../hooks';

export type MarqueeProps = JSX.IntrinsicElements['div'] & {
  /**
   * The duration of the animation in milliseconds.
   */
  duration?: number;
};

export type MarqueeRef = HTMLDivElement;

const Marquee = forwardRef<MarqueeRef, MarqueeProps>((props, ref) => {
  const {children, duration = 10_000, ...restProps} = props;

  const forwardedRef = useForwardedRef(ref);

  useLayoutEffect(() => {
    const container = forwardedRef.current;

    if (!container || !children) return;

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
          const clone = elem.cloneNode(true);
          container.append(clone);
        });
      });
    }

    const anim = container.animate(
      [{transform: 'translateX(0)'}, {transform: `translateX(-${container.scrollWidth / 3}px)`}],
      {duration, iterations: Infinity},
    );

    // eslint-disable-next-line consistent-return
    return () => {
      anim.cancel();
    };
  }, [forwardedRef, children, duration]);

  return (
    <div ref={forwardedRef} {...restProps}>
      {children}
    </div>
  );
});

type Marquee = MarqueeRef;

export {Marquee};
