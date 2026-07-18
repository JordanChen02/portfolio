import { Reveal, RevealItem } from '../motion/Reveal';
import { useCarousel } from '../hooks/useCarousel';
import { useViewportWidth } from '../hooks/useViewportWidth';
import { BrowserWindow } from './BrowserWindow';
import { CarouselControls } from './CarouselControls';
import { Button } from './Button';
import { GitHubIcon, ExternalArrowIcon } from './icons';
import { edgeboardImages, edgeboardChallenges, edgeboardTech } from '../data/projects';
import './EdgeBoard.css';

export function EdgeBoard() {
  const { index, goTo, prev, next } = useCarousel(edgeboardImages.length);
  const width = useViewportWidth();
  const isMobile = width < 900;

  const current = edgeboardImages[index];

  return (
    <Reveal as="section" id="edgeboard" className="section">
      <div className="edgeboard-container">
        <div className={`edgeboard-row${isMobile ? ' is-mobile' : ''}`}>

          <div className="edgeboard-visual">
            <BrowserWindow
              url={current.url ?? ''}
              tabTitle={current.label}
              imgSrc={current.src}
              imgAlt={`${current.label} screen of EdgeBoard`}
              aspect={current.aspect ?? 2.03}
              slideKey={index}
            />
            <CarouselControls
              slides={edgeboardImages}
              index={index}
              onPrev={prev}
              onNext={next}
              onGoTo={goTo}
              size="lg"
            />
          </div>

          <div className="edgeboard-text">
            <div>
              <p className="edgeboard-eyebrow">Featured Project — 01</p>
              <h3 className="edgeboard-title">EdgeBoard</h3>
              <p className="edgeboard-positioning">A decision journal and analytics platform for discretionary traders.</p>
              <p className="edgeboard-description">
                EdgeBoard centralizes trade logging, performance analytics, and behavioral review into one workflow—replacing spreadsheets with structured data and clear feedback loops. The engineering challenge wasn't the trading itself—it was modeling, querying, and visualizing hundreds of structured journal entries without the interface ever feeling overwhelming.
              </p>
            </div>

            <div className="chip-row">
              {edgeboardTech.map((tech) => (
                <span key={tech} className="chip">{tech}</span>
              ))}
            </div>

            <div>
              <p className="highlights-label">Engineering Highlights</p>
              <Reveal as="ul" stagger className="highlights-list" style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {edgeboardChallenges.map((item) => (
                  <RevealItem key={item} as="li" className="highlights-item">
                    <span className="highlights-dot" />
                    {item}
                  </RevealItem>
                ))}
              </Reveal>
            </div>

            <div className="edgeboard-links">
              <Button href="https://github.com/JordanChen02/Edgeboard" variant="secondary" size="sm" external>
                <GitHubIcon />
                GitHub
              </Button>
              <Button href="https://edgeboard.trade" variant="primary" size="sm" external>
                Live Demo
                <ExternalArrowIcon />
              </Button>
            </div>
          </div>

        </div>

        <div className="edgeboard-demo">
          <p className="edgeboard-demo-eyebrow">Product Walkthrough</p>
          <div className="chrome-window">
            <div className="chrome-tabbar">
              <div className="chrome-traffic-lights">
                <div className="chrome-dot" style={{ background: '#ff5f57' }} />
                <div className="chrome-dot" style={{ background: '#febc2e' }} />
                <div className="chrome-dot" style={{ background: '#28c840' }} />
              </div>
              <div className="chrome-tab">
                <div className="chrome-tab-favicon" />
                <span className="chrome-tab-title">EdgeBoard — Demo</span>
              </div>
            </div>
            <div className="chrome-toolbar">
              <div className="chrome-icon-dot"><span /></div>
              <div className="chrome-urlbar">
                <span />
                <span className="chrome-url-text">youtube.com/watch?v=KU61j-Uoi7M</span>
              </div>
              <div className="chrome-icon-dot"><span /></div>
            </div>
            <div className="edgeboard-demo-body">
              <iframe
                src="https://www.youtube.com/embed/KU61j-Uoi7M"
                title="EdgeBoard Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
