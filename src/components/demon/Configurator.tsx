import { useState } from "react";
import { motion } from "motion/react";
import { SectionHeader } from "./SectionHeader";
import { CALIPERS, PAINTS, WHEELS } from "./data";
import carSide from "@/assets/gallery-1.jpg";

const ENVIRONMENTS = [
  { id: "warehouse", name: "Warehouse", light: "rgba(216,216,216,0.16)" },
  { id: "strip", name: "Drag Strip", light: "rgba(255,107,53,0.22)" },
  { id: "tunnel", name: "Red Tunnel", light: "rgba(209,18,23,0.28)" },
];

export function Configurator() {
  const [paint, setPaint] = useState(PAINTS[0]!);
  const [wheel, setWheel] = useState(WHEELS[0]!);
  const [caliper, setCaliper] = useState(CALIPERS[0]!);
  const [spoiler, setSpoiler] = useState(true);
  const [env, setEnv] = useState(ENVIRONMENTS[0]!);
  const [headlights, setHeadlights] = useState(true);

  const price =
    104995 +
    (wheel.id === "carbon" ? 6200 : wheel.id === "forged" ? 3400 : 0) +
    (spoiler ? 1895 : 0) +
    (paint.id === "pitch" ? 0 : 795);

  return (
    <section id="configurator" className="relative px-6 py-28 md:px-16 md:py-40 lg:px-24">
      <SectionHeader
        index="07"
        eyebrow="Configurator"
        title={
          <>
            Build
            <br />
            your demon
          </>
        }
        copy="Paint, wheels, calipers, aero and environment. Every choice re-lights the car in real time."
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Stage */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-white/8 bg-carbon">
          <motion.div
            className="absolute inset-0"
            animate={{ backgroundColor: env.light }}
            transition={{ duration: 0.8 }}
          />
          <motion.img
            src={carSide}
            alt={`Challenger SRT Demon configured in ${paint.name}`}
            width={1600}
            height={1008}
            loading="lazy"
            animate={{
              filter: `hue-rotate(${paint.tint}) saturate(${paint.id === "smoke" ? 0.2 : 1.3}) brightness(${paint.id === "pitch" ? 0.85 : 1})`,
              scale: 1.02,
            }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Paint tint wash */}
          <motion.div
            className="absolute inset-0 mix-blend-color"
            animate={{ backgroundColor: paint.hex, opacity: paint.id === "pitch" ? 0 : 0.55 }}
            transition={{ duration: 0.8 }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(65%_65%_at_50%_60%,transparent,rgba(5,5,5,0.8))]" />

          {/* Headlights */}
          <motion.div
            className="absolute top-[58%] left-[19%] h-16 w-24 rounded-full blur-2xl"
            animate={{ opacity: headlights ? 0.85 : 0 }}
            style={{ background: "radial-gradient(circle, #fff, transparent 70%)" }}
          />
          {/* Caliper glow */}
          <motion.div
            className="absolute top-[68%] left-[28%] h-6 w-6 rounded-full blur-md"
            animate={{ backgroundColor: caliper.hex, opacity: 0.9 }}
          />
          <motion.div
            className="absolute top-[68%] left-[67%] h-6 w-6 rounded-full blur-md"
            animate={{ backgroundColor: caliper.hex, opacity: 0.9 }}
          />
          {/* Spoiler bar */}
          <motion.div
            className="absolute top-[52%] right-[13%] h-1.5 w-20 origin-right rounded-full bg-jet/90 shadow-[0_0_20px_rgba(0,0,0,0.9)]"
            animate={{ opacity: spoiler ? 1 : 0, scaleX: spoiler ? 1 : 0.2 }}
            transition={{ duration: 0.5 }}
          />

          <div className="scanlines pointer-events-none absolute inset-0 opacity-20" />

          <div className="absolute bottom-5 left-5 font-mono text-[10px] tracking-[0.24em] text-smoke uppercase">
            {paint.name} · {wheel.size}
          </div>
          <div className="absolute right-5 bottom-5 text-right">
            <p className="eyebrow">As configured</p>
            <p className="display text-3xl tabular-nums">${price.toLocaleString()}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="glass-panel flex flex-col gap-7 rounded-sm p-6 md:p-8">
          <Control label="Body Paint">
            <div className="flex flex-wrap gap-3">
              {PAINTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPaint(p)}
                  aria-label={p.name}
                  data-cursor="true"
                  className={`h-9 w-9 rounded-full border-2 transition-all duration-300 ${
                    paint.id === p.id
                      ? "scale-110 border-primary shadow-[0_0_22px_-4px_var(--glow-red)]"
                      : "border-white/15 hover:border-white/50"
                  }`}
                  style={{ backgroundColor: p.hex }}
                />
              ))}
            </div>
            <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              {paint.name}
            </p>
          </Control>

          <Control label="Wheels">
            <div className="grid gap-2">
              {WHEELS.map((w) => (
                <Option
                  key={w.id}
                  active={wheel.id === w.id}
                  onClick={() => setWheel(w)}
                  title={w.name}
                  meta={w.size}
                />
              ))}
            </div>
          </Control>

          <Control label="Brake Calipers">
            <div className="flex gap-2">
              {CALIPERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCaliper(c)}
                  data-cursor="true"
                  className={`flex-1 rounded-sm border px-3 py-2 font-mono text-[9px] tracking-[0.18em] uppercase transition-colors ${
                    caliper.id === c.id
                      ? "border-primary bg-primary/15 text-foreground"
                      : "border-white/10 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span
                    className="mr-2 inline-block h-2 w-2 rounded-full align-middle"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </Control>

          <Control label="Environment">
            <div className="flex gap-2">
              {ENVIRONMENTS.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setEnv(e)}
                  data-cursor="true"
                  className={`flex-1 rounded-sm border px-3 py-2 font-mono text-[9px] tracking-[0.18em] uppercase transition-colors ${
                    env.id === e.id
                      ? "border-primary bg-primary/15 text-foreground"
                      : "border-white/10 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {e.name}
                </button>
              ))}
            </div>
          </Control>

          <div className="grid grid-cols-2 gap-3">
            <Toggle label="Rear Spoiler" on={spoiler} onToggle={() => setSpoiler((v) => !v)} />
            <Toggle
              label="Halo Lighting"
              on={headlights}
              onToggle={() => setHeadlights((v) => !v)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-3">{label}</p>
      {children}
    </div>
  );
}

function Option({
  active,
  onClick,
  title,
  meta,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  meta: string;
}) {
  return (
    <button
      onClick={onClick}
      data-cursor="true"
      className={`flex items-center justify-between rounded-sm border px-4 py-3 text-left transition-all duration-300 ${
        active
          ? "border-primary/70 bg-primary/10"
          : "border-white/10 hover:border-white/30"
      }`}
    >
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase">{title}</span>
      <span className="font-mono text-[9px] text-muted-foreground">{meta}</span>
    </button>
  );
}

function Toggle({
  label,
  on,
  onToggle,
}: {
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      data-cursor="true"
      className={`flex items-center justify-between rounded-sm border px-4 py-3 transition-colors ${
        on ? "border-primary/70 bg-primary/10" : "border-white/10"
      }`}
    >
      <span className="font-mono text-[9px] tracking-[0.18em] uppercase">{label}</span>
      <span
        className={`relative h-4 w-8 rounded-full transition-colors ${on ? "bg-primary" : "bg-steel"}`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className="absolute top-0.5 h-3 w-3 rounded-full bg-white"
          style={{ left: on ? 18 : 2 }}
        />
      </span>
    </button>
  );
}
