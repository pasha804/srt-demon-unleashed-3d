import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const STAGES = [
  "INITIALIZING IGNITION",
  "PRIMING FUEL SYSTEM",
  "SPOOLING SUPERCHARGER",
  "CALIBRATING TRANSBRAKE",
  "DEMON AWAKE",
];

export function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [flash, setFlash] = useState(false);
  const [gone, setGone] = useState(false);
  const rpmRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let value = 0;
    const id = window.setInterval(() => {
      // Uneven, engine-like ramp.
      value = Math.min(100, value + Math.random() * 6 + 1.5);
      setProgress(value);
      if (value >= 100) {
        window.clearInterval(id);
        setTimeout(() => setFlash(true), 250);
        setTimeout(() => {
          setGone(true);
          onDone();
        }, 1250);
      }
    }, 90);
    return () => window.clearInterval(id);
  }, [onDone]);

  const stage = STAGES[Math.min(STAGES.length - 1, Math.floor(progress / 21))];

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="film-grain fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-jet"
          exit={{ opacity: 0, scale: 1.18, filter: "blur(14px)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Rising ambient red glow */}
          <div
            className="absolute inset-x-0 bottom-0 h-[70vh]"
            style={{
              background:
                "radial-gradient(60% 100% at 50% 100%, color-mix(in oklab, var(--demon) 30%, transparent), transparent 70%)",
              opacity: 0.2 + (progress / 100) * 0.8,
              transition: "opacity 400ms linear",
            }}
          />

          {/* Headlights */}
          <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-[16vw]">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-[7vw] max-h-16 min-h-8 w-[7vw] max-w-16 min-w-8 rounded-full"
                style={{
                  background: "radial-gradient(circle, #fff 0%, var(--glow-red) 45%, transparent 72%)",
                  opacity: flash ? 1 : 0.08 + (progress / 100) * 0.75,
                  filter: `blur(${flash ? 2 : 6}px)`,
                  transform: `scale(${flash ? 3.4 : 0.7 + (progress / 100) * 0.5})`,
                  transition: "all 350ms ease-out",
                }}
              />
            ))}
          </div>

          <div
            ref={rpmRef}
            className="relative z-10 flex w-[min(88vw,640px)] flex-col items-center gap-8"
            style={{ transform: `translateY(${(1 - progress / 100) * 6}px)` }}
          >
            <motion.div
              initial={{ opacity: 0, letterSpacing: "0.6em" }}
              animate={{ opacity: 1, letterSpacing: "0.12em" }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="display glow-text text-center text-[clamp(2.5rem,9vw,6rem)]"
            >
              SRT <span className="ember-text">DEMON</span>
            </motion.div>

            {/* RPM bars */}
            <div className="flex h-10 w-full items-end gap-[3px]">
              {Array.from({ length: 40 }).map((_, i) => {
                const on = (i / 40) * 100 < progress;
                return (
                  <div
                    key={i}
                    className="flex-1 origin-bottom rounded-[1px] transition-all duration-150"
                    style={{
                      height: `${25 + (i / 40) * 75}%`,
                      background: on
                        ? i > 31
                          ? "var(--glow-red)"
                          : "color-mix(in oklab, #fff 85%, transparent)"
                        : "color-mix(in oklab, #fff 8%, transparent)",
                      boxShadow: on && i > 31 ? "0 0 14px var(--glow-red)" : undefined,
                      transform: on ? `scaleY(${1 + Math.random() * 0.08})` : "scaleY(1)",
                    }}
                  />
                );
              })}
            </div>

            <div className="flex w-full items-center justify-between font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              <span>{stage}</span>
              <span className="text-foreground tabular-nums">
                {String(Math.floor(progress)).padStart(3, "0")}%
              </span>
            </div>
            <div className="h-px w-full bg-white/10">
              <div
                className="h-full bg-primary transition-[width] duration-100 ease-linear"
                style={{ width: `${progress}%`, boxShadow: "0 0 18px var(--glow-red)" }}
              />
            </div>
          </div>

          {flash && (
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.85, 0] }}
              transition={{ duration: 0.55, times: [0, 0.2, 1] }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
