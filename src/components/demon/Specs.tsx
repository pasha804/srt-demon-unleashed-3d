import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SPECS } from "./data";
import { SectionHeader } from "./SectionHeader";
import carSide from "@/assets/gallery-1.jpg";

/** Hotspot anchors, expressed as % of the car plate. */
const ANCHORS: Record<string, { x: number; y: number }> = {
  engine: { x: 32, y: 52 },
  horsepower: { x: 44, y: 46 },
  torque: { x: 66, y: 68 },
  transmission: { x: 52, y: 70 },
  weight: { x: 50, y: 82 },
  acceleration: { x: 72, y: 60 },
  topspeed: { x: 82, y: 48 },
};

export function Specs() {
  const [activeId, setActiveId] = useState(SPECS[0]!.id);
  const active = SPECS.find((s) => s.id === activeId) ?? SPECS[0]!;
  const anchor = ANCHORS[active.id] ?? { x: 50, y: 50 };

  return (
    <section id="specs" className="relative px-6 py-28 md:px-16 md:py-40 lg:px-24">
      <SectionHeader
        index="02"
        eyebrow="Spec Experience"
        title={
          <>
            Numbers that
            <br />
            <span className="ember-text">break physics</span>
          </>
        }
        copy="Select a system. The card fades in, the line reaches out, and the corresponding part of the car lights up."
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Car plate + animated connector */}
        <div className="relative overflow-hidden rounded-sm border border-white/8 bg-carbon/60">
          <img
            src={carSide}
            alt="Side profile of the Challenger SRT Demon under a spotlight"
            width={1600}
            height={1008}
            loading="lazy"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_60%,transparent,rgba(5,5,5,0.7))]" />

          {/* Highlighted part */}
          <motion.div
            className="pointer-events-none absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
            animate={{ left: `${anchor.x}%`, top: `${anchor.y}%` }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--glow-red) 45%, transparent), transparent 70%)",
            }}
          />
          <motion.div
            className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary"
            animate={{ left: `${anchor.x}%`, top: `${anchor.y}%` }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          >
            <span className="pulse-glow absolute inset-0 rounded-full bg-primary/60" />
          </motion.div>

          {/* Floating value card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel absolute bottom-5 left-5 max-w-xs rounded-sm p-5 md:bottom-8 md:left-8"
            >
              <p className="eyebrow mb-2 text-primary">{active.label}</p>
              <p className="display text-5xl md:text-6xl">{active.value}</p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.22em] text-smoke uppercase">
                {active.unit}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{active.detail}</p>
            </motion.div>
          </AnimatePresence>

          <div className="scanlines pointer-events-none absolute inset-0 opacity-30" />
        </div>

        {/* Card rail */}
        <div className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
          {SPECS.map((spec, i) => {
            const isActive = spec.id === activeId;
            return (
              <motion.button
                key={spec.id}
                onMouseEnter={() => setActiveId(spec.id)}
                onFocus={() => setActiveId(spec.id)}
                onClick={() => setActiveId(spec.id)}
                data-cursor="true"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className={`group relative min-w-[190px] shrink-0 overflow-hidden rounded-sm border px-4 py-3 text-left transition-all duration-400 lg:min-w-0 ${
                  isActive
                    ? "border-primary/70 bg-primary/10 shadow-[0_0_45px_-15px_var(--glow-red)]"
                    : "border-white/8 bg-carbon/50 hover:border-white/25"
                }`}
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
                    {spec.label}
                  </span>
                  <span
                    className={`display text-xl transition-colors ${isActive ? "text-primary" : "text-smoke"}`}
                  >
                    {spec.value}
                  </span>
                </span>
                <span
                  className={`absolute inset-y-0 left-0 w-px transition-all duration-500 ${
                    isActive ? "bg-primary" : "bg-transparent"
                  }`}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
