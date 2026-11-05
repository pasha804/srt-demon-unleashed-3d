import { useEffect, useRef, useState } from "react";

/** Magnetic glowing cursor with a lagging trail ring. */
export function Cursor() {
  const dot = useRef<HTMLDivElement | null>(null);
  const ring = useRef<HTMLDivElement | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...target };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      setVisible(true);
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      if (el) {
        setActive(true);
        setLabel(el.dataset["cursor"] && el.dataset["cursor"] !== "true" ? el.dataset["cursor"]! : null);
      } else {
        setActive(false);
        setLabel(null);
      }
    };

    const loop = () => {
      ringPos.x += (target.x - ringPos.x) * 0.16;
      ringPos.y += (target.y - ringPos.y) * 0.16;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] hidden md:block"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden
    >
      <div
        ref={ring}
        className="absolute top-0 left-0 flex items-center justify-center rounded-full border border-primary/70 transition-[width,height,background-color,border-color] duration-300 ease-out"
        style={{
          width: active ? 76 : 34,
          height: active ? 76 : 34,
          backgroundColor: active ? "color-mix(in oklab, var(--demon) 16%, transparent)" : "transparent",
          boxShadow: "0 0 30px color-mix(in oklab, var(--glow-red) 45%, transparent)",
          backdropFilter: active ? "blur(2px)" : undefined,
        }}
      >
        {label ? (
          <span className="font-mono text-[8px] tracking-[0.25em] text-foreground uppercase">
            {label}
          </span>
        ) : null}
      </div>
      <div
        ref={dot}
        className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-primary"
        style={{ boxShadow: "0 0 16px var(--glow-red)" }}
      />
    </div>
  );
}
