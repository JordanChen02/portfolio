import { motion } from 'motion/react';
import { useTilt } from '../hooks/useTilt';
import { CrossfadeImage } from './CrossfadeImage';
import './BrowserWindow.css';

interface BrowserWindowProps {
  url: string;
  tabTitle: string;
  imgSrc: string;
  imgAlt: string;
  aspect: number;
  slideKey: number;
}

export function BrowserWindow({ url, tabTitle, imgSrc, imgAlt, aspect, slideKey }: BrowserWindowProps) {
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt();

  return (
    <motion.div
      ref={ref}
      className="chrome-window"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
    >
      <div className="chrome-tabbar">
        <div className="chrome-traffic-lights">
          <div className="chrome-dot" style={{ background: '#ff5f57' }} />
          <div className="chrome-dot" style={{ background: '#febc2e' }} />
          <div className="chrome-dot" style={{ background: '#28c840' }} />
        </div>
        <div className="chrome-tab">
          <div className="chrome-tab-favicon" />
          <span className="chrome-tab-title">{tabTitle}</span>
        </div>
      </div>
      <div className="chrome-toolbar">
        <div className="chrome-icon-dot"><span /></div>
        <div className="chrome-urlbar">
          <span />
          <span className="chrome-url-text">{url}</span>
        </div>
        <div className="chrome-icon-dot"><span /></div>
      </div>
      <div className="chrome-body" style={{ aspectRatio: `${aspect} / 1` }}>
        <CrossfadeImage slideKey={slideKey} src={imgSrc} alt={imgAlt} hoverScale />
      </div>
    </motion.div>
  );
}
