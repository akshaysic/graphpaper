import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cx } from '../../utils/cx';

/** root: the scrolling element when it is not the window. */
export interface RevealProps {
  as?: string;
  root?: RefObject<HTMLElement | null>;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

type RevealState = 'idle' | 'hidden' | 'in';

export function Reveal({ as = 'div', root, style, className, children }: RevealProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // Starts idle, so nothing is hidden before JavaScript runs.
  const [state, setState] = useState<RevealState>('idle');

  useEffect(() => {
    const element = ref.current;
    if (reduced || !element || !window.IntersectionObserver) return undefined;
    const scrollRoot = root ? root.current : null;
    const bottom = scrollRoot ? scrollRoot.getBoundingClientRect().bottom : window.innerHeight;
    // Already on screen: never hide it.
    if (element.getBoundingClientRect().top < bottom) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setState('in');
          observer.disconnect();
        }
      },
      { root: scrollRoot, threshold: 0.2 },
    );
    setState('hidden');
    observer.observe(element);
    return () => observer.disconnect();
    // root is a ref; bundle.js reads it once, when the preference is known.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // `as` names any block element; typing it as div lets the ref through. bundle.js renders it the same way.
  const Tag = as as 'div';
  return (
    <Tag ref={ref} className={cx(state !== 'idle' && 'gp-reveal', state === 'in' && 'is-in', className)} style={style}>
      {children}
    </Tag>
  );
}
