import { useEffect, useRef, useState } from "react";

/** Global Lenis instance reference — set once scroll is initialised. */
export let lenisInstance: { raf: (t: number) => void; destroy: () => void; on: (event: string, cb: (e: { scroll: number }) => void) => void; off: (event: string, cb: (e: { scroll: number }) => void) => void } | null = null;

/** Lenis smooth scroll, initialised once on the client. */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let lenis: typeof lenisInstance = null;
    let cancelled = false;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const instance = new Lenis({ duration: 1.25, smoothWheel: true, lerp: 0.09 });
      lenis = instance as typeof lenisInstance;
      lenisInstance = lenis;
      const loop = (time: number) => {
        instance.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenisInstance = null;
    };
  }, [enabled]);
}

/** Counts to a target the first time the element scrolls into view. */
export function useCountUp(target: number, decimals = 0, duration = 1800) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(target * eased);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return { ref, display: value.toFixed(decimals) };
}

/** True once the component has hydrated — guards browser-only rendering. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
