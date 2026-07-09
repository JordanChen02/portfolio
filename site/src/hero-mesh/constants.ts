import type { ColorKey } from './types';

/* ============================================================================
   Every numeric value below is transcribed directly from the developer
   handoff. Where the handoff gives a range instead of an exact value, the
   choice made is called out in a comment — see the plan doc for the full
   rationale.
   ============================================================================ */

export const FOCAL = 920;
/** depth(z) = clamp(1 - z/560, 0.10, 1.0) */
export const DEPTH_Z_DIVISOR = 560;
export const DEPTH_MIN = 0.1;
export const DEPTH_MAX = 1.0;

export const ROTATION_Y_SPEED = 0.022; // rad/s, continuous
export const ROTATION_X_AMPLITUDE = 0.08; // rad
export const ROTATION_X_FREQUENCY = 0.11; // rad/s (inside the sin)

export const PULSE_SPEED = 2.0; // rad/s (inside the sin)
export const PULSE_PHASE_STEP = 0.88; // per node index
export const PULSE_BASE = 0.8;
export const PULSE_AMPLITUDE = 0.2;

export const LINE_WIDTH_MIN = 0.25;
export const LINE_WIDTH_SCALE_FACTOR = 0.95;

/** Fraction of the full point count generated per device tier — fewer points
 *  on mobile means proportionally fewer triangulated edges/faces, cheaper
 *  to render. Topology is Delaunay now, not KNN, so there's no "k" anymore. */
export const DESKTOP_NODE_SCALE = 1;
export const MOBILE_NODE_SCALE = 0.55;
export const DESKTOP_DPR_CAP = 2;
export const MOBILE_DPR_CAP = 1.5;
export const MOBILE_WIDTH_THRESHOLD = 768;

export const HALO_RADIUS_MULTIPLIER = 4.8;
export const HALO_OPACITY = 0.45;

/**
 * Responsive scale: the handoff's world-space + FOCAL projection isn't
 * parameterized by viewport size, so applied literally the mesh clips badly
 * on mobile. At/above REFERENCE_WIDTH the scale is 1 (zero deviation from
 * the handoff's literal math — this is the width the composition reads as
 * designed). Below it, the whole projected scene shrinks proportionally,
 * floored so it never collapses to nothing on small phones.
 */
export const VIEWPORT_REFERENCE_WIDTH = 1400;
export const VIEWPORT_SCALE_FLOOR = 0.42;

export const VIGNETTE_INNER_RATIO = 0.28; // × min(W, H)
export const VIGNETTE_OUTER_RATIO = 0.8; // × max(W, H)
export const VIGNETTE_OUTER_COLOR = '4, 7, 22';
export const VIGNETTE_OUTER_ALPHA = 0.65;

export const CONTAINER_BG = '#050918';

/**
 * Visual-weight boosts — NOT in the literal handoff. An on-canvas diagnostic
 * confirmed the mesh's position/scale math is correct (44 nodes, canvas
 * sized correctly, responsiveScale = 1 at desktop widths — see conversation
 * history), so the gap from the reference image wasn't a geometry bug: the
 * handoff's literal values (2.4-3.5px node radius, 0.02-0.038 triangle
 * alpha) are simply too subtle to read at a real hero-section canvas size
 * (2000px+ wide). Per the stated priority order — visual fidelity over
 * literal spec values when the two conflict — these scale up size/opacity
 * at draw time without touching any position, timing, or colour-formula
 * logic, all of which are now verified correct.
 */
// Fix: nodes were reading as too dominant relative to the lines/faces —
// reduced ~17% (within the requested 15-20% range) so they read as subtle
// glowing points rather than the primary visual element. Triangle/edge
// boosts are untouched, that balance was already right.
export const NODE_RADIUS_BOOST = 1.5;
export const TRIANGLE_ALPHA_BOOST = 3.5;
export const EDGE_ALPHA_BOOST = 1.6;

/* ============================================================================
   Composition — one continuous, center-weighted point cloud.
   Fix: the previous version (dense zone at cx=-230 vs. an expanded zone at
   cx=+300 plus far anchors out to x~=980) put the visual centroid well to
   the right of the world origin — but rotation always pivots around the
   origin, so the mesh visibly swung around a point far from its own mass
   ("windmill" / "UFO" effect). The fix is a single distribution centered
   close to the origin (a small -40 offset for mild asymmetry, not a
   left/right split), with density falling off toward BOTH edges rather than
   being high on one side and low on the other. One side stays ~25% denser
   than the other (asymmetric spread, not asymmetric zones) — enough
   asymmetry to avoid feeling perfectly mirrored, not enough to unbalance
   the rotation again.
   ============================================================================ */

/**
 * Fix: the mesh read as occupying only ~25-30% of the hero width — needed
 * to be ~55-60%, roughly a 2.1x scale. Applied uniformly to every spatial
 * constant below (center offset, both spreads, and the subdivision
 * threshold) rather than changing point count — this is a pure "zoom", so
 * the balance/asymmetry ratio and the subdivision density both stay exactly
 * proportional to before, just larger. Z range is deliberately NOT scaled —
 * depth/perspective character was already correct and wasn't part of this ask.
 */
export const MESH_SCALE = 2.1;

export const MESH_CENTER_X = -40 * MESH_SCALE;
export const MESH_CENTER_Y = 0;
/** Tighter spread toward negative X (denser, smaller facets), looser toward
 *  positive X (sparser, larger facets) — ratio ~1.27 is a ~25% density
 *  difference between the two sides, inside the requested 20-30% range. */
