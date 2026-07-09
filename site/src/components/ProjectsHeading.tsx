import { Reveal } from '../motion/Reveal';

export function ProjectsHeading() {
  return (
    <Reveal id="projects" className="section">
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <p className="eyebrow">Featured Projects</p>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--eb-fg)', margin: 0 }}>
          Two products, shipped end to end.
        </h2>
      </div>
    </Reveal>
  );
}
