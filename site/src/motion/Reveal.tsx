import { motion } from 'motion/react';
import type { ElementType, ReactNode, CSSProperties } from 'react';
import { fadeUp, fadeUpSm, staggerContainer, viewportOnce } from './variants';

interface RevealProps {
  as?: ElementType;
  id?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  /** When true, this element staggers its direct motion children instead of animating itself. */
  stagger?: boolean;
}

/**
 * Fade + rise on scroll into view, once. Default export handles the common
 * case (About, ProjectsHeading, Skills, Contact, section wrappers); pass
 * `stagger` to turn this into a stagger container instead (pair with
 * <RevealItem> children, e.g. Engineering Highlights lists).
 */
export function Reveal({ as = 'div', id, className, style, children, stagger = false }: RevealProps) {
  const MotionTag = motion[as as 'div'] ?? motion.div;
  return (
    <MotionTag
      id={id}
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={stagger ? staggerContainer : fadeUp}
    >
      {children}
    </MotionTag>
  );
}

/** Child of a stagger container (Reveal with `stagger`). Smaller throw than a top-level Reveal. */
export function RevealItem({ as = 'div', className, style, children }: Omit<RevealProps, 'id' | 'stagger'>) {
  const MotionTag = motion[as as 'div'] ?? motion.div;
  return (
    <MotionTag className={className} style={style} variants={fadeUpSm}>
      {children}
    </MotionTag>
  );
}
