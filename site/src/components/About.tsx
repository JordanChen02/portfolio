import { Reveal } from '../motion/Reveal';

export function About() {
  return (
    <Reveal as="section" id="about" className="section" style={{ textAlign: 'center' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
        <p className="eyebrow">About</p>
        <div className="divider-bar" />
        <p style={{ fontSize: 'clamp(19px, 2.4vw, 25px)', lineHeight: 1.65, color: 'var(--eb-fg-1)', fontWeight: 400, margin: 0, textWrap: 'balance' }}>
          I enjoy building software that makes complex ideas feel simple. My interests span AI,
          data, health, and trading—fields where I can explore how systems work and turn those
          insights into thoughtful, intuitive products. I'm always iterating, because the best
          solutions rarely emerge on the first attempt.
        </p>
      </div>
    </Reveal>
  );
}
