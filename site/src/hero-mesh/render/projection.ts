import {
  DEPTH_MAX,
  DEPTH_MIN,
  DEPTH_Z_DIVISOR,
  FOCAL,
  ROTATION_X_AMPLITUDE,
  ROTATION_X_FREQUENCY,
  ROTATION_Y_SPEED,
  VIEWPORT_REFERENCE_WIDTH,
  VIEWPORT_SCALE_FLOOR,
} from '../constants';
import type { ProjectedNode, Vec3 } from '../types';

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

/** rotationY = time * 0.022 (continuous, unbounded). */
export function rotationYFor(timeSeconds: number) {
  return timeSeconds * ROTATION_Y_SPEED;
}

/** rotationX = sin(time * 0.11) * 0.08 (oscillating, period ~57s). */
export function rotationXFor(timeSeconds: number) {
  return Math.sin(timeSeconds * ROTATION_X_FREQUENCY) * ROTATION_X_AMPLITUDE;
}

function rotateY(p: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: p.x * cos + p.z * sin, y: p.y, z: -p.x * sin + p.z * cos };
}

function rotateX(p: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: p.x, y: p.y * cos - p.z * sin, z: p.y * sin + p.z * cos };
}

/** Y first, then X — order specified explicitly in the handoff. */
export function rotate(p: Vec3, rotationY: number, rotationX: number): Vec3 {
  return rotateX(rotateY(p, rotationY), rotationX);
}

/** depth(z) = clamp(1 - z/560, 0.10, 1.0) — elements never fully disappear. */
export function depthFactor(z: number) {
  return clamp(1 - z / DEPTH_Z_DIVISOR, DEPTH_MIN, DEPTH_MAX);
}

/**
 * Not part of the handoff's literal math — an addition to satisfy the
 * "responsive across viewport sizes" requirement, since the handoff's world
 * space + FOCAL aren't parameterized by viewport width. At/above the
 * reference width this returns exactly 1 (zero deviation from the literal
 * spec); below it, the whole projected scene shrinks together.
 */
export function viewportScaleFor(canvasWidth: number) {
  return clamp(canvasWidth / VIEWPORT_REFERENCE_WIDTH, VIEWPORT_SCALE_FLOOR, 1);
}

/**
 * scale = FOCAL / (FOCAL + z), then combined with the responsive viewport
 * scale so radius/line-width/position all move together. screenX/Y offset
 * from canvas center by worldX/Y * scale.
 */
export function project(p: Vec3, canvasWidth: number, canvasHeight: number, responsiveScale: number): ProjectedNode {
  const perspectiveScale = FOCAL / (FOCAL + p.z);
  const scale = perspectiveScale * responsiveScale;
  return {
    screenX: canvasWidth / 2 + p.x * scale,
    screenY: canvasHeight / 2 + p.y * scale,
    scale,
    depth: depthFactor(p.z),
    z: p.z,
  };
}
