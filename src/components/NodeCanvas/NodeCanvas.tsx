import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';

import { clamp } from '../../utils/clamp';
import { cx } from '../../utils/cx';
import { useWidth } from '../../utils/useWidth';
import { NodeCard } from '../NodeCard';
import { NODE_HEAD, Wire } from '../../utils/wire';

export interface CanvasNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type?: string;
  model?: string;
  kind?: 'media' | 'text';
  src?: string;
  alt?: string;
  text?: ReactNode;
}

export interface NodeCanvasProps {
  nodes: CanvasNode[];
  links?: [string, string][];
  nodesMobile?: CanvasNode[];
  linksMobile?: [string, string][];
  height?: number;
  draggable?: boolean;
  hint?: string;
  label?: string;
  className?: string;
}

type Drag = { id: string; startX: number; startY: number; originX: number; originY: number };

const NARROW = 768;
const KEY_STEP = 8;
const KEY_STEP_SHIFT = 32;

function headHeight(node: CanvasNode): number {
  return node.type || node.model ? NODE_HEAD : 0;
}

/** A port sits level with the top of the body, or halfway down a short one. */
function portY(node: CanvasNode): number {
  return node.y + headHeight(node) + Math.min(24, (node.h || 100) / 2);
}

function copyNodes(list: CanvasNode[]): CanvasNode[] {
  return list.map((node) => ({ ...node }));
}

export function NodeCanvas({ nodes: desktopNodes = [], links = [], nodesMobile, linksMobile, height = 480, draggable, hint, label, className }: NodeCanvasProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const width = useWidth(wrap);
  const narrow = width > 0 && width < NARROW;
  const [nodes, setNodes] = useState(() => copyNodes(desktopNodes));
  // bundle.js swaps to the phone layout when the width crosses 768, and only when one is given.
  // Adjusting state during render keeps that without an effect.
  const [layoutNarrow, setLayoutNarrow] = useState(narrow);
  if (layoutNarrow !== narrow) {
    setLayoutNarrow(narrow);
    if (nodesMobile) setNodes(copyNodes(narrow ? nodesMobile : desktopNodes));
  }
  const drag = useRef<Drag | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const canDrag = draggable !== false && !narrow;

  function move(id: string, x: number, y: number) {
    setNodes((list) =>
      list.map((node) => {
        if (node.id !== id) return node;
        const fullHeight = (node.h || 100) + headHeight(node);
        return { ...node, x: clamp(x, 0, Math.max(0, width - node.w)), y: clamp(y, 0, height - fullHeight) };
      }),
    );
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>, node: CanvasNode) {
    if (!canDrag || event.button > 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: node.id, startX: event.clientX, startY: event.clientY, originX: node.x, originY: node.y };
    setDragging(node.id);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (current) move(current.id, current.originX + event.clientX - current.startX, current.originY + event.clientY - current.startY);
  }

  function onPointerUp() {
    drag.current = null;
    setDragging(null);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>, node: CanvasNode) {
    const step = event.shiftKey ? KEY_STEP_SHIFT : KEY_STEP;
    let dx = 0;
    let dy = 0;
    if (event.key === 'ArrowLeft') dx = -step;
    else if (event.key === 'ArrowRight') dx = step;
    else if (event.key === 'ArrowUp') dy = -step;
    else if (event.key === 'ArrowDown') dy = step;
    else return;
    event.preventDefault();
    move(node.id, node.x + dx, node.y + dy);
  }

  const byId = new Map(nodes.map((node) => [node.id, node]));
  const wires = (narrow && linksMobile ? linksMobile : links).map(([from, to], index) => {
    const a = byId.get(from);
    const b = byId.get(to);
    return a && b ? <Wire key={index} from={[a.x + a.w, portY(a)]} to={[b.x, portY(b)]} /> : null;
  });

  return (
    <div ref={wrap} className={cx('gp-canvas', 'gp-paper', className)} style={{ height }} role="group" aria-label={label || 'Workflow canvas'}>
      <svg className="gp-wires" aria-hidden="true">
        {wires}
      </svg>
      {width
        ? nodes.map((node) => {
            const name = [node.type, node.model].filter(Boolean).join(' ') || 'Node';
            const isDragging = dragging === node.id;
            return (
              <NodeCard
                key={node.id}
                type={node.type}
                model={node.model}
                kind={node.kind}
                src={node.src}
                alt={node.alt}
                width={node.w}
                height={node.h}
                dragging={isDragging}
                style={{ left: node.x, top: node.y, zIndex: isDragging ? 2 : 1 }}
                nodeProps={
                  canDrag
                    ? {
                        tabIndex: 0,
                        role: 'group',
                        'data-drag': 'on',
                        'aria-roledescription': 'movable node',
                        'aria-label': `${name}. Arrow keys move it.`,
                        onPointerDown: (event) => onPointerDown(event, node),
                        onPointerMove,
                        onPointerUp,
                        onPointerCancel: onPointerUp,
                        onKeyDown: (event) => onKeyDown(event, node),
                      }
                    : { role: 'group', 'aria-label': name }
                }
              >
                {node.text}
              </NodeCard>
            );
          })
        : null}
      {hint && canDrag ? (
        <span className="gp-canvas__hint label muted" aria-hidden="true">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
