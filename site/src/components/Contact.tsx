import { Reveal } from '../motion/Reveal';
import { Button } from './Button';
import { MailIcon, GitHubIcon, LinkedInIcon } from './icons';

export function Contact() {
  return (
    <Reveal as="section" id="contact" className="section" style={{ textAlign: 'center' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <p className="eyebrow">Contact</p>
        <h2 style={{ fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--eb-fg)', margin: 0 }}>
          Let's talk.
        </h2>
        <p style={{ fontSize: 16, color: 'var(--eb-fg-2)', lineHeight: 1.6, margin: 0 }}>
          I'm always open to a good conversation about products, engineering, or what's next.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 }}>
          <Button href="mailto:Jordanchen95@gmail.com" variant="primary">
            <MailIcon />
            Email Me
          </Button>
          <Button href="https://github.com/JordanChen02" variant="secondary" external>
            <GitHubIcon />
            GitHub
          </Button>
          <Button href="https://www.linkedin.com/in/jordan-chen-data" variant="secondary" external>
            <LinkedInIcon />
            LinkedIn
          </Button>
        </div>
      </div>
    </Reveal>
  );
}
