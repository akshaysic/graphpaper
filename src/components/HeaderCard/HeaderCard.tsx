import type { CSSProperties, ReactNode } from 'react';

import { cx } from '../../utils/cx';
import { CtaTab } from '../CtaTab';
import type { Action } from '../types';

export interface HeaderCardProps {
  label: string;
  /** text (default) and media set the body; action is a text card whose band means "act here". */
  tone?: 'text' | 'media' | 'action';
  src?: string;
  alt?: string;
  action?: Action;
  actionStyle?: CSSProperties;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

export function HeaderCard({ label, tone, src, alt, action, actionStyle, style, className, children }: HeaderCardProps) {
  const isMedia = tone === 'media';
  const mediaBody = src ? <img src={src} alt={alt || ''} /> : <div className="gp-placeholder body">{alt || 'Output'}</div>;
  return (
    // The section is named by its label, so the band repeating it stays out of the accessibility tree.
    <section className={cx('gp-hcard', isMedia && 'gp-hcard--media', tone === 'action' && 'gp-hcard--action', className)} style={style} aria-label={label}>
      <div className="gp-hcard__band label" aria-hidden="true">
        {label}
      </div>
      <div className={cx('gp-hcard__body', !isMedia && 'body')}>{isMedia ? mediaBody : children}</div>
      {action ? (
        <div className="gp-hcard__action" style={actionStyle}>
          <CtaTab size="s" corner="tr" href={action.href} onClick={action.onClick}>
            {action.label}
          </CtaTab>
        </div>
      ) : null}
    </section>
  );
}
