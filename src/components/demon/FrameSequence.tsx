/**
 * FrameSequence.tsx
 *
 * Cinematic scroll-driven frame sequence section.
 * Sits between <Hero /> and <Specs />.
 *
 * Architecture:
 *  - A tall outer <section> provides the scroll travel distance.
 *  - A sticky inner div pins the canvas in the viewport throughout.
 *  - Scroll progress is read from getBoundingClientRect().top every RAF tick.
 *  - All 480 frames are preloaded into HTMLImageElement memory before reveal.
 *  - Canvas draws via RAF only when the resolved frame index changes.
 *  - Works with Lenis (reads window.scrollY which Lenis drives natively).
 *  - Zero React state in the hot rendering path — everything via refs.
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { lenisInstance } from "./hooks";

// ─── Configuration ───────────────────────────────────────────────────────────

const CAR1_FRAMES = 240;
const CAR2_FRAMES = 240;
const TOTAL_FRAMES = CAR1_FRAMES + CAR2_FRAMES; // 480

/**
 * Pixels of scroll travel per frame.
 * 6 px/frame × 480 frames = 2880px total pinned scroll distance.
 * Feels very close to Apple's product scroll pacing.
 */
const PX_PER_FRAME = 6;
const SCROLL_HEIGHT = TOTAL_FRAMES * PX_PER_FRAME; // 2880 px

// ─── Helpers ─────────────────────────────────────────────────────────────────

const pad3 = (n: number) => String(n).padStart(3, "0");

