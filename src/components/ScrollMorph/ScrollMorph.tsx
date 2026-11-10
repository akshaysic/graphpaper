import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { clamp } from '../../utils/clamp';
import { cx } from '../../utils/cx';
import { useWidth } from '../../utils/useWidth';
import { px, Wire } from '../../utils/wire';
import { HeaderCard } from '../HeaderCard';
import { NodeCard } from '../NodeCard';
import { SplitHeadline } from '../SplitHeadline';
import { Toggle } from '../Toggle';

export interface ScrollMorphProps {
  left?: string;
  right?: string;
  height?: number;
  runway?: number;
  size?: 'xl' | 'l';
  prompt?: ReactNode;
  outputAlt?: string;
  labels?: { prompt?: string; output?: string; run?: string };
  label?: string;
  className?: string;
}

type Box = [x: number, y: number, w: number, h: number];
type Piece = 'prompt' | 'nodeA' | 'nodeB' | 'nodeC' | 'output';

// [x, y, w, h] as fractions of the field: a = scattered graph, b = docked tool.
const MORPH: Record<Piece, { a: Box; b: Box }> = {
  prompt: { a: [0.04, 0.1, 0.25, 0.52], b: [0, 0, 0.3, 0.97] },
  nodeA: { a: [0.36, 0.0, 0.14, 0.5], b: [0.56, 0.3, 0.1, 0.3] },
  nodeB: { a: [0.22, 0.66, 0.11, 0.3], b: [0.56, 0.4, 0.1, 0.25] },
  nodeC: { a: [0.56, 0.06, 0.12, 0.26], b: [0.6, 0.3, 0.1, 0.25] },
  output: { a: [0.7, 0.12, 0.26, 0.56], b: [0.315, 0, 0.685, 0.97] },
};
const PIECES = Object.keys(MORPH) as Piece[];
// Ports sit this far below the top of a piece.
const PORT_DROP = 45;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
/** Progress through the a..b stretch of p, clamped to 0..1. */
const segment = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);

