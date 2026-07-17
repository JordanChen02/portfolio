import { useState, useEffect, useCallback } from 'react';
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

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      className="lightbox-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
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
      <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
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

  const current = ohlcImages[index];

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
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </Reveal>
  );
}
