import type { ReactNode } from 'react';

import { cx } from '../../utils/cx';

export interface NavLinkProps {
  href?: string;
  current?: boolean;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

export function NavLink({ href, current, onClick, className, children }: NavLinkProps) {
  return (
    <a className={cx('gp-navlink', 'label', className)} href={href || '#'} aria-current={current ? 'page' : undefined} onClick={onClick}>
      {children}
    </a>
  );
}
