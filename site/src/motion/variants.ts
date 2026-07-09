import type { Transition, Variants } from 'motion/react';

/**
 * One easing curve, used everywhere. A gentle expo-out: fast start, long
 * settle. This is what reads as "calm" rather than "snappy" — matches the
 * Linear/Vercel/Raycast reference points from the brief.
 */
export const EASE: Transition['ease'] = [0.16, 1, 0.3, 1];

export const DUR = {
  fast: 0.25,
  base: 0.45,
  slow: 0.55,
} as const;

/** Default spring for anything driven by physical interaction (hover lift, tap, tilt). */
export const SPRING_SOFT: Transition = { type: 'spring', stiffness: 260, damping: 26, mass: 0.9 };
export const SPRING_SNAPPY: Transition = { type: 'spring', stiffness: 400, damping: 30, mass: 0.7 };

/** Section-level reveal: fade + 28px rise, once, on scroll into view. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.slow, ease: EASE },
  },
};

/** Smaller-throw variant for list items / chips inside a staggered group. */
export const fadeUpSm: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE },
  },
};

/** Wrap around a group of fadeUpSm children to stagger their entrance. */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
};

/** Viewport config shared by every scroll reveal: fire once, slightly before entry. */
export const viewportOnce = { once: true, margin: '-80px 0px -80px 0px' } as const;
