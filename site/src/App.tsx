import { MotionConfig } from 'motion/react';
import MeshBackground from './components/MeshBackground';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { ProjectsHeading } from './components/ProjectsHeading';
import { EdgeBoard } from './components/EdgeBoard';
import { Soma } from './components/Soma';
import { OtherWork } from './components/OtherWork';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

function App() {
  return (
    <MotionConfig reducedMotion="user">
      {/* Fixed page-wide background — sits behind all content at z-index 0.
          MeshBackground fills it via position:absolute inset:0. */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: '#050918',
        overflow: 'hidden',
      }}>
        <MeshBackground />
      </div>

      {/* All page content above the background */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav />
        <Hero />
        <About />
        <ProjectsHeading />
        <EdgeBoard />
        <Soma />
        <OtherWork />
        <Skills />
        <Contact />
        <Footer />
      </div>
    </MotionConfig>
  );
}

export default App;
