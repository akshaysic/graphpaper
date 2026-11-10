import { useRef, useState } from 'react';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cx } from '../../utils/cx';
import { useWidth } from '../../utils/useWidth';
import { px } from '../../utils/wire';
import { ArrowButton } from '../ArrowButton';
import { MediaCard, type MediaCardProps } from '../MediaCard';

export interface CardRailProps {
  items: MediaCardProps[];
  label?: string;
  start?: number;
  cardWidth?: number;
  gap?: number;
  className?: string;
}

// space-m, the gap between cards. The track is positioned in px, so the token's value is needed here.
const SPACE_M = 28.8;

export function CardRail({ items, label, start = 0, cardWidth = 420, gap = SPACE_M, className }: CardRailProps) {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const width = useWidth(wrap);
  const [index, setIndex] = useState(start);
  // The active card sits in the centre of the rail.
  const lead = width ? width / 2 - cardWidth / 2 : 0;

  // Wraps from the last card to the first, and back.
  function go(delta: number) {
    setIndex((current) => (current + delta + items.length) % items.length);
  }

  return (
    <div
      ref={wrap}
      className={cx('gp-rail', !reduced && 'gp-rail--animate', className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={label || 'Cards'}
    >
      <div className="gp-rail__track" style={{ transform: `translateX(${px(lead - index * (cardWidth + gap))})` }}>
        {items.map((item, k) => (
          <MediaCard key={k} {...item} active={k === index} style={{ width: cardWidth }} />
        ))}
      </div>
      <div className="gp-rail__controls" style={{ paddingLeft: px(lead) }}>
        <ArrowButton direction="prev" onClick={() => go(-1)} label="Previous card" />
        <ArrowButton direction="next" onClick={() => go(1)} label="Next card" />
        <span className="label muted" aria-live="polite">
          {index + 1} / {items.length}
        </span>
      </div>
    </div>
  );
}
