/**
 * MeshBackground
 *
 * Self-contained animated canvas background.
 * Drop into any React project — no external dependencies required.
 *
 * Usage:
 *   import MeshBackground from "./MeshBackground";
 *
 *   <div style={{ position: "relative", width: "100vw", height: "100vh", background: "#050918" }}>
 *     <MeshBackground />
 *     <div style={{ position: "relative", zIndex: 1 }}>
 *       Your hero content here
 *     </div>
 *   </div>
 *
 * The parent must have a defined size (e.g. height: 100vh).
 * MeshBackground fills it completely via position: absolute, inset: 0.
 * background: "#050918" must be on the parent — the canvas itself is transparent.
 */

import { useEffect, useRef } from "react";

type V3 = [number, number, number];
type ColorKey = "white" | "teal" | "cyan" | "blue" | "violet";
interface NodeDef { pos: V3; color: ColorKey }

const PALETTE: Record<ColorKey, { fill: string; glow: string; glowBlur: number; r: number }> = {
  white:  { fill: "rgba(210, 232, 255, 0.88)", glow: "rgba(160, 205, 255, 0.28)", glowBlur: 9,  r: 2.4 },
  teal:   { fill: "rgba(0, 212, 196, 0.96)",   glow: "rgba(0, 205, 188, 0.60)",   glowBlur: 24, r: 3.5 },
  cyan:   { fill: "rgba(68, 222, 255, 0.96)",   glow: "rgba(68, 222, 255, 0.55)",  glowBlur: 22, r: 3.1 },
  blue:   { fill: "rgba(92, 148, 255, 0.96)",   glow: "rgba(92, 148, 255, 0.50)",  glowBlur: 20, r: 3.0 },
  violet: { fill: "rgba(158, 80, 255, 0.96)",   glow: "rgba(148, 72, 255, 0.58)",  glowBlur: 24, r: 3.5 },
};

const NODES: NodeDef[] = [
  // Region 1 – Central tetrahedral hub
  { pos: [0,    0,     0  ], color: "teal"   },
  { pos: [150, -130,  -80 ], color: "white"  },
  { pos: [-140,-120,  -60 ], color: "white"  },
  { pos: [160,  110,  -70 ], color: "white"  },
  { pos: [-150, 120,  -80 ], color: "violet" },
  { pos: [80,  -20,   180 ], color: "cyan"   },
  { pos: [-70, -10,   200 ], color: "white"  },
  { pos: [0,  -200,   60  ], color: "white"  },
  { pos: [0,   200,   70  ], color: "white"  },

  // Region 2 – Right prismatic cluster
  { pos: [350, -200, -120 ], color: "white"  },
  { pos: [420,  -80,  -90 ], color: "teal"   },
  { pos: [460,  100,  -70 ], color: "white"  },
  { pos: [350, -180,  100 ], color: "white"  },
  { pos: [430,   60,  120 ], color: "white"  },
  { pos: [520,  -80,   20 ], color: "blue"   },
  { pos: [500,   80,   40 ], color: "white"  },
  { pos: [380,  200,   80 ], color: "white"  },

  // Region 3 – Left prismatic cluster
  { pos: [-350,-200, -120 ], color: "white"  },
  { pos: [-420, -80,  -90 ], color: "white"  },
  { pos: [-460, 100,  -70 ], color: "violet" },
  { pos: [-350,-180,  100 ], color: "white"  },
  { pos: [-430,  60,  120 ], color: "teal"   },
  { pos: [-520, -80,   20 ], color: "white"  },
  { pos: [-500,  80,   40 ], color: "blue"   },
  { pos: [-380, 200,   80 ], color: "white"  },

  // Region 4 – Upper architectural arch
  { pos: [-200,-270, -150 ], color: "white"  },
  { pos: [-80, -300, -100 ], color: "white"  },
  { pos: [0,  -300,  -80  ], color: "cyan"   },
  { pos: [80, -300, -100  ], color: "white"  },
  { pos: [200, -270, -150 ], color: "white"  },
  { pos: [-120,-255,  80  ], color: "white"  },
  { pos: [120, -255,  80  ], color: "white"  },

  // Region 5 – Receding background depth plane
  { pos: [100,  -80,  350 ], color: "white"  },
  { pos: [-100, -60,  380 ], color: "white"  },
  { pos: [300,   50,  360 ], color: "white"  },
  { pos: [-300,  70,  380 ], color: "white"  },
  { pos: [0,    150,  340 ], color: "white"  },
  { pos: [200,  280,  320 ], color: "white"  },
  { pos: [-200, 270,  350 ], color: "white"  },
  { pos: [0,   -200,  400 ], color: "white"  },

  // Bridge nodes – cross-region connectors
  { pos: [240,  -90,  -40 ], color: "white"  },
  { pos: [-240, -90,  -40 ], color: "white"  },
  { pos: [0,   -220,   30 ], color: "white"  },
  { pos: [0,    100,  260 ], color: "white"  },
];

