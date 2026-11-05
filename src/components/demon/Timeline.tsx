import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SectionHeader } from "./SectionHeader";
import { TIMELINE } from "./data";

export function Timeline() {
  const [active, setActive] = useState(4);
  const entry = TIMELINE[active]!;

  return (
    <section id="timeline" className="relative px-6 py-28 md:px-16 md:py-40 lg:px-24">
      <SectionHeader
        index="06"
        eyebrow="Timeline"
        title={
          <>
            The legacy
            <br />
            of power
          </>
        }
        copy="Fifty-four years of American muscle, from the first E-body to the last combustion Challenger."
      />

      <div className="relative">
        <div className="absolute top-[27px] right-0 left-0 h-px bg-white/10" />
        <motion.div
          className="absolute top-[27px] left-0 h-px bg-primary"
          animate={{ width: `${((active + 0.5) / TIMELINE.length) * 100}%` }}
          transition={{ type: "spring", stiffness: 70, damping: 20 }}
          style={{ boxShadow: "0 0 16px var(--glow-red)" }}
        />

        <div className="relative flex gap-4 overflow-x-auto pb-4">
          {TIMELINE.map((t, i) => {
            const isActive = i === active;
            return (
              <button
                key={t.year}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                data-cursor="true"
                className="group flex min-w-[130px] flex-1 flex-col items-start gap-4 text-left"
              >
                <span
                  className={`display text-2xl transition-colors duration-300 md:text-3xl ${
                    isActive ? "text-foreground glow-text" : "text-muted-foreground"
                  }`}
                >
                  {t.year}
                </span>
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-400 ${
                      isActive
                        ? "scale-125 bg-primary shadow-[0_0_18px_var(--glow-red)]"
                        : "bg-steel group-hover:bg-smoke"
                    }`}
                  />
                </span>
                <span
                  className={`font-mono text-[9px] tracking-[0.2em] uppercase transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground/60"
                  }`}
                >
                  {t.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={entry.year}
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 grid gap-6 border-t border-white/8 pt-10 md:grid-cols-[180px_minmax(0,1fr)]"
        >
          <p className="display text-6xl ember-text md:text-7xl">{entry.year}</p>
          <div>
            <h3 className="display text-3xl md:text-4xl">{entry.title}</h3>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {entry.copy}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
