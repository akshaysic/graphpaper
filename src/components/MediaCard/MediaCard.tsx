import { Fragment, type CSSProperties } from 'react';

import { cx } from '../../utils/cx';
import { CtaTab } from '../CtaTab';

export interface MediaCardProps {
  title: string;
  src?: string;
  alt?: string;
  tags?: string[];
  href?: string;
  onAction?: () => void;
  actionLabel?: string;
  active?: boolean;
  style?: CSSProperties;
  className?: string;
}

export function MediaCard({ title, src, alt, tags = [], href, onAction, actionLabel, active, style, className }: MediaCardProps) {
  const action = actionLabel || 'Try';
  return (
    <article className={cx('gp-card', active && 'is-active', className)} style={style}>
      <h3 className="title">{title}</h3>
      <div className="gp-card__frame">
        <div className="gp-card__img">{src ? <img src={src} alt={alt || ''} /> : <div className="gp-placeholder small">{alt || 'Preview image'}</div>}</div>
        {tags.length ? (
          // The tag chain is a picture of the workflow steps; the title already names the card.
          <div className="gp-card__tags" aria-hidden="true">
            {tags.map((tag, index) => (
              <Fragment key={index}>
                {index ? <span className="gp-tagline" /> : null}
                <span className="gp-tag label">{tag}</span>
              </Fragment>
            ))}
          </div>
        ) : null}
        <div className="gp-card__cta">
          <CtaTab size="s" corner="tr" href={href} onClick={onAction} aria-label={`${action} ${title}`}>
            {action}
          </CtaTab>
        </div>
      </div>
    </article>
  );
}
