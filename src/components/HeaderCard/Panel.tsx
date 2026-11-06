import type { CSSProperties, ReactNode } from 'react';

import { cx } from '../../utils/cx';

export interface PanelProps {
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

export function Panel({ style, className, children }: PanelProps) {
  return (
    <div className={cx('gp-panel', className)} style={style}>
      {children}
    </div>
  );
}
