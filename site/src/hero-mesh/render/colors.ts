import { PALETTE, PULSE_AMPLITUDE, PULSE_BASE, PULSE_PHASE_STEP, PULSE_SPEED } from '../constants';
import type { MeshNode } from '../types';

function parseRgb(rgb: string): [number, number, number] {
  const [r, g, b] = rgb.split(',').map((s) => parseFloat(s));
  return [r, g, b];
}

function blendRgb(rgbs: string[]): string {
  if (rgbs.length === 1) return rgbs[0];
  const sum = [0, 0, 0];
  for (const rgb of rgbs) {
    const [r, g, b] = parseRgb(rgb);
    sum[0] += r;
    sum[1] += g;
    sum[2] += b;
  }
  const n = rgbs.length;
  return `${Math.round(sum[0] / n)}, ${Math.round(sum[1] / n)}, ${Math.round(sum[2] / n)}`;
}

function average(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export interface ResolvedColor {
  rgb: string;
  baseAlpha: number;
  isWhite: boolean;
}

/**
 * Edge colour, per the handoff's per-endpoint rules. The handoff's table
 * assumes exactly one accent endpoint per edge; where both endpoints are
 * different accents (rare — only ~9/44 nodes are accent, k=5), the two
 * colours are blended rather than arbitrarily picking one, so it reads as
 * intentional rather than a coin-flip.
 */
export function edgeColorFor(a: MeshNode, b: MeshNode): ResolvedColor {
  const accents = [a, b].filter((n) => n.colorKey !== 'white');
  if (accents.length === 0) {
    return { rgb: PALETTE.white.edgeRgb, baseAlpha: 0, isWhite: true };
  }
  const distinctKeys = Array.from(new Set(accents.map((n) => n.colorKey)));
  const entries = distinctKeys.map((k) => PALETTE[k]);
  return {
    rgb: blendRgb(entries.map((e) => e.edgeRgb)),
    baseAlpha: average(entries.map((e) => e.edgeBaseAlpha)),
    isWhite: false,
  };
}

/** Same blending approach as edges, extended to a triangle's 3 vertices. */
export function triangleColorFor(a: MeshNode, b: MeshNode, c: MeshNode): ResolvedColor {
  const accents = [a, b, c].filter((n) => n.colorKey !== 'white');
  if (accents.length === 0) {
    return { rgb: PALETTE.white.triangleRgb, baseAlpha: PALETTE.white.triangleBaseAlpha, isWhite: true };
  }
  const distinctKeys = Array.from(new Set(accents.map((n) => n.colorKey)));
  const entries = distinctKeys.map((k) => PALETTE[k]);
  return {
    rgb: blendRgb(entries.map((e) => e.triangleRgb)),
    baseAlpha: average(entries.map((e) => e.triangleBaseAlpha)),
    isWhite: false,
  };
}

/**
 * pulse = 0.80 + 0.20 * sin(time * 2.0 + nodeIndex * 0.88). Accent nodes
 * only — white nodes hold steady at 1.0 (no pulse), per the handoff.
 */
export function pulseFor(node: MeshNode, timeSeconds: number): number {
  if (node.colorKey === 'white') return 1;
  return PULSE_BASE + PULSE_AMPLITUDE * Math.sin(timeSeconds * PULSE_SPEED + node.index * PULSE_PHASE_STEP);
}
