import { motion } from 'motion/react';
import { Button } from './Button';
import { DUR, EASE } from '../motion/variants';
import './Hero.css';

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE } },
};

export function Hero() {
  return (
    <section id="hero" className="hero">
      <motion.div className="hero-content" variants={heroContainer} initial="hidden" animate="show">
        {/* Fix: eyebrow was "Jordan Chen" — identical to the nav wordmark
            visible in the same viewport. Swapped for a role signal that
            doesn't duplicate the name. */}
        <motion.p className="hero-eyebrow" variants={heroItem}>Product Engineer</motion.p>
        <motion.h1 className="hero-h1" variants={heroItem}>
          <span className="hero-h1-line1">Complex systems.</span>
          <br />
          <span className="hero-h1-line2">Intuitive software.</span>
        </motion.h1>
        {/* Fix: previously opened with "Full-stack engineer" — not an
            accurate claim of where the work actually is. Rewritten to
            describe the work itself (what gets built, across which
            domains) rather than a job title. */}
        <motion.p className="hero-sub" variants={heroItem}>
          Turning intuition into systems—and complexity into clarity. Currently building across AI, data, health, and trading.
        </motion.p>
        <motion.div className="hero-buttons" variants={heroContainer}>
          <motion.div variants={heroItem}>
            <Button href="#projects" variant="primary">View Projects</Button>
          </motion.div>
          <motion.div variants={heroItem}>
            <Button href="#contact" variant="secondary">Get in Touch</Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
