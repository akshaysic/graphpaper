import { createElement, type CSSProperties, type ReactNode } from 'react';

import { cx } from '../../utils/cx';

export interface SplitHeadlineProps {
  left: ReactNode;
  right: ReactNode;
  emphasis?: 'left' | 'right' | 'both';
  joiner?: '+' | ReactNode;
  size?: 'xl' | 'l';
  as?: string;
  style?: CSSProperties;
  className?: string;
}

export function SplitHeadline({ left, right, emphasis = 'both', joiner, size, as = 'h2', style, className }: SplitHeadlineProps) {
  const joinerNode =
    joiner === '+' ? (
      <span className="gp-plus" role="img" aria-label="plus">
        +
      </span>
    ) : (
      joiner
    );
  const sizeClass = size === 'l' ? 'display-l gp-fluid-l' : 'display-xl gp-fluid-xl';
  return createElement(
    as,
    { className: cx('gp-split', sizeClass, className), style },
    <span className={cx('gp-split__half', emphasis === 'right' && 'is-rest')}>{left}</span>,
    joinerNode || null,
    <span className={cx('gp-split__half', emphasis === 'left' && 'is-rest')}>{right}</span>,
  );
}
