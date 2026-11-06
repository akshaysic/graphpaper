import { createElement, type ReactNode } from 'react';

import { cx } from '../../utils/cx';

export interface SectionIntroProps {
  title: ReactNode;
  align?: 'left' | 'center';
  introPosition?: 'above' | 'below';
  as?: string;
  className?: string;
  children?: ReactNode;
}

export function SectionIntro({ title, align, introPosition, as = 'h2', className, children }: SectionIntroProps) {
  const heading = createElement(as, { key: 'title', className: 'display-xl gp-fluid-xl' }, title);
  const text = children ? (
    <p key="text" className="gp-intro__text intro">
      {children}
    </p>
  ) : null;
  return (
    <header className={cx('gp-intro', align === 'center' && 'gp-intro--center', className)}>
      {introPosition === 'above' ? [text, heading] : [heading, text]}
    </header>
  );
}