export function ScrollMorph({ left, right, height = 560, runway: runwayProp, size, prompt, outputAlt, labels = {}, label, className }: ScrollMorphProps) {
  const reduced = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLDivElement>(null);
  const fieldWidth = useWidth(field);
  // Under reduced motion there is no runway: the section does not pin.
  const runway = reduced ? 1 : runwayProp || 2.6;
  const [p, setP] = useState(0);
  const [fieldHeight, setFieldHeight] = useState(0);

  useLayoutEffect(() => {
    const element = field.current;
    if (!element) return;
    const measure = () => setFieldHeight(element.clientHeight);
    measure();
  }, [fieldWidth, height]);

  // Scroll is the clock: progress is the scroller's position through its runway.
  useEffect(() => {
    const element = scroller.current;
    if (!element || reduced) return undefined;
    let frame = 0;
    function read() {
      frame = 0;
      if (!element) return;
      const max = element.scrollHeight - element.clientHeight;
      setP(max > 0 ? clamp(element.scrollTop / max, 0, 1) : 0);
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(read);
    }
    read();
    element.addEventListener('scroll', schedule, { passive: true });
    return () => {
      element.removeEventListener('scroll', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  // The toggle scrolls to either end; under reduced motion it swaps the view instantly.
  function flip(on: boolean) {
    if (reduced) {
      setP(on ? 1 : 0);
      return;
    }
    scroller.current?.scrollTo({ top: on ? scroller.current.scrollHeight : 0, behavior: 'smooth' });
  }

  const W = fieldWidth || 1;
  const H = fieldHeight || 1;
  const t = easeOutCubic(segment(p, 0.1, 0.85));
  // Connectors and side nodes fade out by 55%; the Run tab fades in from 55% to 90%.
  const fade = 1 - segment(p, 0.15, 0.55);
  const showRun = segment(p, 0.55, 0.9);
  // The Run tab takes clicks and focus from the same point: past halfway through its fade-in.
  const runReady = showRun > 0.5;

  // Until then it is inert, so Tab never lands on a tab that cannot be seen. HeaderCard owns the
  // action's wrapper, so the flag is set on that element directly.
  useEffect(() => {
    const action = field.current?.querySelector<HTMLElement>('.gp-hcard__action');
    if (action) action.inert = !runReady;
  }, [runReady, fieldWidth]);
  const boxes = Object.fromEntries(
    PIECES.map((piece) => [piece, MORPH[piece].a.map((value, i) => lerp(value, MORPH[piece].b[i], t)) as Box]),
  ) as Record<Piece, Box>;

  function boxStyle(piece: Piece, extra?: CSSProperties): CSSProperties {
    const [x, y, w, h] = boxes[piece];
    return { transform: `translate(${px(x * W)},${px(y * H)})`, width: px(w * W), height: px(h * H), ...extra };
  }
  const outPort = (piece: Piece): [number, number] => [(boxes[piece][0] + boxes[piece][2]) * W, boxes[piece][1] * H + PORT_DROP];
  const inPort = (piece: Piece): [number, number] => [boxes[piece][0] * W, boxes[piece][1] * H + PORT_DROP];

  const sideNode = (piece: Piece, type: string, model: string, alt: string) => (
    <div key={piece} className="gp-morph__item" style={boxStyle(piece, { opacity: fade })} aria-hidden={p > 0.5}>
      <NodeCard type={type} model={model} alt={alt} width="100%" style={{ height: '100%' }} />
    </div>
  );

  return (
    <div
      ref={scroller}
      className={cx('gp-morph', 'gp-paper', className)}
      style={{ height, overflowY: reduced ? 'hidden' : 'auto' }}
      // The scroll area takes focus so the keyboard can scroll it; without a runway there is nothing to scroll.
      tabIndex={reduced ? undefined : 0}
      role="region"
      aria-label={label || 'Graph to tool. Scroll inside to switch views.'}
    >
      <div style={{ height: height * runway }}>
        <div className="gp-morph__stage" style={{ height }}>
          <SplitHeadline
            size={size || 'l'}
            left={left || 'From Graph'}
            right={right || 'to Tool'}
            emphasis={p < 0.5 ? 'left' : 'right'}
            joiner={<Toggle progress={reduced ? undefined : p} checked={p >= 0.5} onChange={flip} label="Show the simplified tool" />}
          />
          <div ref={field} className="gp-morph__field">
            {fieldWidth ? (
              <>
                <svg className="gp-wires" aria-hidden="true" style={{ opacity: fade }}>
                  <Wire from={outPort('prompt')} to={inPort('nodeA')} />
                  <Wire from={outPort('nodeB')} to={inPort('nodeA')} />
                  <Wire from={outPort('nodeA')} to={inPort('output')} />
                  <Wire from={outPort('nodeC')} to={inPort('output')} />
                </svg>
                <div className="gp-morph__item" style={boxStyle('prompt')}>
                  <HeaderCard label={labels.prompt || 'Prompt'} style={{ height: '100%' }}>
                    {prompt || 'A glass loom on a pale bench, soft light from the left, strands falling into a tray.'}
                  </HeaderCard>
                </div>
                {sideNode('nodeA', 'Image', 'Diffusion 3', 'Generated draft')}
                {sideNode('nodeB', 'Image', 'Reference', 'Reference photo')}
                {sideNode('nodeC', 'Color', 'Style', 'Colour swatch')}
                <div className="gp-morph__item" style={boxStyle('output')}>
                  <HeaderCard
                    label={labels.output || 'Output'}
                    tone="media"
                    alt={outputAlt || 'Final render'}
                    style={{ height: '100%' }}
                    action={{ label: labels.run || 'Run' }}
                    actionStyle={{ opacity: showRun, pointerEvents: runReady ? 'auto' : 'none' }}
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
