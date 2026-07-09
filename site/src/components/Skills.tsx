import { Reveal, RevealItem } from '../motion/Reveal';
import { useViewportWidth } from '../hooks/useViewportWidth';
import { skillGroups } from '../data/projects';

export function Skills() {
  const width = useViewportWidth();
  const isMobile = width < 680;
  const isTablet = width < 1024;

  return (
    <Reveal as="section" id="skills" className="section">
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 52, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <p className="eyebrow">Tools</p>
          <h2 style={{ fontSize: 'clamp(26px, 3.6vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--eb-fg)', margin: 0 }}>
            Tools I reach for.
          </h2>
        </div>
        <Reveal
          stagger
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
            gap: isMobile ? '32px 20px' : '48px 28px',
          }}
        >
          {skillGroups.map((group) => (
            <RevealItem key={group.title} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontFamily: 'var(--eb-font-mono)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--eb-fg)', fontWeight: 600, margin: 0 }}>
                {group.title}
              </p>
              <p style={{ fontSize: 14.5, lineHeight: 1.75, color: 'var(--eb-fg-2)', margin: 0 }}>
                {group.items}
              </p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </Reveal>
  );
}
