type Point = [number, number];

/** A node's head row: label line height plus space-xs, as bundle.js measures it. */
export const NODE_HEAD = 21.2;

/** Cubic connector from an output port to an input port. Both ends leave horizontally. */
export function curve(a: Point, b: Point): string {
  const dx = Math.max(40, Math.abs(b[0] - a[0]) / 2);
  return `M${a[0]} ${a[1]} C${a[0] + dx} ${a[1]}, ${b[0] - dx} ${b[1]}, ${b[0]} ${b[1]}`;
}

/** A connector with a port disc at each end. Render inside an svg.gp-wires. */
export function Wire({ from, to }: { from: Point; to: Point }) {
  return (
    <g>
      <path d={curve(from, to)} />
      <circle cx={from[0]} cy={from[1]} r={4.5} />
      <circle cx={to[0]} cy={to[1]} r={4.5} />
    </g>
  );
}

/** Rounds to two decimals and adds px, as bundle.js does for transforms. */
export function px(value: number): string {
  return `${Math.round(value * 100) / 100}px`;
}
