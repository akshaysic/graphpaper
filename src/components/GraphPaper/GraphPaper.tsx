import { createElement, type CSSProperties, type ReactNode } from 'react';

import { cx } from '../../utils/cx';

export interface GraphPaperProps {
  as?: string;
  framed?: boolean;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

export function GraphPaper({ as = 'div', framed, style, className, children }: GraphPaperProps) {
  return createElement(as, { className: cx('gp-paper', framed && 'gp-paper--framed', className), style }, children);
}