function frameUrl(index: number): string {
  if (index < CAR1_FRAMES) {
    return `/car1/ezgif-frame-${pad3(index + 1)}.jpg`;
  }
  return `/car2/ezgif-frame-${pad3(index - CAR1_FRAMES + 1)}.jpg`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function FrameSequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const imagesRef  = useRef<(HTMLImageElement | null)[]>([]);

  // Rendering state — all refs, no re-renders
  const frameRef      = useRef(0);
  const lastDrawnRef  = useRef(-1);
  const rafRef        = useRef(0);

  // React state only for the preload UI
  const [loadStatus, setLoadStatus]   = useState<"loading" | "ready">("loading");
  const [loadProgress, setLoadProgress] = useState(0);

  // ── 1. Preload all 480 frames ─────────────────────────────────────────────
  useEffect(() => {
    const images: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
    let done = 0;

    const onSettled = () => {
      done++;
      setLoadProgress(Math.round((done / TOTAL_FRAMES) * 100));
      if (done === TOTAL_FRAMES) {
        imagesRef.current = images;
        setLoadStatus("ready");
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      // High decode priority hint (supported in modern browsers)
      img.decoding = "async";
      img.src = frameUrl(i);
      img.onload  = onSettled;
      img.onerror = onSettled; // count errors as settled so we don't hang
      images[i] = img;
    }

    return () => {
      // Abort pending network requests by clearing src
      images.forEach((img) => { if (img) img.src = ""; });
    };
  }, []);

  // ── 2. Canvas size — DPR-aware, updates on resize ────────────────────────
  useEffect(() => {
    if (loadStatus !== "ready") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width  = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      lastDrawnRef.current = -1; // force redraw after resize
    };

    size();
    window.addEventListener("resize", size, { passive: true });
    return () => window.removeEventListener("resize", size);
  }, [loadStatus]);

  // ── 3. Core draw function — "cover" fit, no stretching ───────────────────
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // "cover" — scale until both axes fill the canvas, then centre
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
    lastDrawnRef.current = index;
  };

  // ── 4. Scroll → frame mapping ────────────────────────────────────────────
  //
  // Strategy: read section's bounding rect every RAF tick.
  // When rect.top < 0 the section has started scrolling.
  // progress = -rect.top / SCROLL_HEIGHT, clamped [0, 1].
  // This works identically with Lenis because Lenis drives window.scrollY.
  useEffect(() => {
    if (loadStatus !== "ready") return;
    const section = sectionRef.current;
    if (!section) return;

    const update = () => {
      const scrolled = -(section.getBoundingClientRect().top);
      const progress = Math.max(0, Math.min(1, scrolled / SCROLL_HEIGHT));
      frameRef.current = Math.round(progress * (TOTAL_FRAMES - 1));
    };

    // Lenis .on("scroll") is the highest-fidelity hook into smooth scroll
    const tryLenis = () => {
      if (lenisInstance) {
        lenisInstance.on("scroll", update);
        return true;
      }
      return false;
    };

    // Lenis may not be ready yet (it's dynamically imported); poll briefly
    if (!tryLenis()) {
      const interval = setInterval(() => {
        if (tryLenis()) clearInterval(interval);
      }, 100);
      setTimeout(() => clearInterval(interval), 5000);
    }

    // Native scroll listener as a reliable fallback (zero overhead)
    window.addEventListener("scroll", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      lenisInstance?.off("scroll", update);
    };
  }, [loadStatus]);

  // ── 5. RAF render loop ────────────────────────────────────────────────────
  useEffect(() => {
    if (loadStatus !== "ready") return;

    const loop = () => {
      const target = frameRef.current;
      if (target !== lastDrawnRef.current) {
        drawFrame(target);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafRef.current);
  }, [loadStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 6. Draw frame 0 as soon as images are ready ───────────────────────────
  useEffect(() => {
    if (loadStatus === "ready") {
      const t = setTimeout(() => drawFrame(0), 60);
      return () => clearTimeout(t);
    }
  }, [loadStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 7. Render ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* Preload overlay — only shown while images are loading */}
      <AnimatePresence>
        {loadStatus === "loading" && (
          <motion.div
            key="seq-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="fixed inset-0 z-[115] flex flex-col items-center justify-center bg-jet"
          >
            <p className="eyebrow mb-6 text-primary">Preparing sequence</p>
            <div className="relative h-px w-64 bg-white/10">
              <motion.div
                className="absolute inset-y-0 left-0 bg-primary"
                animate={{ width: `${loadProgress}%` }}
                transition={{ duration: 0.08 }}
                style={{ boxShadow: "0 0 18px var(--glow-red)" }}
              />
            </div>
            <p className="mt-4 font-mono text-[10px] tracking-[0.3em] text-muted-foreground tabular-nums">
              {String(loadProgress).padStart(3, "0")}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/*
        Outer section is tall enough to absorb the full scroll travel.
        height = 100vh (for the sticky pin) + SCROLL_HEIGHT (travel distance).
        The sticky child stays fixed at top:0 for the entire duration.
      */}
      <section
        ref={sectionRef}
        id="frame-sequence"
        aria-label="Cinematic Demon sequence"
        style={{ height: `calc(100vh + ${SCROLL_HEIGHT}px)` }}
        className="relative"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">

          {/* ── Canvas: fullscreen, GPU-composited ── */}
          <canvas
            ref={canvasRef}
            aria-hidden
            className="absolute inset-0"
            style={{
              willChange: "transform",
              opacity: loadStatus === "ready" ? 1 : 0,
              transition: "opacity 0.9s ease",
            }}
          />

          {/* ── Overlays — only rendered once ready ── */}
          {loadStatus === "ready" && (
            <>
              {/* Vignette — matches site's inset shadow from film-grain utility */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ boxShadow: "inset 0 0 28vw 10vw rgba(0,0,0,0.82)" }}
              />

              {/* Top fade — blends seamlessly from Hero's bottom gradient */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-40"
                style={{ background: "linear-gradient(to bottom, var(--jet) 0%, transparent 100%)" }}
              />

              {/* Bottom fade — blends into Specs section background */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
                style={{ background: "linear-gradient(to top, var(--jet) 0%, transparent 100%)" }}
              />

              {/* Scanlines — matches site-wide CRT film texture */}
              <div
                aria-hidden
                className="scanlines pointer-events-none absolute inset-0 opacity-[0.18]"
              />

              {/* Subtle red glow at bottom centre — ember atmosphere */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[30vh]"
                style={{
                  background:
                    "radial-gradient(60% 100% at 50% 100%, color-mix(in oklab, var(--demon) 18%, transparent), transparent 70%)",
                }}
              />

              {/* Scroll hint — disappears on first scroll */}
              <ScrollHint />
            </>
          )}
        </div>
      </section>
    </>
  );
}

// ─── Scroll hint ──────────────────────────────────────────────────────────────

function ScrollHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hide = () => setVisible(false);
    const timer = setTimeout(hide, 3000);
    window.addEventListener("scroll", hide, { passive: true, once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", hide);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="scroll-hint"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="pointer-events-none absolute inset-x-0 bottom-9 flex flex-col items-center gap-3"
        >
          <motion.span
            animate={{ scaleY: [1, 0.45, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
            className="block h-10 w-px bg-gradient-to-b from-transparent via-primary to-transparent"
          />
          <span className="eyebrow text-[9px] text-primary">Scroll to reveal</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
