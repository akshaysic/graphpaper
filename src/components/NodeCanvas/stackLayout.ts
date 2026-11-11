import { NODE_HEAD } from '../../utils/wire';
import type { CanvasNode } from './NodeCanvas';

type Point = [number, number];

export interface StackWire {
  from: Point;
  to: Point;
  /** Set for a link that skips a node: the x of the lane it runs down, right of the column. */
  laneX?: number;
}

export interface StackLayout {
  nodes: CanvasNode[];
  wires: StackWire[];
  height: number;
  /** Vertical room a connector has between an output port and the next input port. */
  reach: number;
}

// px values of the spacing tokens, because node positions are numbers, not CSS.
const SPACE_S = 14.4;
const SPACE_M = 28.8;
/** Canvas padding around the column: space-s. */
const PAD = SPACE_S;
/** Room between stacked nodes for a connector to turn: two space-m. */
const GAP = 2 * SPACE_M;
/** The input disc (4.5px) sits just above the head row, so it never covers the node's label. */
const PORT_LIFT = 7;
/** First lane space-s right of the column, each further lane space-s beyond it. */
const LANE_OFFSET = SPACE_S;
const LANE_STEP = SPACE_S;

function headHeight(node: CanvasNode): number {
  return node.type || node.model ? NODE_HEAD : 0;
}

/** Pipeline order: every node after the nodes that feed it, ties kept in the given order. Cycles fall back to that order. */
function pipelineOrder(nodes: CanvasNode[], links: [string, string][]): CanvasNode[] {
  const ids = new Set(nodes.map((node) => node.id));
  const inputs = new Map(nodes.map((node) => [node.id, 0]));
  for (const [from, to] of links) {
    if (ids.has(from) && ids.has(to) && from !== to) inputs.set(to, (inputs.get(to) ?? 0) + 1);
  }
  const placed = new Set<string>();
  const order: CanvasNode[] = [];
  while (order.length < nodes.length) {
    const next = nodes.find((node) => !placed.has(node.id) && inputs.get(node.id) === 0) ?? nodes.find((node) => !placed.has(node.id));
    if (!next) break;
    placed.add(next.id);
    order.push(next);
    for (const [from, to] of links) {
      if (from === next.id && !placed.has(to)) inputs.set(to, (inputs.get(to) ?? 1) - 1);
    }
  }
  return order;
}

/** Gives each skipping link the innermost lane that is free over its span. Returns lane index per link, -1 for none. */
function assignLanes(spans: ([number, number] | null)[]): { lanes: number[]; laneCount: number } {
  const laneEnds: number[] = [];
  const lanes = spans.map(() => -1);
  const byStart = spans
    .map((span, index) => ({ span, index }))
    .filter((entry): entry is { span: [number, number]; index: number } => entry.span !== null)
    .sort((left, right) => left.span[0] - right.span[0] || left.span[1] - right.span[1]);
  for (const { span, index } of byStart) {
    let lane = laneEnds.findIndex((end) => end <= span[0]);
    if (lane === -1) lane = laneEnds.push(0) - 1;
    laneEnds[lane] = span[1];
    lanes[index] = lane;
  }
  return { lanes, laneCount: laneEnds.length };
}

/**
 * The phone layout of a NodeCanvas: one centred column in pipeline order, inside the canvas at any width.
 * Ports sit on the bottom and top edges, so connectors run top to bottom. A link between neighbours drops
 * straight down; a link that skips nodes runs down a lane right of the column instead of behind them.
 */
export function stackLayout(source: CanvasNode[], links: [string, string][], width: number): StackLayout {
  const ordered = pipelineOrder(source, links);
  const rowOf = new Map(ordered.map((node, row) => [node.id, row]));
  const spans = links.map(([from, to]): [number, number] | null => {
    const fromRow = rowOf.get(from);
    const toRow = rowOf.get(to);
    if (fromRow === undefined || toRow === undefined || Math.abs(toRow - fromRow) <= 1) return null;
    return [Math.min(fromRow, toRow), Math.max(fromRow, toRow)];
  });
  const { lanes, laneCount } = assignLanes(spans);
  const laneSpace = laneCount ? LANE_OFFSET + (laneCount - 1) * LANE_STEP : 0;

  const widest = Math.max(0, ...ordered.map((node) => node.w));
  const column = Math.max(0, Math.min(widest, width - 2 * PAD - laneSpace));
  const left = Math.max(PAD, (width - column - laneSpace) / 2);
  const centre = left + column / 2;

  let top = PAD;
  const nodes = ordered.map((node) => {
    const nodeWidth = Math.min(node.w, column);
    const scale = node.w ? nodeWidth / node.w : 1;
    const bodyHeight = node.h || 100;
    // Media keeps its aspect ratio; a narrower text body gets taller so its lines still fit.
    const nodeHeight = Math.round(node.kind === 'text' ? bodyHeight / scale : bodyHeight * scale);
    const placed = { ...node, x: Math.round(centre - nodeWidth / 2), y: Math.round(top), w: Math.round(nodeWidth), h: nodeHeight };
    top += headHeight(node) + nodeHeight + GAP;
    return placed;
  });
  const byId = new Map(nodes.map((node) => [node.id, node]));

  const wires = links.flatMap(([from, to], index): StackWire[] => {
    const fromNode = byId.get(from);
    const toNode = byId.get(to);
    if (!fromNode || !toNode) return [];
    const wire: StackWire = {
      from: [centre, fromNode.y + headHeight(fromNode) + (fromNode.h || 100)],
      to: [centre, toNode.y - PORT_LIFT],
    };
    if (lanes[index] >= 0) wire.laneX = left + column + LANE_OFFSET + lanes[index] * LANE_STEP;
    return [wire];
  });

  return { nodes, wires, height: Math.ceil(top - GAP + PAD), reach: GAP - PORT_LIFT };
}
