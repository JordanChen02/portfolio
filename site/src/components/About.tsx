import { Reveal } from '../motion/Reveal';

export function About() {
  return (
    <Reveal as="section" id="about" className="section" style={{ textAlign: 'center' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
        <p className="eyebrow">About</p>
        <div className="divider-bar" />
        <p style={{ fontSize: 'clamp(19px, 2.4vw, 25px)', lineHeight: 1.65, color: 'var(--eb-fg-1)', fontWeight: 400, margin: 0, textWrap: 'balance' }}>
          The projects on this site came from problems I experienced firsthand. EdgeBoard grew out of years of discretionary NQ trading, where I wanted a better feedback loop than a spreadsheet. SOMA came from coaching clients and wanting a more connected approach to training than scattered apps could provide. My background spans markets and human performance—I build software because it's the best tool I've found for turning domain knowledge into something useful.
        </p>
      </div>
    </Reveal>
  );
}
