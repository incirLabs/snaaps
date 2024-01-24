import {
  createContext,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';
import {PseudoButton} from '../PseudoButton/PseudoButton';
import {createAsAble} from '../../utils/createAsAble';

import './styles.scss';

export type PropsWithActiveClassName = {
  className?: string;
  activeClassName?: string;
};

export const AccordionContext = createContext<
  [active: string | null, activate: (id: string | null) => void]
>([
  null,
  () => {
    //
  },
]);

export const AccordionItemContext = createContext<string>('');

export const AccordionContainer = createAsAble<'div'>('div', (AsAble, props) => {
  const {children, className, ...restProps} = props;

  const state = useState<string | null>(null);

  return (
    <AccordionContext.Provider value={state}>
      <AsAble className={cx(className, 'c-accordion')} {...restProps}>
        {children}
      </AsAble>
    </AccordionContext.Provider>
  );
});

export const AccordionItem = createAsAble<'div', PropsWithActiveClassName>(
  'div',
  (AsAble, props) => {
    const {children, className, activeClassName, ...restProps} = props;

    const [active] = useContext(AccordionContext);
    const id = useId();
    const isActive = active === id;

    return (
      <AccordionItemContext.Provider value={id}>
        <AsAble
          className={cx(className, 'c-accordion_item', {[activeClassName ?? '']: isActive})}
          {...restProps}
        >
          {children}
        </AsAble>
      </AccordionItemContext.Provider>
    );
  },
);

export const AccordionHandle = createAsAble<typeof PseudoButton, PropsWithActiveClassName>(
  PseudoButton,
  (AsAble, props) => {
    const {children, className, activeClassName, ...restProps} = props;

    const [active, setActive] = useContext(AccordionContext);
    const id = useContext(AccordionItemContext);
    const isActive = active === id;

    const toggle = useCallback(() => {
      setActive(isActive ? null : id);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, id]);

    return (
      <AsAble
        className={cx(className, 'c-accordion_item_handle', {
          'c-accordion_item_handle--active': isActive,
          [activeClassName ?? '']: isActive,
        })}
        onClick={toggle}
        {...restProps}
      >
        {children}
      </AsAble>
    );
  },
);

export const AccordionContent = createAsAble<'div', PropsWithActiveClassName>(
  'div',
  (AsAble, props) => {
    const {children, className, activeClassName, ...restProps} = props;

    const contentRef = useRef<HTMLDivElement>(null);
    const [scrollHeight, setScrollHeight] = useState<number>(0);

    const [active] = useContext(AccordionContext);
    const id = useContext(AccordionItemContext);
    const isActive = active === id;

    useLayoutEffect(() => {
      if (!contentRef.current) return;

      setScrollHeight(contentRef.current.scrollHeight);
    }, [isActive]);

    return (
      <AsAble
        ref={contentRef}
        className={cx(className, 'c-accordion_item_content', {
          'c-accordion_item_content--active': isActive,
          [activeClassName ?? '']: isActive,
        })}
        style={{maxHeight: `${isActive ? scrollHeight : 0}px`}}
        {...restProps}
      >
        {children}
      </AsAble>
    );
  },
);

export const Accordion: typeof AccordionContainer & {
  Item: typeof AccordionItem;
  Handle: typeof AccordionHandle;
  Content: typeof AccordionContent;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = AccordionContainer as any;

Accordion.Item = AccordionItem;
Accordion.Handle = AccordionHandle;
Accordion.Content = AccordionContent;
