import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

import { cx } from '../../utils/cx';

export interface NodeCardProps {
  type?: string;
  model?: string;
  kind?: 'media' | 'text';
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

/** What NodeCanvas passes to make a card movable. Not part of the public props in index.d.ts. */
export interface NodeCardCanvasProps {
  nodeProps?: HTMLAttributes<HTMLDivElement> & { 'data-drag'?: 'on' };
  dragging?: boolean;
}

export function NodeCard({ type, model, kind, src, alt, width, height, style, className, children, nodeProps, dragging }: NodeCardProps & NodeCardCanvasProps) {
  const bodySize = { height, flex: height != null ? 'none' : undefined };
  const body =
    kind === 'text' ? (
      <div className="gp-node__body gp-node__body--text body" style={bodySize}>
        {children}
      </div>
    ) : (
      <div className="gp-node__body" style={bodySize}>
        {src ? <img src={src} alt={alt || ''} /> : <div className="gp-placeholder body">{alt || 'Media'}</div>}
      </div>
    );
  return (
    <div className={cx('gp-node', !nodeProps && 'is-static', dragging && 'is-dragging', className)} style={{ width, ...style }} {...nodeProps}>
      {type || model ? (
        <div className="gp-node__head">
          {type ? <span className="label">{type}</span> : null}
          {model ? <span className="label-wide muted">{model}</span> : null}
        </div>
      ) : null}
      {body}
    </div>
  );
}
