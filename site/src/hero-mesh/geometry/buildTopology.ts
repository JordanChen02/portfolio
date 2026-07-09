import { MAX_EDGE_LENGTH, SUBDIVISION_PASSES } from '../constants';
import { HERO_MESH_SEED, createRng } from '../rng';
import type { MeshEdge, MeshNode, MeshTopology, MeshTriangle } from '../types';
import { buildPointCloud, type UnindexedNode } from './pointCloud';

interface Pt {
  x: number;
  y: number;
}

/**
 * Bowyer-Watson Delaunay triangulation, computed on each node's (x, y) —
 * world Z is used only for depth-based rendering (opacity/size/painter's
 * sort), not for connectivity. This is what makes triangle size follow
 * local point density automatically: tightly-packed points triangulate into
 * small facets, sparse points into large ones, and the whole point set
 * comes out as a single connected mesh — a Delaunay triangulation of one
 * point cloud cannot produce disconnected islands.
 */
function triangulateXY(points: Pt[]): [number, number, number][] {
  const n = points.length;
  if (n < 3) return [];

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  const dmax = Math.max(maxX - minX, maxY - minY) || 1;
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  // Supertriangle, far enough outside the point cloud to contain it entirely.
  const verts: Pt[] = points.concat([
    { x: midX - 20 * dmax, y: midY - dmax },
    { x: midX, y: midY + 20 * dmax },
    { x: midX + 20 * dmax, y: midY - dmax },
  ]);

  const inCircumcircle = (p: Pt, a: Pt, b: Pt, c: Pt): boolean => {
    let A = a;
    let B = b;
    let C = c;
    const orient = (B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x);
    if (orient < 0) {
      const tmp = B;
      B = C;
      C = tmp;
    }
    const ax = A.x - p.x;
    const ay = A.y - p.y;
    const bx = B.x - p.x;
    const by = B.y - p.y;
    const cx = C.x - p.x;
    const cy = C.y - p.y;
    const det =
      (ax * ax + ay * ay) * (bx * cy - cx * by) -
      (bx * bx + by * by) * (ax * cy - cx * ay) +
      (cx * cx + cy * cy) * (ax * by - bx * ay);
    return det > 0;
  };

  let tris: [number, number, number][] = [[n, n + 1, n + 2]];

  for (let i = 0; i < n; i++) {
    const p = verts[i];
    const bad: number[] = [];
    for (let t = 0; t < tris.length; t++) {
      const [ia, ib, ic] = tris[t];
      if (inCircumcircle(p, verts[ia], verts[ib], verts[ic])) bad.push(t);
    }

    // Re-triangulate the cavity left by removing "bad" triangles: any edge
    // shared by exactly one bad triangle is on the cavity boundary and gets
    // a new triangle to the just-inserted point.
    const tally = new Map<string, number>();
    const edgeEnds = new Map<string, [number, number]>();
    for (const t of bad) {
      const [ia, ib, ic] = tris[t];
      const edges: [number, number][] = [
        [ia, ib],
        [ib, ic],
        [ic, ia],
      ];
      for (const [u, v] of edges) {
        const key = u < v ? `${u}_${v}` : `${v}_${u}`;
        tally.set(key, (tally.get(key) ?? 0) + 1);
        edgeEnds.set(key, [u, v]);
      }
    }

    const badSet = new Set(bad);
    tris = tris.filter((_, idx) => !badSet.has(idx));

    for (const [key, count] of tally) {
      if (count === 1) {
        const [u, v] = edgeEnds.get(key)!;
        tris.push([u, v, i]);
      }
    }
  }

  // Drop any triangle still referencing a supertriangle vertex.
  return tris.filter(([a, b, c]) => a < n && b < n && c < n);
}

function edgeLength(a: UnindexedNode, b: UnindexedNode) {
  const dx = a.world.x - b.world.x;
  const dy = a.world.y - b.world.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/** For every triangle edge longer than maxLength, one midpoint node — deduped
 *  so a shared edge between two triangles only produces one insertion. */
function findLongEdgeMidpoints(
  nodes: UnindexedNode[],
  tris: [number, number, number][],
  maxLength: number
): UnindexedNode[] {
  const seen = new Set<string>();
  const midpoints: UnindexedNode[] = [];
  for (const [a, b, c] of tris) {
    const edges: [number, number][] = [
      [a, b],
      [b, c],
      [c, a],
    ];
    for (const [u, v] of edges) {
      const key = u < v ? `${u}_${v}` : `${v}_${u}`;
      if (seen.has(key)) continue;
      const nu = nodes[u];
      const nv = nodes[v];
      if (edgeLength(nu, nv) > maxLength) {
        seen.add(key);
        midpoints.push({
          world: {
            x: (nu.world.x + nv.world.x) / 2,
            y: (nu.world.y + nv.world.y) / 2,
            z: (nu.world.z + nv.world.z) / 2,
          },
          // Structural infill, not a highlight — inserted purely to break up
          // an otherwise-too-long face, so it stays a plain white node.
          colorKey: 'white',
          region: nu.region,
        });
      }
    }
  }
  return midpoints;
}

/**
 * Triangulates, finds edges longer than MAX_EDGE_LENGTH, inserts a midpoint
 * for each, and repeats — up to SUBDIVISION_PASSES times or until no edge
 * exceeds the threshold, whichever comes first. This is what guarantees no
 * "extremely long uninterrupted triangle" survives even where the base
 * point cloud is naturally sparse (the loose side of the distribution).
 */
function refineLongEdges(nodes: UnindexedNode[]): UnindexedNode[] {
  let current = nodes;
  for (let pass = 0; pass < SUBDIVISION_PASSES; pass++) {
    const tris = triangulateXY(current.map((n) => ({ x: n.world.x, y: n.world.y })));
    const midpoints = findLongEdgeMidpoints(current, tris, MAX_EDGE_LENGTH);
    if (midpoints.length === 0) break;
    current = current.concat(midpoints);
  }
  return current;
}

function edgesFromTriangles(triangles: MeshTriangle[]): MeshEdge[] {
  const seen = new Set<string>();
  const edges: MeshEdge[] = [];
  const addEdge = (u: number, v: number) => {
    const lo = Math.min(u, v);
    const hi = Math.max(u, v);
    const key = `${lo}_${hi}`;
    if (!seen.has(key)) {
      seen.add(key);
      edges.push({ a: lo, b: hi });
    }
  };
  for (const t of triangles) {
    addEdge(t.a, t.b);
    addEdge(t.b, t.c);
    addEdge(t.c, t.a);
  }
  return edges;
}

/**
 * Builds the full static mesh topology once: one continuous, center-weighted
 * point cloud, refined so no triangle edge is excessively long, triangulated
 * as a single connected Delaunay mesh. Never re-runs after generation — only
 * rotation changes each frame. `nodeCountScale` is the one thing that varies
 * (full on desktop, reduced on mobile per the handoff's degradation strategy).
 */
export function buildTopology(nodeCountScale: number): MeshTopology {
  const rng = createRng(HERO_MESH_SEED);

  const basePoints = buildPointCloud(rng, nodeCountScale);
  const refinedPoints = refineLongEdges(basePoints);

  const nodes: MeshNode[] = refinedPoints.map((n, index) => ({ ...n, index }));

  const triIndices = triangulateXY(nodes.map((n) => ({ x: n.world.x, y: n.world.y })));
  const triangles: MeshTriangle[] = triIndices.map(([a, b, c]) => ({ a, b, c }));
  const edges = edgesFromTriangles(triangles);

  return { nodes, edges, triangles };
}
