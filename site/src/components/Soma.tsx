import { motion } from 'motion/react';
import { Reveal, RevealItem } from '../motion/Reveal';
import { useCarousel } from '../hooks/useCarousel';
import { useViewportWidth } from '../hooks/useViewportWidth';
import { useTilt } from '../hooks/useTilt';
import { CarouselControls } from './CarouselControls';
import { CrossfadeImage } from './CrossfadeImage';
import { Button } from './Button';
import { GitHubIcon, ExternalArrowIcon } from './icons';
import { somaImages, somaChallenges, somaTech } from '../data/projects';
import './Soma.css';

export function Soma() {
  const { index, goTo, prev, next } = useCarousel(somaImages.length);
  const width = useViewportWidth();
  const isMobile = width < 680;
  const { ref: tiltRef, rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt();

  const current = somaImages[index];

  return (
    <Reveal
      as="section"
      id="soma"
      /* Fix: no visual break previously signaled the transition from the
         EdgeBoard case study into SOMA — sections just abutted. A hairline
         top border reads as a quiet chapter break without adding weight. */
      className="section section-divider"
    >
      <div className="soma-container">
        <div className={`soma-row${isMobile ? ' is-mobile' : ''}`}>

          <div className="soma-visual">
            <motion.div
              ref={tiltRef}
              className="soma-phone-frame"
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              style={{ rotateX, rotateY, transformPerspective: 900 }}
            >
              <div className="soma-phone-bezel">
                <div className="soma-phone-screen">
                  <CrossfadeImage
                    slideKey={index}
                    src={current.src}
                    alt={`${current.label} screen of SOMA`}
                    imgStyle={{ objectFit: 'cover', objectPosition: 'top' }}
                    hoverScale
                  />
                  <div className="soma-phone-home-bar" />
                </div>
              </div>
              <div className="soma-phone-notch" />
            </motion.div>
            <CarouselControls
              slides={somaImages}
              index={index}
              onPrev={prev}
              onNext={next}
              onGoTo={goTo}
              size="md"
              captionOffset={-8}
            />
          </div>

          <div className="soma-text">
            <div>
              <p className="soma-eyebrow">Featured Project — 02</p>
              <h3 className="soma-title">SOMA</h3>
              <p className="soma-subtitle">σῶμα — "body" (Ancient Greek)</p>
              <p className="soma-positioning">A connected platform for training, recovery, and long-term fitness.</p>
              <p className="soma-description">
                SOMA replaces scattered fitness apps and paper logs with one mobile-first platform
                for workout programming, progress tracking, and long-term training habits.
              </p>
            </div>

            <div className="chip-row">
              {somaTech.map((tech) => (
                <span key={tech} className="chip">{tech}</span>
              ))}
            </div>

            <div>
              <p className="highlights-label">Engineering Highlights</p>
              <Reveal as="ul" stagger className="highlights-list" style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {somaChallenges.map((item) => (
                  <RevealItem key={item} as="li" className="highlights-item">
                    <span className="highlights-dot" />
                    {item}
                  </RevealItem>
                ))}
              </Reveal>
            </div>

            <div className="soma-links">
              <Button href="https://github.com/JordanChen02/SOMA" variant="secondary" size="sm" external>
                <GitHubIcon />
                GitHub
              </Button>
              <Button href="https://somafit.vercel.app" variant="primary" size="sm" external>
                Live Demo
                <ExternalArrowIcon />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </Reveal>
  );
}
