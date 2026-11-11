import { useEffect, useRef, useState } from 'react';

import { cx } from '../../utils/cx';

export interface ToolChipItem {
  label: string;
  src?: string;
  alt?: string;
}

export interface ToolChipsProps {
  items: ToolChipItem[];
  layout?: 'row' | 'scatter';
  positions?: { x: number; y: number }[];
  height?: number;
  center?: { width?: number; height?: number; src?: string; alt?: string };
  className?: string;
}

function MediaLayer({ on, src, alt }: { on: boolean; src?: string; alt?: string }) {
  return (
    <div className={cx('gp-chips__media', on && 'is-on')} aria-hidden={!on}>
      {src ? <img src={src} alt={alt || ''} /> : <div className="gp-placeholder body">{alt}</div>}
    </div>
  );
}

export function ToolChips({ items, layout, positions, height, center, className }: ToolChipsProps) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const scatter = layout === 'scatter';

  // Everything resets when the cloud leaves the viewport.
  useEffect(() => {
    const element = root.current;
    if (!window.IntersectionObserver || !element) return undefined;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => !entry.isIntersecting && setActive(null)),
      { threshold: 0.1 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={root}
      className={cx('gp-chips', scatter ? 'gp-chips--scatter' : 'gp-chips--row', className)}
      style={scatter ? { height: height || 360 } : undefined}
    >
      {center ? (
        <div className="gp-chips__center" style={{ width: center.width || 240, height: center.height || 240 }}>
          <MediaLayer on={active == null} src={center.src} alt={center.alt || 'Source image'} />
          {items.map((item, index) => (
            <MediaLayer key={index} on={active === index} src={item.src} alt={item.alt || item.label} />
          ))}
        </div>
      ) : null}
      {items.map((item, index) => {
        const position = scatter ? positions?.[index] : undefined;
        return (
          <button
            key={index}
            type="button"
            aria-pressed={active === index}
            className={cx('gp-chip', 'intro', active === index && 'is-active', active != null && active !== index && 'is-dim')}
            style={position ? { left: `${position.x}%`, top: `${position.y}%` } : undefined}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(null)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
