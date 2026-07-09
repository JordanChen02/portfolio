import { useRef } from 'react';
import { useMotionValue, useSpring } from 'motion/react';
import type { MouseEvent } from 'react';

const MAX_TILT_DEG = 3.5;

/**
 * Cursor-reactive tilt for product mockups (browser chrome, phone frame).
 * Rotation is capped at ~3.5deg and runs through a spring so it settles
 * rather than snapping — meant to read as "this is a physical object", not
 * a gimmick. Resets to flat on pointer leave.
 */
export function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 220, damping: 22, mass: 0.6 });
  const rotateY = useSpring(rawRotateY, { stiffness: 220, damping: 22, mass: 0.6 });

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rawRotateY.set(px * MAX_TILT_DEG * 2);
    rawRotateX.set(-py * MAX_TILT_DEG * 2);
  };

  const onMouseLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  return { ref, rotateX, rotateY, onMouseMove, onMouseLeave };
}
