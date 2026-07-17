import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Reveal } from '../motion/Reveal';
import { useCarousel } from '../hooks/useCarousel';
import { useViewportWidth } from '../hooks/useViewportWidth';
import { CarouselControls } from './CarouselControls';
import { CrossfadeImage } from './CrossfadeImage';
import { CornerArrowIcon, XIcon } from './icons';
import { SPRING_SOFT } from '../motion/variants';
import { ohlcImages } from '../data/projects';
import './OtherWork.css';

const CHEVRON_LEFT = (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const CHEVRON_RIGHT = (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function Lightbox({ src, alt, index, total, onPrev, onNext, onClose }: {
  src: string; alt: string; index: number; total: number;
  onPrev: () => void; onNext: () => void; onClose: () => void;
}) {
  const lastWheel = useRef(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheel.current < 300) return;
    lastWheel.current = now;
    if (e.deltaY > 0 || e.deltaX > 0) onNext(); else onPrev();
  };

  return createPortal(
    <motion.div
      className="lightbox-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      onWheel={handleWheel}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      <motion.img
        src={src}
        alt={alt}
        className="lightbox-img"
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={e => e.stopPropagation()}
      />

      <button
        className="lightbox-nav lightbox-nav-prev"
        onClick={e => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous image"
      >
        {CHEVRON_LEFT}
      </button>
      <button
        className="lightbox-nav lightbox-nav-next"
        onClick={e => { e.stopPropagation(); onNext(); }}
        aria-label="Next image"
      >
        {CHEVRON_RIGHT}
      </button>

      <div className="lightbox-counter">{index + 1} / {total}</div>

      <button className="lightbox-close" onClick={e => { e.stopPropagation(); onClose(); }} aria-label="Close lightbox">
        <XIcon size={18} />
      </button>
    </motion.div>,
    document.body
  );
}

export function OtherWork() {
  const { index, goTo, prev, next } = useCarousel(ohlcImages.length);
  const width = useViewportWidth();
  const isMobile = width < 680;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const frameWheelLast = useRef(0);

  const current = ohlcImages[index];

  const handleFrameWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - frameWheelLast.current < 300) return;
    frameWheelLast.current = now;
    if (e.deltaY > 0 || e.deltaX > 0) next(); else prev();
  };

  return (
    <Reveal
      as="section"
      id="other-work"
      className="section section-divider"
    >
      <div className="other-container">
        <p className="other-eyebrow">Other Work</p>

        <motion.div className="other-card" whileHover={{ y: -4 }} transition={SPRING_SOFT}>
          <div className={`other-row${isMobile ? ' is-mobile' : ''}`}>

            <div className="other-text">
              <h4 className="other-title">OHLC Hypothesis Lab</h4>
              <p className="other-desc">
                A data-driven investigation into the 10AM reversal / breakout behavior on NQ
                futures, using 5-minute OHLC data — from raw hypothesis testing to a final
                rules-based strategy.
              </p>
              <div className="chip-row">
                <span className="chip chip-sm">NQ Futures</span>
                <span className="chip chip-sm">OHLC Data</span>
                <span className="chip chip-sm">Quant Research</span>
              </div>
              <div className="other-links">
                <motion.a
                  href="https://github.com/JordanChen02/ohlc-hypothesis-lab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="other-link"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  transition={SPRING_SOFT}
                >
                  GitHub
                  <CornerArrowIcon />
                </motion.a>
                <motion.a
                  href="https://medium.com/@jordanchen95/finding-structure-in-the-10am-nasdaq-reversal-c8f7f8917aa8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="other-link"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  transition={SPRING_SOFT}
                >
                  Read the Write-Up
                  <CornerArrowIcon />
                </motion.a>
              </div>
            </div>

            <div className="other-visual">
              <div
                className="other-frame other-frame-clickable"
                onClick={() => setLightboxOpen(true)}
                onWheel={handleFrameWheel}
                role="button"
                tabIndex={0}
                aria-label={`Enlarge: ${current.label}`}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLightboxOpen(true); } }}
              >
                <CrossfadeImage
                  slideKey={index}
                  src={current.src}
                  alt={`${current.label} — OHLC Hypothesis Lab`}
                  imgStyle={{ objectFit: 'contain' }}
                  hoverScale
                />
              </div>
              <CarouselControls
                slides={ohlcImages}
                index={index}
                onPrev={prev}
                onNext={next}
                onGoTo={goTo}
                size="sm"
                captionOffset={0}
              />
            </div>

          </div>
        </motion.div>

        <p className="other-footer-line">
          More experiments, research, and technical writing on{' '}
          <a href="https://github.com/JordanChen02" target="_blank" rel="noopener noreferrer">GitHub</a>{' '}
          and <a href="https://medium.com/@jordanchen95" target="_blank" rel="noopener noreferrer">Medium</a>.
        </p>
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            src={current.src}
            alt={`${current.label} — OHLC Hypothesis Lab`}
            index={index}
            total={ohlcImages.length}
            onPrev={prev}
            onNext={next}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </Reveal>
  );
}