export const TIGHT_SPREAD_X = 300 * MESH_SCALE;
export const LOOSE_SPREAD_X = 380 * MESH_SCALE;
export const MESH_SPREAD_Y = 320 * MESH_SCALE;
export const MESH_Z_MIN = -100;
export const MESH_Z_MAX = 260;

export const BASE_POINT_COUNT = 50;

/** Edges longer than this get subdivided (midpoint inserted, re-triangulated)
 *  so no triangle spans an "extremely long uninterrupted" gap. Scaled with
 *  MESH_SCALE so the subdivision threshold stays proportional to the new
 *  spacing — otherwise the same points, now farther apart, would trigger far
 *  more subdivision insertions, adding nodes the user explicitly didn't want. */
export const MAX_EDGE_LENGTH = 220 * MESH_SCALE;
export const SUBDIVISION_PASSES = 2;

/* ============================================================================
   Color palette — every fill/glow/edge/triangle value the handoff specifies
   as an exact RGB triplet, kept distinct even where two are close but not
   identical (e.g. violet's node-glow rgb differs slightly from its edge rgb
   — that's in the source doc, not a typo).
   ============================================================================ */

export interface PaletteEntry {
  nodeFillRgb: string;
  nodeFillAlpha: number;
  nodeGlowRgb: string;
  nodeGlowAlpha: number;
  nodeGlowBlur: number;
  nodeBaseRadius: number;
  edgeRgb: string;
  /** Unused for 'white' — its edge formula is special-cased in render/colors.ts. */
  edgeBaseAlpha: number;
  triangleRgb: string;
  triangleBaseAlpha: number;
}

export const PALETTE: Record<ColorKey, PaletteEntry> = {
  white: {
    nodeFillRgb: '210, 232, 255',
    nodeFillAlpha: 0.88,
    nodeGlowRgb: '160, 205, 255',
    nodeGlowAlpha: 0.28,
    nodeGlowBlur: 9,
    nodeBaseRadius: 2.4,
    edgeRgb: '162, 202, 255',
    edgeBaseAlpha: 0, // special-cased
    triangleRgb: '110, 158, 255',
    triangleBaseAlpha: 0.02,
  },
  teal: {
    nodeFillRgb: '0, 212, 196',
    nodeFillAlpha: 0.96,
    nodeGlowRgb: '0, 205, 188',
    nodeGlowAlpha: 0.6,
    nodeGlowBlur: 24,
    nodeBaseRadius: 3.5,
    edgeRgb: '0, 212, 196',
    edgeBaseAlpha: 0.2,
    triangleRgb: '0, 200, 185',
    triangleBaseAlpha: 0.038,
  },
  cyan: {
    nodeFillRgb: '68, 222, 255',
    nodeFillAlpha: 0.96,
    nodeGlowRgb: '68, 222, 255',
    nodeGlowAlpha: 0.55,
    nodeGlowBlur: 22,
    nodeBaseRadius: 3.1,
    edgeRgb: '65, 218, 255',
    edgeBaseAlpha: 0.18,
    triangleRgb: '65, 205, 255',
    triangleBaseAlpha: 0.032,
  },
  blue: {
    nodeFillRgb: '92, 148, 255',
    nodeFillAlpha: 0.96,
    nodeGlowRgb: '92, 148, 255',
    nodeGlowAlpha: 0.5,
    nodeGlowBlur: 20,
    nodeBaseRadius: 3.0,
    edgeRgb: '90, 145, 255',
    edgeBaseAlpha: 0.16,
    triangleRgb: '85, 135, 255',
    triangleBaseAlpha: 0.03,
  },
  violet: {
    nodeFillRgb: '158, 80, 255',
    nodeFillAlpha: 0.96,
    nodeGlowRgb: '148, 72, 255',
    nodeGlowAlpha: 0.58,
    nodeGlowBlur: 24,
    nodeBaseRadius: 3.5,
    edgeRgb: '148, 70, 255',
    edgeBaseAlpha: 0.18,
    triangleRgb: '138, 60, 255',
    triangleBaseAlpha: 0.038,
  },
};

/** White-to-white edge alpha: (0.052 + 0.062 x depth) x min(1, scale x 1.12). */
export const WHITE_EDGE_BASE = 0.052;
export const WHITE_EDGE_DEPTH_FACTOR = 0.062;
export const WHITE_EDGE_SCALE_FACTOR = 1.12;

export interface AuroraStop {
  xPct: number;
  yPct: number;
  colorRgb: string;
  opacity: number;
  radiusPct: number; // handoff: "roughly 32-56% of canvas width", spread across that range per stop
}

export const AURORA_STOPS: AuroraStop[] = [
  { xPct: 0.14, yPct: 0.54, colorRgb: '0, 145, 180', opacity: 0.13, radiusPct: 0.4 },
  { xPct: 0.83, yPct: 0.62, colorRgb: '105, 48, 215', opacity: 0.1, radiusPct: 0.48 },
  { xPct: 0.5, yPct: 0.22, colorRgb: '22, 80, 205', opacity: 0.08, radiusPct: 0.56 },
  { xPct: 0.62, yPct: 0.48, colorRgb: '0, 178, 196', opacity: 0.07, radiusPct: 0.34 },
  { xPct: 0.32, yPct: 0.78, colorRgb: '80, 40, 180', opacity: 0.06, radiusPct: 0.44 },
];
