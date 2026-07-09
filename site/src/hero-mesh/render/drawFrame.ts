import {
  AURORA_STOPS,
  EDGE_ALPHA_BOOST,
  HALO_OPACITY,
  HALO_RADIUS_MULTIPLIER,
  LINE_WIDTH_MIN,
  LINE_WIDTH_SCALE_FACTOR,
  NODE_RADIUS_BOOST,
  PALETTE,
  TRIANGLE_ALPHA_BOOST,
  VIGNETTE_INNER_RATIO,
  VIGNETTE_OUTER_ALPHA,
  VIGNETTE_OUTER_COLOR,
  VIGNETTE_OUTER_RATIO,
  WHITE_EDGE_BASE,
  WHITE_EDGE_DEPTH_FACTOR,
  WHITE_EDGE_SCALE_FACTOR,
} from '../constants';
import { edgeColorFor, pulseFor, triangleColorFor } from './colors';
import { project, rotate, rotationXFor, rotationYFor } from './projection';
import type { MeshTopology, ProjectedNode } from '../types';

function drawAurora(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Gradients depend on current W/H, so they're created fresh each frame
  // rather than cached, per the handoff's implementation notes. Additive:
  // drawn sequentially with no blend-mode override, accumulating naturally
  // on the dark background.
  for (const stop of AURORA_STOPS) {
    const cx = stop.xPct * width;
    const cy = stop.yPct * height;
    const radius = stop.radiusPct * width;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, `rgba(${stop.colorRgb}, ${stop.opacity})`);
    gradient.addColorStop(1, `rgba(${stop.colorRgb}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
}

function drawTriangles(
  ctx: CanvasRenderingContext2D,
  topology: MeshTopology,
  projected: ProjectedNode[],
  triOrder: number[]
) {
  // Painter's algorithm: farthest (highest rotated Z) first, so nearer
  // triangles correctly occlude farther ones. Sorted in place each frame —
  // triOrder is a persistent buffer owned by the caller, not reallocated here.
  triOrder.sort((i1, i2) => {
    const t1 = topology.triangles[i1];
    const t2 = topology.triangles[i2];
    const z1 = (projected[t1.a].z + projected[t1.b].z + projected[t1.c].z) / 3;
    const z2 = (projected[t2.a].z + projected[t2.b].z + projected[t2.c].z) / 3;
    return z2 - z1;
  });

  for (const idx of triOrder) {
    const tri = topology.triangles[idx];
    const na = topology.nodes[tri.a];
    const nb = topology.nodes[tri.b];
    const nc = topology.nodes[tri.c];
    const pa = projected[tri.a];
    const pb = projected[tri.b];
    const pc = projected[tri.c];

    const color = triangleColorFor(na, nb, nc);
    const avgDepth = (pa.depth + pb.depth + pc.depth) / 3;
    const alpha = Math.min(1, color.baseAlpha * avgDepth * TRIANGLE_ALPHA_BOOST);
    if (alpha <= 0) continue;

    ctx.fillStyle = `rgba(${color.rgb}, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(pa.screenX, pa.screenY);
    ctx.lineTo(pb.screenX, pb.screenY);
    ctx.lineTo(pc.screenX, pc.screenY);
    ctx.closePath();
    ctx.fill();
  }
}

function drawEdges(ctx: CanvasRenderingContext2D, topology: MeshTopology, projected: ProjectedNode[]) {
  for (const edge of topology.edges) {
    const na = topology.nodes[edge.a];
    const nb = topology.nodes[edge.b];
    const pa = projected[edge.a];
    const pb = projected[edge.b];
    const avgDepth = (pa.depth + pb.depth) / 2;
    const avgScale = (pa.scale + pb.scale) / 2;

    const color = edgeColorFor(na, nb);
    const baseAlpha = color.isWhite
      ? (WHITE_EDGE_BASE + WHITE_EDGE_DEPTH_FACTOR * avgDepth) * Math.min(1, avgScale * WHITE_EDGE_SCALE_FACTOR)
      : color.baseAlpha * avgDepth;
    const alpha = Math.min(1, baseAlpha * EDGE_ALPHA_BOOST);

    ctx.lineWidth = Math.max(LINE_WIDTH_MIN, avgScale * LINE_WIDTH_SCALE_FACTOR);
    ctx.strokeStyle = `rgba(${color.rgb}, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(pa.screenX, pa.screenY);
    ctx.lineTo(pb.screenX, pb.screenY);
    ctx.stroke();
  }
}

function drawNodes(
  ctx: CanvasRenderingContext2D,
  topology: MeshTopology,
  projected: ProjectedNode[],
  timeSeconds: number,
  skipHalo: boolean
) {
  for (const node of topology.nodes) {
    const p = projected[node.index];
    const entry = PALETTE[node.colorKey];
    const pulse = pulseFor(node, timeSeconds);
    const radius = entry.nodeBaseRadius * NODE_RADIUS_BOOST * p.scale;
    const isAccent = node.colorKey !== 'white';

    ctx.save();

    if (isAccent && !skipHalo) {
      const haloRadius = radius * HALO_RADIUS_MULTIPLIER;
      const haloAlpha = HALO_OPACITY * p.depth * pulse;
      const halo = ctx.createRadialGradient(p.screenX, p.screenY, 0, p.screenX, p.screenY, haloRadius);
      halo.addColorStop(0, `rgba(${entry.nodeGlowRgb}, ${haloAlpha})`);
      halo.addColorStop(1, `rgba(${entry.nodeGlowRgb}, 0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(p.screenX, p.screenY, haloRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowColor = `rgba(${entry.nodeGlowRgb}, ${entry.nodeGlowAlpha * p.depth * pulse})`;
    ctx.shadowBlur = entry.nodeGlowBlur * p.scale;
    ctx.fillStyle = `rgba(${entry.nodeFillRgb}, ${entry.nodeFillAlpha * p.depth * pulse})`;
    ctx.beginPath();
    ctx.arc(p.screenX, p.screenY, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

function drawVignette(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  const inner = VIGNETTE_INNER_RATIO * Math.min(width, height);
  const outer = VIGNETTE_OUTER_RATIO * Math.max(width, height);
  const gradient = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
  gradient.addColorStop(0, 'rgba(4, 7, 22, 0)');
  gradient.addColorStop(1, `rgba(${VIGNETTE_OUTER_COLOR}, ${VIGNETTE_OUTER_ALPHA})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

export interface DrawFrameParams {
  ctx: CanvasRenderingContext2D;
  topology: MeshTopology;
  /** Persistent buffer, same length as topology.triangles — sorted in place each frame, never reallocated. */
  triOrder: number[];
  canvasWidth: number;
  canvasHeight: number;
  timeSeconds: number;
  responsiveScale: number;
  skipHalo: boolean;
}

export function drawFrame({
  ctx,
  topology,
  triOrder,
  canvasWidth,
  canvasHeight,
  timeSeconds,
  responsiveScale,
  skipHalo,
}: DrawFrameParams) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  drawAurora(ctx, canvasWidth, canvasHeight);

  const rotY = rotationYFor(timeSeconds);
  const rotX = rotationXFor(timeSeconds);
  const projected: ProjectedNode[] = topology.nodes.map((node) =>
    project(rotate(node.world, rotY, rotX), canvasWidth, canvasHeight, responsiveScale)
  );

  drawTriangles(ctx, topology, projected, triOrder);
  drawEdges(ctx, topology, projected);
  drawNodes(ctx, topology, projected, timeSeconds, skipHalo);
  drawVignette(ctx, canvasWidth, canvasHeight);
}
