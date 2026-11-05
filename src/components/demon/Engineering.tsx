import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SectionHeader } from "./SectionHeader";
import { ENGINE_HOTSPOTS } from "./data";
import engine from "@/assets/engine.jpg";

export function Engineering() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [exploded, setExploded] = useState(false);
  const active = ENGINE_HOTSPOTS.find((h) => h.id === activeId) ?? null;

  return (
    <section id="engineering" className="relative px-6 py-28 md:px-16 md:py-40 lg:px-24">
      <SectionHeader
        index="05"
        eyebrow="Engineering"
        title={
          <>
            Engineered
            <br />
            to dominate
          </>
        }
        copy="25 major components were re-engineered over the Hellcat. Hover a node to isolate the system — click to detonate the exploded view."
      />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center">
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-sm border border-white/8 bg-carbon/50"
          onClick={() => setExploded((v) => !v)}
          data-cursor={exploded ? "assemble" : "explode"}
        >
          <motion.img
            src={engine}
            alt="Supercharged 6.2L HEMI V8 engine"
            width={1536}
            height={1024}
            loading="lazy"
            animate={{ scale: exploded ? 1.22 : 1, rotate: exploded ? -1.5 : 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-full object-contain"
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,transparent,rgba(5,5,5,0.65))]" />

          {ENGINE_HOTSPOTS.map((h, i) => {
            const isActive = h.id === activeId;
            const offsetX = exploded ? (h.x - 50) * 0.35 : 0;
            const offsetY = exploded ? (h.y - 50) * 0.35 : 0;
            return (
              <motion.button
                key={h.id}
                onMouseEnter={() => setActiveId(h.id)}
                onMouseLeave={() => setActiveId(null)}
                onFocus={() => setActiveId(h.id)}
                aria-label={h.name}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${h.x + offsetX}%`, top: `${h.y + offsetY}%` }}
              >
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full ${isActive ? "bg-primary" : "bg-primary/70"} opacity-70 [animation:ping_2.2s_cubic-bezier(0,0,0.2,1)_infinite]`}
                  />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white shadow-[0_0_14px_var(--glow-red)]" />
                </span>
              </motion.button>
            );
          })}

          <div className="pointer-events-none absolute top-5 left-5 font-mono text-[10px] tracking-[0.24em] text-muted-foreground uppercase">
            {exploded ? "Exploded view" : "Assembly view"} · click to toggle
          </div>
        </div>

        <div className="relative min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active?.id ?? "idle"}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
              transition={{ duration: 0.45 }}
              className="glass-panel rounded-sm p-7"
            >
              {active ? (
                <>
                  <p className="eyebrow mb-3 text-primary">System</p>
                  <h3 className="display text-3xl">{active.name}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {active.copy}
                  </p>
                </>
              ) : (
                <>
                  <p className="eyebrow mb-3 text-primary">6.2L HEMI V8</p>
                  <h3 className="display text-3xl">Five systems. One purpose.</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Every subsystem exists to move 4,280 pounds of steel 1,320 feet as violently as
                    physics allows.
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <ul className="mt-6 grid gap-px overflow-hidden rounded-sm border border-white/8 bg-white/5">
            {ENGINE_HOTSPOTS.map((h) => (
              <li key={h.id}>
                <button
                  onMouseEnter={() => setActiveId(h.id)}
                  onClick={() => setActiveId(h.id)}
                  data-cursor="true"
                  className={`flex w-full items-center justify-between px-4 py-3 text-left font-mono text-[10px] tracking-[0.22em] uppercase transition-colors duration-300 ${
                    h.id === activeId
                      ? "bg-primary/15 text-foreground"
                      : "bg-carbon text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {h.name}
                  <span className="text-primary">→</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
