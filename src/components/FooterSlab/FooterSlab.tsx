import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

import { cx } from '../../utils/cx';
import { CtaTab } from '../CtaTab';
import { NavLink } from '../NavLink';
import { SplitHeadline } from '../SplitHeadline';
import type { Action } from '../types';

// Frozen in v1.1: ported from bundle.js as it is, see the Footer section of design/README.md.
export interface FooterSlabProps {
  statement?: [ReactNode, ReactNode];
  name?: ReactNode;
  about?: ReactNode;
  columns?: { title: string; links: { label: string; href?: string }[] }[];
  legal?: string;
  cta?: Action;
  theme?: 'light' | 'dark';
  className?: string;
}

type WireShape = { width: number; height: number; d: string; x: number; y: number };

export function FooterSlab({ statement, name, about, columns, legal, cta, theme, className }: FooterSlabProps) {
  const root = useRef<HTMLElement>(null);
  const slab = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [wire, setWire] = useState<WireShape | null>(null);

  // The connector runs from the slab's right edge to the top of the CTA tab. It is measured, so it is
  // redrawn on resize and once the font has loaded.
  useLayoutEffect(() => {
    function measure() {
      if (!root.current || !slab.current || !ctaRef.current) return;
      const r = root.current.getBoundingClientRect();
      const a = slab.current.getBoundingClientRect();
      const b = ctaRef.current.getBoundingClientRect();
      const x1 = a.right - r.left;
      const y1 = a.top - r.top + a.height * 0.45;
      const x2 = b.left - r.left + 40;
      const y2 = b.top - r.top + 2;
      setWire({
        width: r.width,
        height: r.height,
        d: `M${x1} ${y1} C${x1 + 90} ${y1 + 60}, ${x2 + 80} ${y2 - 140}, ${x2} ${y2}`,
        x: x1,
        y: y1,
      });
    }
    measure();
    window.addEventListener('resize', measure);
    const observer = window.ResizeObserver ? new ResizeObserver(measure) : null;
    if (observer && root.current) observer.observe(root.current);
    document.fonts?.ready.then(measure);
    return () => {
      window.removeEventListener('resize', measure);
      observer?.disconnect();
    };
  }, []);

  return (
    <footer ref={root} className={cx('gp-foot', className)} data-theme={theme || 'dark'}>
      <div ref={slab} className="gp-foot__slab">
        {statement?.length ? <SplitHeadline left={statement[0]} right={statement[1]} joiner="+" as="p" /> : null}
        <div className="gp-foot__about">
          {name ? <div className="display-l">{name}</div> : <span />}
          {about ? <p className="small">{about}</p> : null}
        </div>
        {columns ? (
          <div className="gp-foot__cols">
            {columns.map((column, i) => (
              <nav key={i} className="gp-foot__col" aria-label={column.title}>
                <h3 className="small">{column.title}</h3>
                <ul>
                  {(column.links || []).map((link, k) => (
                    <li key={k}>
                      <NavLink href={link.href}>{link.label}</NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        ) : null}
        {legal ? <p className="label-wide">{legal}</p> : null}
      </div>
      {wire ? (
        <svg className="gp-wires" width={wire.width} height={wire.height} aria-hidden="true">
          <path d={wire.d} />
          <circle cx={wire.x} cy={wire.y} r={3.5} />
        </svg>
      ) : null}
      {cta ? (
        <div ref={ctaRef} className="gp-foot__cta">
          <CtaTab size="xl" corner="tl" href={cta.href} onClick={cta.onClick}>
            {cta.label}
          </CtaTab>
        </div>
      ) : null}
    </footer>
  );
}
