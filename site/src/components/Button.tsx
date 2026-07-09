import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { SPRING_SOFT } from '../motion/variants';

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant: 'primary' | 'secondary';
  size?: 'md' | 'sm';
  external?: boolean;
  className?: string;
}

/**
 * Shared CTA/link used across Hero, EdgeBoard, SOMA, OtherWork, Contact, Nav.
 * Colors/padding/radius stay CSS (declarative, cheap); the lift on hover and
 * the press-down on tap are Motion springs so they feel physical rather than
 * eased. Icon-only carousel controls intentionally don't use this — those
 * keep their own no-lift hover per the original design spec.
 */
export function Button({ href, children, variant, size = 'md', external = false, className = '' }: ButtonProps) {
  const sizeClass = size === 'sm' ? ' btn-sm' : '';
  // Large CTAs lift on hover; small inline links (GitHub next to a case
  // study) just get a touch of scale — keeps the original hierarchy where
  // only the primary actions on a page command that much attention.
  const hoverAnim = size === 'md' ? { y: -2 } : { scale: 1.02 };
  return (
    <motion.a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`btn btn-${variant}${sizeClass} ${className}`.trim()}
      whileHover={hoverAnim}
      whileTap={{ scale: 0.96, y: 0 }}
      transition={SPRING_SOFT}
    >
      {children}
    </motion.a>
  );
}
