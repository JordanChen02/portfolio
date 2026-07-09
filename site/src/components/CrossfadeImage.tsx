import { AnimatePresence, motion } from 'motion/react';
import { SPRING_SOFT } from '../motion/variants';

interface CrossfadeImageProps {
  src: string;
  alt: string;
  slideKey: number;
  className?: string;
  imgStyle?: React.CSSProperties;
  /** Gently scales the image up 2% on hover — for screenshots sitting inside a clipped frame. */
  hoverScale?: boolean;
}

/**
 * Carousel slide swap without a hard cut. The two images stack via absolute
 * positioning inside a relatively-positioned parent (caller must set
 * position:relative + a fixed aspect-ratio/height) so the crossfade doesn't
 * shift layout while both frames briefly coexist.
 */
export function CrossfadeImage({ src, alt, slideKey, className, imgStyle, hoverScale = false }: CrossfadeImageProps) {
  return (
    <AnimatePresence initial={false}>
      <motion.img
        key={slideKey}
        src={src}
        alt={alt}
        className={className}
        style={{ position: 'absolute', inset: 0, ...imgStyle }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        whileHover={hoverScale ? { scale: 1.02 } : undefined}
        transition={{ opacity: { duration: 0.28, ease: 'easeInOut' }, scale: SPRING_SOFT }}
      />
    </AnimatePresence>
  );
}
