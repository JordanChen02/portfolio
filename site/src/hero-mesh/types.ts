export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type ColorKey = 'white' | 'teal' | 'cyan' | 'blue' | 'violet';

/**
 * One continuous point cloud with two overlapping density zones (not
 * several separated regions) — 'dense' packs points tightly (small
 * triangles), 'expanded' spreads them out (large triangles), and they
 * overlap near the composition's centre so the whole thing triangulates
 * into one connected mesh rather than islands needing bridge nodes.
 */
export type RegionKey = 'dense' | 'expanded';

export interface MeshNode {
  /** Static world-space position. Topology never changes after generation —
   *  only the rotated/projected render position changes each frame. */
  world: Vec3;
  colorKey: ColorKey;
  region: RegionKey;
  /** Position in the node array; used for the per-node pulse phase offset. */
  index: number;
}

export interface MeshEdge {
  a: number;
  b: number;
}

export interface MeshTriangle {
  a: number;
  b: number;
  c: number;
}

export interface MeshTopology {
  nodes: MeshNode[];
  edges: MeshEdge[];
  triangles: MeshTriangle[];
}

/** Per-frame computed render state for a single node, after rotation + perspective projection. */
export interface ProjectedNode {
  screenX: number;
  screenY: number;
  /** Combined perspective x responsive-viewport scale — drives radius, line width, and position offset. */
  scale: number;
  /** Depth-based opacity factor, 0.10 (far) .. 1.0 (near). */
  depth: number;
  /** Rotated (but not yet projected) world Z — used for painter's-algorithm sorting. */
  z: number;
}

export interface DeviceProfile {
  nodeCountScale: number;
  dprCap: number;
  skipHalo: boolean;
}
