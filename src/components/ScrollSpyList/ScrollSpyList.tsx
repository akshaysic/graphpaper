import { useEffect, useRef, useState, type ReactNode } from 'react';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { px } from '../../utils/wire';

/** height: its own scroll area of that height; without it, the window scrolls. */
export interface ScrollSpyListProps {
  items: string[];
  aside?: ReactNode;
  offset?: number;
  height?: number;
  onActiveChange?: (index: number) => void;
  className?: string;
}

// Below 768 the activation line drops from 20% to 40% of the viewport.
const NARROW = 768;
const NARROW_OFFSET = 0.4;

export function ScrollSpyList({ items, aside, offset = 0.2, height, onActiveChange, className }: ScrollSpyListProps) {
  const reduced = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  // The latest callback, read by the scroll listener without re-subscribing it.
  const onChange = useRef(onActiveChange);
  useEffect(() => {
    onChange.current = onActiveChange;
  });

  useEffect(() => {
    const element = scroller.current;
    const target: HTMLElement | Window = element || window;
    let frame = 0;
    let last = -1;

    // The active item is the last one whose top has crossed the activation line.
    function read() {
      frame = 0;
      const top = element ? element.getBoundingClientRect().top : 0;
      const viewport = element ? element.clientHeight : window.innerHeight;
      const line = top + viewport * (window.innerWidth < NARROW ? NARROW_OFFSET : offset);
      let index = 0;
      itemRefs.current.forEach((node, k) => {
        if (node && node.getBoundingClientRect().top <= line) index = k;
      });
      if (index !== last) {
        last = index;
        setActive(index);
        onChange.current?.(index);
      }
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(read);
    }

    read();
    target.addEventListener('scroll', schedule, { passive: true });
    return () => {
      target.removeEventListener('scroll', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [offset]);

  // Names are buttons that scroll themselves onto the activation line.
  function jump(index: number) {
    const node = itemRefs.current[index];
    const element = scroller.current;
    if (!node) return;
    const behavior = reduced ? 'auto' : 'smooth';
    if (element) {
      const top = node.getBoundingClientRect().top - element.getBoundingClientRect().top + element.scrollTop - element.clientHeight * offset + 2;
      element.scrollTo({ top, behavior });
    } else {
      node.scrollIntoView({ block: 'center', behavior });
    }
  }

  const body = (
    <div className="gp-spy">
      <div className="gp-spy__aside">{aside}</div>
      <ol className="gp-spy__list display-xl gp-fluid-xl" style={height ? { paddingTop: px(height * offset) } : undefined}>
        {items.map((item, k) => (
          <li
            key={k}
            ref={(node) => {
              itemRefs.current[k] = node;
            }}
          >
            <button type="button" className="gp-spy__item" aria-current={k === active ? 'true' : undefined} onClick={() => jump(k)}>
              {item}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );

  return height ? (
    <div ref={scroller} className={className} style={{ height, overflowY: 'auto', overscrollBehavior: 'contain' }}>
      {body}
    </div>
  ) : (
    <div className={className}>{body}</div>
  );
}
