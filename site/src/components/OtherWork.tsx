import { motion } from 'motion/react';
import { Reveal } from '../motion/Reveal';
import { useCarousel } from '../hooks/useCarousel';
import { useViewportWidth } from '../hooks/useViewportWidth';
import { CarouselControls } from './CarouselControls';
import { CrossfadeImage } from './CrossfadeImage';
import { CornerArrowIcon } from './icons';
import { SPRING_SOFT } from '../motion/variants';
import { ohlcImages } from '../data/projects';
import './OtherWork.css';

export function OtherWork() {
  const { index, goTo, prev, next } = useCarousel(ohlcImages.length);
  const width = useViewportWidth();
  const isMobile = width < 680;

  const current = ohlcImages[index];

  return (
    <Reveal
      as="section"
      id="other-work"
      /* Fix: same chapter-break treatment as SOMA — signals the shift from
         the two featured case studies into the lighter "other work" entry. */
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
              <div className="other-frame">
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
    </Reveal>
  );
}
