import {
  BASE_POINT_COUNT,
  LOOSE_SPREAD_X,
  MESH_CENTER_X,
  MESH_CENTER_Y,
  MESH_SPREAD_Y,
  MESH_Z_MAX,
  MESH_Z_MIN,
  TIGHT_SPREAD_X,
} from '../constants';
import { bell, rangeBell, type Rng } from '../rng';
import type { ColorKey, RegionKey, Vec3 } from '../types';

export type UnindexedNode = { world: Vec3; colorKey: ColorKey; region: RegionKey };

// Fix: was 0.2 with a hard binary left/right hue split — read as "mostly
// white with one or two colored areas". Bumped up plus switched to a smooth
// gradient below so accents are both more present and genuinely distributed.
const ACCENT_CHANCE = 0.26;

/**
 * Bell curve, but with a different spread on each side of zero — denser
 * (tighter) toward negative X, sparser (looser) toward positive X. This is
 * what produces the ~25% left/right density difference from one continuous
 * distribution, instead of two separate zones with a seam between them.
 */
function asymmetricJitterX(rng: Rng): number {
  const b = bell(rng);
  return b * (b < 0 ? TIGHT_SPREAD_X : LOOSE_SPREAD_X);
}

const COLOR_SEQUENCE: ColorKey[] = ['teal', 'cyan', 'blue', 'violet'];
// How far a node's colour can jump from its "natural" gradient position, as
// a fraction of the full span — high enough that colours genuinely
// intermix near the transitions rather than forming hard bands.
const GRADIENT_JITTER = 0.5;

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

/**
 * Maps a node's X position to a smooth teal -> cyan -> blue -> violet
 * progression across the mesh's span, with jitter so colours blend across
 * the transitions instead of forming two hard hue zones — this is what
 * makes accents read as "naturally transitioning" and "distributed
 * throughout the structure" rather than "one or two colored areas".
 */
function colorForPosition(rng: Rng, x: number): ColorKey {
  const spanMin = MESH_CENTER_X - TIGHT_SPREAD_X;
  const spanMax = MESH_CENTER_X + LOOSE_SPREAD_X;
  const normalized = clamp01((x - spanMin) / (spanMax - spanMin));
  const jittered = clamp01(normalized + (rng() - 0.5) * GRADIENT_JITTER);
  const idx = Math.min(COLOR_SEQUENCE.length - 1, Math.floor(jittered * COLOR_SEQUENCE.length));
  return COLOR_SEQUENCE[idx];
}

/**
 * One continuous, center-weighted point cloud: density is highest near
 * (MESH_CENTER_X, MESH_CENTER_Y) — close to the world origin, which is also
 * the rotation pivot — and falls off gradually toward both edges.
 */
export function buildPointCloud(rng: Rng, scale: number): UnindexedNode[] {
  const count = Math.max(24, Math.round(BASE_POINT_COUNT * scale));
  const nodes: UnindexedNode[] = [];

  for (let i = 0; i < count; i++) {
    const x = MESH_CENTER_X + asymmetricJitterX(rng);
    const y = MESH_CENTER_Y + bell(rng) * MESH_SPREAD_Y;
    const z = rangeBell(rng, MESH_Z_MIN, MESH_Z_MAX);

    const isAccent = rng() < ACCENT_CHANCE;
    const colorKey: ColorKey = isAccent ? colorForPosition(rng, x) : 'white';

    nodes.push({ world: { x, y, z }, colorKey, region: x < MESH_CENTER_X ? 'dense' : 'expanded' });
  }

  return nodes;
}