function buildEdgesKNN(nodes: NodeDef[], k: number): [number, number][] {
  const n = nodes.length;
  const edges: [number, number][] = [];
  const edgeSet = new Set<string>();
  for (let i = 0; i < n; i++) {
    const [ix, iy, iz] = nodes[i].pos;
    const sorted = nodes
      .map((nd, j) => {
        const [jx, jy, jz] = nd.pos;
        return { j, d: Math.sqrt((ix - jx) ** 2 + (iy - jy) ** 2 + (iz - jz) ** 2) };
      })
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, k);
    for (const { j } of sorted) {
      const a = Math.min(i, j), b = Math.max(i, j);
      const key = `${a},${b}`;
      if (!edgeSet.has(key)) { edgeSet.add(key); edges.push([a, b]); }
    }
  }
  return edges;
}

function buildTriangles(n: number, edges: [number, number][]): [number, number, number][] {
  const adj = new Map<number, Set<number>>();
  for (let i = 0; i < n; i++) adj.set(i, new Set());
  for (const [a, b] of edges) { adj.get(a)!.add(b); adj.get(b)!.add(a); }
  const tris: [number, number, number][] = [];
  const triSet = new Set<string>();
  for (const [a, b] of edges) {
    const setA = adj.get(a)!;
    const setB = adj.get(b)!;
    for (const c of setA) {
      if (c > b && setB.has(c)) {
        const key = `${a},${b},${c}`;
        if (!triSet.has(key)) { triSet.add(key); tris.push([a, b, c]); }
      }
    }
  }
  return tris;
}

const rotY = ([x, y, z]: V3, a: number): V3 => {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c + z * s, y, -x * s + z * c];
};
const rotX = ([x, y, z]: V3, a: number): V3 => {
  const c = Math.cos(a), s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c];
};

const FOCAL = 920;
const project = ([x, y, z]: V3, cx: number, cy: number): [number, number, number] => {
  const scale = FOCAL / (FOCAL + z);
  return [cx + x * scale, cy + y * scale, scale];
};

// Aurora breathing — same 5 glows as before (identical positions, colors, and
// base opacities), now each modulated by an independent slow sine so they
// gently pulse in/out. Periods ~15-24s and amplitude ±14% keep one cycle
// perceptible within the first few seconds without reading as flicker.
const AURORA_DEFS = [
  { px: 0.14, py: 0.54, pr: 0.56, rgb: "0, 145, 180",  base: 0.13, phase: 0.00, freq: 0.36 },
  { px: 0.83, py: 0.62, pr: 0.46, rgb: "105, 48, 215", base: 0.10, phase: 1.83, freq: 0.30 },
  { px: 0.50, py: 0.22, pr: 0.40, rgb: "22, 80, 205",  base: 0.08, phase: 3.54, freq: 0.42 },
  { px: 0.62, py: 0.48, pr: 0.32, rgb: "0, 178, 196",  base: 0.07, phase: 0.92, freq: 0.28 },
  { px: 0.32, py: 0.78, pr: 0.38, rgb: "80, 40, 180",  base: 0.06, phase: 2.41, freq: 0.45 },
] as const;

// Virtual light direction (normalized, upper-left-front) for face shading.
const LIGHT: V3 = [0.267, -0.535, -0.802];

// Face shading — multiplies each triangle's fill opacity by how squarely it
// faces the light. |dot| shades both sides symmetrically (no harsh dark
// backs); range 0.62-1.44 gives noticeably stronger depth than a flat fill
// while staying subtle because the base fill opacities are already tiny.
function faceShade(a: V3, b: V3, c: V3): number {
  const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
  const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
  const nx = uy * vz - uz * vy;
  const ny = uz * vx - ux * vz;
  const nz = ux * vy - uy * vx;
  const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
  const dot = (nx / len) * LIGHT[0] + (ny / len) * LIGHT[1] + (nz / len) * LIGHT[2];
  return 0.62 + Math.abs(dot) * 0.82;
}

