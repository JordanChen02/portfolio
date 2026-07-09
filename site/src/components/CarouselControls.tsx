import { motion } from 'motion/react';
import type { Slide } from '../data/projects';
import { SPRING_SOFT } from '../motion/variants';

interface CarouselControlsProps {
  slides: Slide[];
  index: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (i: number) => void;
  size?: 'lg' | 'md' | 'sm';
  captionOffset?: number;
}

export function CarouselControls({
  slides,
  index,
  onPrev,
  onNext,
  onGoTo,
  size = 'lg',
  captionOffset = -10,
}: CarouselControlsProps) {
  const iconSize = size === 'lg' ? 16 : size === 'md' ? 15 : 13;

  return (
    <>
      <div className="carousel-controls">
        <motion.button
          onClick={onPrev}
          aria-label="Previous screen"
          className={`carousel-btn carousel-btn-${size}`}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          transition={SPRING_SOFT}
        >
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </motion.button>
        <div className="pager-dots">
          {slides.map((slide, i) => (
            <motion.button
              key={slide.label}
              className={`pager-dot${i === index ? ' is-active' : ''}`}
              onClick={() => onGoTo(i)}
              aria-label={`Show ${slide.label} screen`}
              whileTap={{ scale: 0.85 }}
              transition={SPRING_SOFT}
            />
          ))}
        </div>
        <motion.button
          onClick={onNext}
          aria-label="Next screen"
          className={`carousel-btn carousel-btn-${size}`}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          transition={SPRING_SOFT}
        >
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </motion.button>
      </div>
      <p className="carousel-caption" style={{ marginTop: captionOffset }}>
        {slides[index].label}
      </p>
    </>
  );
}
