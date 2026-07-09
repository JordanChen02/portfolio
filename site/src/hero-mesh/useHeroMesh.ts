import { useEffect, useRef } from 'react';
import { DESKTOP_DPR_CAP, DESKTOP_NODE_SCALE, MOBILE_DPR_CAP, MOBILE_NODE_SCALE, MOBILE_WIDTH_THRESHOLD } from './constants';
import { buildTopology } from './geometry/buildTopology';
import { drawFrame } from './render/drawFrame';
import { viewportScaleFor } from './render/projection';
import type { DeviceProfile } from './types';

/** Checked once at mount, per the handoff's degradation strategy — device
 *  tier doesn't need to be reactive to resize. */
function detectDeviceProfile(): DeviceProfile {
  const isMobile = (navigator.maxTouchPoints ?? 0) > 0 || window.innerWidth < MOBILE_WIDTH_THRESHOLD;
  return {
    nodeCountScale: isMobile ? MOBILE_NODE_SCALE : DESKTOP_NODE_SCALE,
    dprCap: isMobile ? MOBILE_DPR_CAP : DESKTOP_DPR_CAP,
    skipHalo: isMobile,
  };
}

/**
 * Owns the canvas lifecycle: builds the static topology once, sizes via
 * ResizeObserver (fires after layout, per the handoff — not a window resize
 * listener), runs the rAF loop, and swaps to a single static frame when
 * prefers-reduced-motion is on (checked via matchMedia directly rather than
 * pulling Motion into a file that's otherwise pure canvas).
 */
export function useHeroMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const profile = detectDeviceProfile();
    const topology = buildTopology(profile.nodeCountScale);
    // Pre-allocated once, sorted in place every frame — avoids reallocating
    // the triangle index array on the hot path (handoff's GC-pressure note).
    const triOrder = topology.triangles.map((_, i) => i);

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = mql.matches;

    let dims = { width: 0, height: 0 };
    let rafId = 0;
    let startTime: number | null = null;

    const render = (timeSeconds: number) => {
      if (dims.width === 0 || dims.height === 0) return;
      drawFrame({
        ctx,
        topology,
        triOrder,
        canvasWidth: dims.width,
        canvasHeight: dims.height,
        timeSeconds,
        responsiveScale: viewportScaleFor(dims.width),
        skipHalo: profile.skipHalo,
      });
    };

    const resize = (entries?: ResizeObserverEntry[]) => {
      const rect = entries?.[0]?.contentRect ?? canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, profile.dprCap);
      dims = { width: rect.width, height: rect.height };
      // setTransform REPLACES rather than accumulates — safe to call on every resize.
      canvas.width = dims.width * dpr;
      canvas.height = dims.height * dpr;
      canvas.style.width = `${dims.width}px`;
      canvas.style.height = `${dims.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reducedMotion) render(0);
    };

    const loop = (now: number) => {
      if (startTime === null) startTime = now;
      // rAF's own timestamp, not Date.now() — higher resolution, already available.
      render((now - startTime) / 1000);
      rafId = requestAnimationFrame(loop);
    };

    const startAnimating = () => {
      startTime = null;
      rafId = requestAnimationFrame(loop);
    };

    const stopAnimating = () => {
      cancelAnimationFrame(rafId);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    if (reducedMotion) {
      render(0);
    } else {
      startAnimating();
    }

    const onMqlChange = () => {
      reducedMotion = mql.matches;
      if (reducedMotion) {
        stopAnimating();
        render(0);
      } else {
        startAnimating();
      }
    };
    mql.addEventListener('change', onMqlChange);

    return () => {
      observer.disconnect();
      mql.removeEventListener('change', onMqlChange);
      stopAnimating();
    };
  }, []);

  return canvasRef;
}