// Node twinkle — 0 almost always, briefly spiking toward 1 like a star glint.
// Replaces the old continuous pulse on accent nodes. Exponent 12 widens the
// peak for visibility; base frequency 0.80 makes glints fairly frequent.
function twinkleFor(i: number, t: number): number {
  return Math.pow(Math.max(0, Math.sin(i * 3.7 + t * (0.80 + i * 0.025))), 12);
}

const EDGES = buildEdgesKNN(NODES, 5);
const TRIS  = buildTriangles(NODES.length, EDGES);

export default function MeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const t0 = performance.now();

    // Mouse parallax — geometry drifts gently opposite the cursor. Eased each
    // frame (lerp 0.04) so it glides rather than snaps.
    let mouseNX = 0, mouseNY = 0;
    let camOffX = 0, camOffY = 0;
    // Cursor position in CSS px. Canvas is fixed inset:0, so client coords map
    // straight onto the canvas. Start far offscreen so nothing responds until
    // the pointer actually moves.
    let mousePX = -9999, mousePY = -9999;
    const onMouseMove = (e: MouseEvent) => {
      mouseNX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseNY = (e.clientY / window.innerHeight - 0.5) * 2;
      mousePX = e.clientX;
      mousePY = e.clientY;
    };
    // When the pointer leaves the window, park it offscreen so any lit node
    // eases back to rest instead of staying stuck bright.
    const onMouseLeave = () => { mousePX = -9999; mousePY = -9999; };
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    // Per-node proximity excitement, eased frame-to-frame so it never pops.
    // PROX_RADIUS is the soft reach around the cursor; PROX_EASE controls how
    // gently a node fades in and out of its response.
    const proximity = new Float32Array(NODES.length);
    const PROX_RADIUS = 130;
    const PROX_EASE = 0.07;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const render = (now: number) => {
      const t = (now - t0) * 0.001;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      if (W === 0 || H === 0) { animId = requestAnimationFrame(render); return; }
      const cx = W * 0.5;
      const cy = H * 0.5;

      ctx.clearRect(0, 0, W, H);

      // Aurora backdrop — independent breathing per glow (±14% around base).
      for (const a of AURORA_DEFS) {
        const breathe = 0.90 + 0.14 * Math.sin(t * a.freq + a.phase);
        const g = ctx.createRadialGradient(W * a.px, H * a.py, 0, W * a.px, H * a.py, W * a.pr);
        g.addColorStop(0, `rgba(${a.rgb}, ${a.base * breathe})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // Parallax — ease the camera offset toward the cursor target (±40/±22
      // world units). Applied to the projection center only, so the vignette
      // below stays anchored to the true canvas center.
      camOffX += (mouseNX * -40 - camOffX) * 0.04;
      camOffY += (mouseNY * -22 - camOffY) * 0.04;
      const projCx = cx + camOffX;
      const projCy = cy + camOffY;

      // Transform
      const ry = t * 0.028;
      const rx = Math.sin(t * 0.13) * 0.10;
      const transformed: V3[] = NODES.map(({ pos }) => rotX(rotY(pos, ry), rx));
      const projected = transformed.map(p => project(p, projCx, projCy));

      // Proximity response — ease each node toward a smooth distance falloff
      // from the cursor. Nodes within PROX_RADIUS softly "wake up"; everything
      // else eases back to zero. Blends with (never replaces) the twinkle.
      for (let n = 0; n < projected.length; n++) {
        const dx = projected[n][0] - mousePX;
        const dy = projected[n][1] - mousePY;
        const raw = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / PROX_RADIUS);
        const target = raw * raw * (3 - 2 * raw); // smoothstep — no hard edge
        proximity[n] += (target - proximity[n]) * PROX_EASE;
      }

      const depth = (z: number) => Math.max(0.10, Math.min(1.0, 1 - z / 580));

      // Sort triangles back → front
      const sortedTris = [...TRIS].sort((a, b) => {
        const za = (transformed[a[0]][2] + transformed[a[1]][2] + transformed[a[2]][2]) / 3;
        const zb = (transformed[b[0]][2] + transformed[b[1]][2] + transformed[b[2]][2]) / 3;
        return zb - za;
      });

      // Triangle faces
      for (const [i, j, k] of sortedTris) {
        const [ax, ay] = projected[i];
        const [bx, by] = projected[j];
        const [kx, ky] = projected[k];
        const avgZ = (transformed[i][2] + transformed[j][2] + transformed[k][2]) / 3;
        const d = depth(avgZ);
        const cols = [NODES[i].color, NODES[j].color, NODES[k].color];
        const accent = cols.find(c => c !== "white");

        const shade = faceShade(transformed[i], transformed[j], transformed[k]);

        let rgba: string;
        if      (accent === "teal")   rgba = `rgba(0, 200, 185, ${0.048 * d * shade})`;
        else if (accent === "violet") rgba = `rgba(140, 65, 255, ${0.048 * d * shade})`;
        else if (accent === "cyan")   rgba = `rgba(68, 210, 255, ${0.042 * d * shade})`;
        else if (accent === "blue")   rgba = `rgba(88, 138, 255, ${0.040 * d * shade})`;
        else                          rgba = `rgba(120, 165, 255, ${0.028 * d * shade})`;

        ctx.beginPath();
        ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(kx, ky);
        ctx.closePath();
        ctx.fillStyle = rgba;
        ctx.fill();
      }

      // Edges
      for (const [i, j] of EDGES) {
        const [ax, ay, as_] = projected[i];
        const [bx, by, bs_] = projected[j];
        const avgZ = (transformed[i][2] + transformed[j][2]) / 2;
        const d    = depth(avgZ);
        const avgS = (as_ + bs_) * 0.5;
        const ca = NODES[i].color, cb = NODES[j].color;

        // Very restrained lift on edges touching an active node — same colors,
        // just a touch more presence while the constellation responds.
        const eb = 1 + Math.max(proximity[i], proximity[j]) * 0.4;

        let stroke: string;
        if      (ca === "teal"   || cb === "teal")   stroke = `rgba(0, 212, 196, ${0.22 * d * eb})`;
        else if (ca === "violet" || cb === "violet") stroke = `rgba(150, 75, 255, ${0.20 * d * eb})`;
        else if (ca === "cyan"   || cb === "cyan")   stroke = `rgba(68, 218, 255, ${0.20 * d * eb})`;
        else if (ca === "blue"   || cb === "blue")   stroke = `rgba(95, 145, 255, ${0.18 * d * eb})`;
        else stroke = `rgba(170, 210, 255, ${(0.065 + 0.075 * d) * Math.min(1, avgS * 1.15) * eb})`;

        ctx.beginPath();
        ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
        ctx.strokeStyle = stroke;
        ctx.lineWidth = Math.max(0.28, avgS * 1.05);
        ctx.stroke();
      }

      // Nodes back → front
      const nodeOrder = transformed
        .map((p, i) => ({ i, z: p[2] }))
        .sort((a, b) => b.z - a.z);

      for (const { i } of nodeOrder) {
        const [sx, sy, scale] = projected[i];
        const { color } = NODES[i];
        const pal = PALETTE[color];
        const z   = transformed[i][2];
        const d   = depth(z);
        const isAccent = color !== "white";
        const tk  = isAccent ? twinkleFor(i, t) : 0;
        const ex  = proximity[i]; // eased cursor-proximity response, 0 at rest
        const r = pal.r * scale;

        // Outer halo (accent nodes only) — expands/brightens during a glint,
        // and eases wider as the cursor comes near (same accent glow color).
        if (isAccent) {
          const haloR = r * (4.8 + tk * 4.0 + ex * 2.2);
          const gr = ctx.createRadialGradient(sx, sy, 0, sx, sy, haloR);
          gr.addColorStop(0, pal.glow);
          gr.addColorStop(1, "rgba(0,0,0,0)");
          ctx.save();
          ctx.globalAlpha = Math.min(1, d * (0.42 + tk * 0.55 + ex * 0.30));
          ctx.beginPath(); ctx.arc(sx, sy, haloR, 0, Math.PI * 2);
          ctx.fillStyle = gr; ctx.fill();
          ctx.restore();
        }

        // Node circle — glows brighter during a glint and when the cursor nears
        ctx.save();
        ctx.shadowColor = pal.glow;
        ctx.shadowBlur  = pal.glowBlur * scale * (1 + tk * 1.0 + ex * 0.6);
        ctx.globalAlpha = Math.min(1, d * (isAccent ? 0.90 + tk * 0.55 + ex * 0.28 : 0.62 + ex * 0.20));
        ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = pal.fill;
        ctx.fill();
        ctx.restore();
      }

      // Vignette
      const vig = ctx.createRadialGradient(
        cx, cy, Math.min(W, H) * 0.25,
        cx, cy, Math.max(W, H) * 0.78
      );
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(4, 7, 22, 0.62)");
      ctx.fillStyle = vig;
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, W, H);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}