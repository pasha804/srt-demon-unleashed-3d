import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
  kind: "ember" | "dust" | "spark";
};

/**
 * Full-viewport GPU-friendly canvas: floating embers, lens dust, sparks and
 * drifting volumetric fog. Runs behind every section.
 */
export function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const count = reduce ? 30 : Math.min(170, Math.round((width * height) / 12000));
    const particles: Particle[] = [];

    const spawn = (initial = false): Particle => {
      const roll = Math.random();
      const kind: Particle["kind"] = roll > 0.88 ? "spark" : roll > 0.55 ? "ember" : "dust";
      const maxLife = 260 + Math.random() * 520;
      return {
        x: Math.random() * width,
        y: initial ? Math.random() * height : height + Math.random() * 120,
        vx: (Math.random() - 0.5) * (kind === "spark" ? 1.6 : 0.35),
        vy: -(0.15 + Math.random() * (kind === "spark" ? 1.8 : 0.55)),
        r: kind === "dust" ? 0.4 + Math.random() * 1.1 : 0.7 + Math.random() * 1.8,
        life: initial ? Math.random() * maxLife : 0,
        maxLife,
        kind,
      };
    };

    for (let i = 0; i < count; i++) particles.push(spawn(true));

    let frame = 0;
    let raf = 0;
    const pointer = { x: width / 2, y: height / 2 };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Volumetric fog banks — slow, wide, additive.
      const t = frame * 0.0016;
      for (let i = 0; i < 3; i++) {
        const cx = width * (0.2 + 0.3 * i) + Math.sin(t + i * 2.1) * width * 0.18;
        const cy = height * (0.7 - 0.12 * i) + Math.cos(t * 0.8 + i) * height * 0.08;
        const rad = Math.max(width, height) * (0.35 + 0.08 * i);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, i === 1 ? "rgba(209,18,23,0.055)" : "rgba(120,120,130,0.05)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      }

      // Cursor light bloom.
      const pg = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 320);
      pg.addColorStop(0, "rgba(255,59,59,0.05)");
      pg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = pg;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p) continue;
        p.life++;
        if (p.life > p.maxLife || p.y < -60) {
          particles[i] = spawn();
          continue;
        }
        p.x += p.vx + Math.sin((p.y + frame) * 0.006) * 0.28;
        p.y += p.vy;

        const fade = Math.sin((p.life / p.maxLife) * Math.PI);
        const alpha = fade * (p.kind === "dust" ? 0.28 : 0.85);

        if (p.kind === "spark") {
          ctx.strokeStyle = `rgba(255,107,53,${alpha})`;
          ctx.lineWidth = p.r * 0.7;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 6, p.y - p.vy * 6);
          ctx.stroke();
        } else {
          const color =
            p.kind === "ember" ? `rgba(255,80,45,${alpha})` : `rgba(216,216,216,${alpha * 0.6})`;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          if (p.kind === "ember") {
            const eg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 7);
            eg.addColorStop(0, `rgba(255,59,59,${alpha * 0.32})`);
            eg.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = eg;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 7, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[5]">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
      {/* Moving light shafts */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.14]">
        <div className="absolute -top-1/3 left-[12%] h-[180%] w-[14vw] rotate-12 bg-gradient-to-b from-transparent via-white/70 to-transparent blur-2xl [animation:sweep_18s_linear_infinite]" />
        <div className="absolute -top-1/3 left-[58%] h-[180%] w-[8vw] rotate-12 bg-gradient-to-b from-transparent via-primary/80 to-transparent blur-2xl [animation:sweep_26s_linear_infinite_4s]" />
      </div>
      {/* Vignette + grain */}
      <div className="film-grain absolute inset-0 overflow-hidden [box-shadow:inset_0_0_28vw_10vw_rgba(0,0,0,0.85)]" />
    </div>
  );
}
