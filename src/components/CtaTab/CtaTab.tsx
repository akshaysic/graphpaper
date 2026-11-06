import type { CSSProperties, ReactNode } from 'react';

import { cx } from '../../utils/cx';
import type { Corner } from '../types';

export interface CtaTabProps {
  size?: 's' | 'l' | 'xl';
  corner?: Corner;
  href?: string;
  onClick?: () => void;
  style?: CSSProperties;
  className?: string;
  'aria-label'?: string;
  children?: ReactNode;
}

const TAB_TYPE: Record<NonNullable<CtaTabProps['size']>, string> = { s: 'label', l: 'display-l', xl: 'display-xl' };

export function CtaTab({ size = 's', corner = 'bl', href, onClick, style, className, 'aria-label': ariaLabel, children }: CtaTabProps) {
  const shared = {
    className: cx('gp-tab', `gp-tab--${size}`, `gp-tab--${corner}`, TAB_TYPE[size], className),
    style,
    'aria-label': ariaLabel,
  };
  if (href) {
    return (
      <a {...shared} href={href}>
        {children}
      </a>
    );
  }
  return (
    <button {...shared} type="button" onClick={onClick}>
      {children}
    </button>
  );
}
