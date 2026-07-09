import { CONTAINER_BG } from './constants';
import { useHeroMesh } from './useHeroMesh';
import './HeroMeshCanvas.css';

/**
 * Self-contained hero background: a rotating low-poly wireframe mesh with an
 * aurora backdrop, per the animation-system handoff. Absolutely positioned
 * to fill its container (Hero's own `position: relative` section, 100vh) —
 * it's local to the hero, not the page-wide ambient background.
 */
export function HeroMeshCanvas() {
  const canvasRef = useHeroMesh();

  return (
    <div className="hero-mesh-container" style={{ background: CONTAINER_BG }} aria-hidden="true">
      <canvas ref={canvasRef} className="hero-mesh-canvas" />
    </div>
  );
}
