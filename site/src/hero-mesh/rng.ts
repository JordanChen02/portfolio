/**
 * Mulberry32 — a tiny, fast, deterministic PRNG. Topology (node positions,
 * accent assignment) must be reproducible across reloads, not re-randomized
 * every mount, so this is used in place of Math.random() throughout geometry
 * generation.
 */
export function createRng(seed: number) {
  let state = seed >>> 0;
  return function rng() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = ReturnType<typeof createRng>;

/** Sum of three uniforms approximates a bell curve — denser near 0, thinning toward ±1. */
export function bell(rng: Rng) {
  return (rng() + rng() + rng() - 1.5) / 1.5;
}

export function range(rng: Rng, min: number, max: number) {
  return min + rng() * (max - min);
}

export function rangeBell(rng: Rng, min: number, max: number) {
  const mid = (min + max) / 2;
  const half = (max - min) / 2;
  return mid + bell(rng) * half;
}

export const HERO_MESH_SEED = 88172645;
