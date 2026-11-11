type Point = [number, number];

/** A node's head row: label line height plus space-xs, as bundle.js measures it. */
export const NODE_HEAD = 21.2;

/** Cubic connector from an output port to an input port. Both ends leave horizontally. */
export function curve(a: Point, b: Point): string {
  const dx = Math.max(40, Math.abs(b[0] - a[0]) / 2);
  return `M${a[0]} ${a[1]} C${a[0] + dx} ${a[1]}, ${b[0] - dx} ${b[1]}, ${b[0]} ${b[1]}`;
}

/** Cubic connector from an output port on a bottom edge to an input port on a top edge. Both ends run vertically. */
export function downCurve(a: Point, b: Point): string {
  const dy = Math.max(20, Math.abs(b[1] - a[1]) / 2);
  return `M${a[0]} ${a[1]} C${a[0]} ${a[1] + dy}, ${b[0]} ${b[1] - dy}, ${b[0]} ${b[1]}`;
}

/**
 * A vertical connector that turns out to a lane at laneX, runs down it past the nodes in between, and turns back in.
 * reach is the vertical room each turn takes. Both ends still run vertically.
 */
export function laneCurve(a: Point, b: Point, laneX: number, reach: number): string {
  const half = reach / 2;
  return (
    `M${a[0]} ${a[1]} C${a[0]} ${a[1] + half}, ${laneX} ${a[1] + half}, ${laneX} ${a[1] + reach} ` +
    `L${laneX} ${b[1] - reach} C${laneX} ${b[1] - half}, ${b[0]} ${b[1] - half}, ${b[0]} ${b[1]}`
  );
}

/** A connector with a port disc at each end. Render inside an svg.gp-wires. d replaces the default horizontal curve. */
export function Wire({ from, to, d }: { from: Point; to: Point; d?: string }) {
  return (
    <g>
      <path d={d ?? curve(from, to)} />
      <circle cx={from[0]} cy={from[1]} r={4.5} />
      <circle cx={to[0]} cy={to[1]} r={4.5} />
    </g>
  );
}

/** Rounds to two decimals and adds px, as bundle.js does for transforms. */
export function px(value: number): string {
  return `${Math.round(value * 100) / 100}px`;
}
