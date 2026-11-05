import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { SectionHeader } from "./SectionHeader";
import { useCountUp } from "./hooks";

const METRICS = [
  { label: "Horsepower", value: 808, suffix: "HP", decimals: 0 },
  { label: "Torque", value: 717, suffix: "LB-FT", decimals: 0 },
  { label: "0 – 60 MPH", value: 2.3, suffix: "SEC", decimals: 1 },
  { label: "Quarter Mile", value: 9.65, suffix: "SEC", decimals: 2 },
  { label: "Top Speed", value: 203, suffix: "MPH", decimals: 0 },
  { label: "Launch G-Force", value: 1.8, suffix: "G", decimals: 1 },
];

function Metric({ label, value, suffix, decimals }: (typeof METRICS)[number]) {
  const { ref, display } = useCountUp(value, decimals);
  return (
    <div className="border-l border-white/10 pl-4">
      <p className="eyebrow mb-2">{label}</p>
      <p className="display text-4xl md:text-5xl">
        <span ref={ref} className="tabular-nums">
          {display}
        </span>
        <span className="ml-2 font-mono text-[10px] tracking-[0.2em] text-primary">{suffix}</span>
      </p>
    </div>
  );
}

/** Canvas speedometer with realistic needle overshoot and glowing arc. */
function Speedometer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-20%" });
  const [mph, setMph] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 4200;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // Ease out with an elastic overshoot near the end.
      const eased = 1 - Math.pow(1 - t, 4);
      const overshoot = Math.sin(t * Math.PI * 3) * (1 - t) * 0.09;
      setMph(Math.max(0, (eased + overshoot) * 203));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const size = 520;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 36;
    const START = Math.PI * 0.75;
    const SWEEP = Math.PI * 1.5;
    const ratio = Math.min(1, mph / 203);

    // Track
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.09)";
    ctx.beginPath();
    ctx.arc(cx, cy, r, START, START + SWEEP);
    ctx.stroke();

    // Ticks
    for (let i = 0; i <= 40; i++) {
      const a = START + (i / 40) * SWEEP;
      const major = i % 5 === 0;
      const lit = i / 40 <= ratio;
      const inner = r - (major ? 20 : 10);
      ctx.strokeStyle = lit
        ? i > 32
          ? "rgba(255,59,59,0.95)"
          : "rgba(255,255,255,0.9)"
        : "rgba(255,255,255,0.16)";
      ctx.lineWidth = major ? 2.5 : 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.stroke();

      if (major) {
        ctx.fillStyle = "rgba(216,216,216,0.6)";
        ctx.font = "500 11px ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          String(Math.round((i / 40) * 200)),
          cx + Math.cos(a) * (r - 38),
          cy + Math.sin(a) * (r - 38),
        );
      }
    }

    // Glowing progress arc
    ctx.save();
    ctx.shadowBlur = 26;
    ctx.shadowColor = "rgba(255,59,59,0.9)";
    ctx.strokeStyle = "rgba(209,18,23,0.95)";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(cx, cy, r - 3, START, START + SWEEP * ratio);
    ctx.stroke();
    ctx.restore();

    // Needle
    const na = START + SWEEP * ratio;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(na);
    ctx.shadowBlur = 22;
    ctx.shadowColor = "rgba(255,59,59,0.9)";
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(-8, -4);
    ctx.lineTo(r - 26, -1.4);
    ctx.lineTo(r - 26, 1.4);
    ctx.lineTo(-8, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "#0e0e0e";
    ctx.strokeStyle = "rgba(255,59,59,0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }, [mph]);

  const rpm = Math.min(6500, 800 + (mph / 203) * 5700);

  return (
    <div ref={wrapRef} className="relative mx-auto aspect-square w-full max-w-[520px]">
      <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle,rgba(209,18,23,0.18),transparent_70%)] blur-2xl" />
      <canvas ref={canvasRef} className="relative h-full w-full" aria-hidden />
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
        <p className="display text-6xl tabular-nums md:text-7xl">{Math.round(mph)}</p>
        <p className="eyebrow mt-1">MPH</p>
        <p className="mt-4 font-mono text-[10px] tracking-[0.24em] text-primary">
          {Math.round(rpm).toLocaleString()} RPM
        </p>
      </div>
    </div>
  );
}

export function Performance() {
  return (
    <section id="performance" className="relative px-6 py-28 md:px-16 md:py-40 lg:px-24">
      <SectionHeader
        index="03"
        eyebrow="Performance"
        title={
          <>
            Pure
            <br />
            performance
          </>
        }
        copy="A factory-certified 9.65 second quarter mile. The first production car ever to lift its front wheels off the line."
      />

      <div className="grid items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Speedometer />
        </motion.div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
            >
              <Metric {...m} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
