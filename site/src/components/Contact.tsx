import { useState, useCallback } from 'react';
import { Reveal } from '../motion/Reveal';
import { Button } from './Button';
import { MailIcon, GitHubIcon, LinkedInIcon, CopyIcon, CheckIcon } from './icons';

const EMAIL = 'jordanchen95@gmail.com';

export function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

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
          <Button href={`mailto:${EMAIL}`} variant="primary">
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <span style={{
            fontSize: 13,
            color: 'var(--eb-fg-2)',
            opacity: 0.55,
            fontFamily: 'var(--eb-font-mono, monospace)',
            letterSpacing: '0.01em',
          }}>
            {EMAIL}
          </span>
          <button
            onClick={handleCopy}
            aria-label={copied ? 'Copied to clipboard' : 'Copy email address'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              background: 'transparent',
              border: `1px solid ${copied ? 'rgba(0,229,200,0.28)' : 'rgba(255,255,255,0.09)'}`,
              borderRadius: 5,
              cursor: 'pointer',
              color: copied ? 'var(--eb-teal)' : 'var(--eb-fg-2)',
              fontSize: 11.5,
              fontWeight: 500,
              opacity: copied ? 1 : 0.55,
              transition: 'color 0.18s, opacity 0.18s, border-color 0.18s',
              outline: 'none',
            }}
            onFocus={e => (e.currentTarget.style.outline = '2px solid rgba(0,229,200,0.4)')}
            onBlur={e => (e.currentTarget.style.outline = 'none')}
          >
            {copied ? <CheckIcon size={11} /> : <CopyIcon size={11} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </Reveal>
  );
}
