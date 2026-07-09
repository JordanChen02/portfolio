import { useState } from 'react';
import { motion } from 'motion/react';
import { useScrolled } from '../hooks/useScrollY';
import { useViewportWidth } from '../hooks/useViewportWidth';
import { useActiveSection } from '../hooks/useActiveSection';
import { EASE, SPRING_SOFT } from '../motion/variants';
import './Nav.css';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

// Sections observed for scroll-spy, mapped to the nav link they should
// light up — EdgeBoard/SOMA/Other Work all count as "Projects" since that's
// the only nav anchor covering that stretch of the page.
const SECTION_IDS = ['about', 'projects', 'edgeboard', 'soma', 'other-work', 'skills', 'contact'];
const SECTION_TO_NAV_HREF: Record<string, string> = {
  about: '#about',
  projects: '#projects',
  edgeboard: '#projects',
  soma: '#projects',
  'other-work': '#projects',
  skills: '#skills',
  contact: '#contact',
};

const underlineVariants = {
  rest: { scaleX: 0 },
  active: { scaleX: 1 },
};

function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <motion.a
      href={href}
      className={`nav-link${isActive ? ' is-active' : ''}`}
      initial="rest"
      animate={isActive ? 'active' : 'rest'}
      whileHover="active"
    >
      {label}
      <motion.span className="nav-underline" variants={underlineVariants} transition={{ duration: 0.25, ease: EASE }} />
    </motion.a>
  );
}

export function Nav() {
  const scrolled = useScrolled(24);
  const width = useViewportWidth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isCompact = width < 860;

  const activeSectionId = useActiveSection(SECTION_IDS);
  const activeNavHref = activeSectionId ? SECTION_TO_NAV_HREF[activeSectionId] : null;

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`nav${scrolled ? ' is-scrolled' : ''}`}>
        <a href="#hero" className="nav-brand">
          <span className="nav-monogram">JC</span>
          Jordan Chen
        </a>

        {!isCompact && (
          <div className="nav-links">
            {NAV_LINKS.slice(0, 3).map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} isActive={activeNavHref === link.href} />
            ))}
            <motion.a
              href="#contact"
              className="nav-contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING_SOFT}
            >
              Contact
            </motion.a>
          </div>
        )}

        {isCompact && (
          <motion.button
            aria-label="Toggle menu"
            className="nav-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            whileTap={{ scale: 0.9 }}
            transition={SPRING_SOFT}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </motion.button>
        )}
      </nav>

      {isCompact && menuOpen && (
        <motion.div
          className="nav-mobile-menu"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
        >
          {NAV_LINKS.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="nav-mobile-link"
              onClick={closeMenu}
              whileTap={{ scale: 0.97 }}
              transition={SPRING_SOFT}
            >
              {link.label}
            </motion.a>
          ))}
        </motion.div>
      )}
    </>
  );
}
