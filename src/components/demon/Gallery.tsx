import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import hero from "@/assets/hero-demon.jpg";

const SLIDES = [
  { src: g1, title: "Silent Threat", caption: "Warehouse 04 — spotlight study" },
  { src: g2, title: "Ignition", caption: "Burnout box — 2350 RPM on the TransBrake" },
  { src: g3, title: "Predator Eyes", caption: "Halo projector detail — rain shoot" },
  { src: g4, title: "Tunnel Run", caption: "Red line tunnel — night pass" },
  { src: hero, title: "Full Frontal", caption: "Fog chamber — hero portrait" },
];

export function Gallery() {
  const [index, setIndex] = useState(0);
  const [full, setFull] = useState(false);
  const dragStart = useRef<number | null>(null);

  const go = useCallback((dir: number) => {
    setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") setFull(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const slide = SLIDES[index]!;

  return (
    <section id="gallery" className="relative px-6 py-28 md:px-16 md:py-40 lg:px-24">
      <SectionHeader
        index="04"
        eyebrow="Cinematic Gallery"
        title={
          <>
            Shot like
            <br />
            <span className="ember-text">a film</span>
          </>
        }
        copy="Drag, swipe or use the arrow keys. Every frame is a slow Ken Burns push with ambient light bleeding off the edges."
      />

      <div
        className="group relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-white/8 select-none md:aspect-[21/9]"
        onPointerDown={(e) => (dragStart.current = e.clientX)}
        onPointerUp={(e) => {
          if (dragStart.current === null) return;
          const delta = e.clientX - dragStart.current;
          if (Math.abs(delta) > 60) go(delta < 0 ? 1 : -1);
          dragStart.current = null;
        }}
        data-cursor="drag"
      >
        <AnimatePresence mode="sync">
          <motion.img
            key={index}
            src={slide.src}
            alt={slide.title}
            width={1600}
            height={1008}
            loading="lazy"
            initial={{ opacity: 0, scale: 1.16, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1.04, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(12px)" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-jet via-transparent to-jet/40" />
        <div className="scanlines pointer-events-none absolute inset-0 opacity-20" />

        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6 }}
            >
              <p className="display text-3xl md:text-5xl">{slide.title}</p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.24em] text-muted-foreground uppercase">
                {slide.caption}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2">
            <button
              onClick={() => go(-1)}
              aria-label="Previous image"
              data-cursor="prev"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-jet/50 backdrop-blur-md transition-colors hover:border-primary hover:bg-primary/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next image"
              data-cursor="next"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-jet/50 backdrop-blur-md transition-colors hover:border-primary hover:bg-primary/20"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setFull(true)}
              aria-label="View fullscreen"
              data-cursor="zoom"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-jet/50 backdrop-blur-md transition-colors hover:border-primary hover:bg-primary/20"
            >
              <Expand className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
        {SLIDES.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setIndex(i)}
            data-cursor="true"
            className={`relative h-16 w-28 shrink-0 overflow-hidden rounded-sm border transition-all duration-500 md:h-20 md:w-36 ${
              i === index
                ? "border-primary opacity-100 shadow-[0_0_35px_-12px_var(--glow-red)]"
                : "border-white/10 opacity-45 hover:opacity-80"
            }`}
          >
            <img
              src={s.src}
              alt={s.title}
              width={144}
              height={80}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {full && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-jet/96 p-4 backdrop-blur-xl"
            onClick={() => setFull(false)}
          >
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              src={slide.src}
              alt={slide.title}
              className="max-h-full max-w-full object-contain"
            />
            <button
              aria-label="Close"
              className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/20"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
