import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowDown, ChevronRight } from "lucide-react";
import heroCar from "@/assets/hero-demon.jpg";

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const carY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 220]), {
    stiffness: 80,
    damping: 24,
  });
  const carScale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 1.22]), {
    stiffness: 80,
    damping: 24,
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      setPointer({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const word = (text: string, delay: number) => (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: "110%", rotate: 4 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ delay, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {text}
      </motion.span>
    </span>
  );

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-svh items-center overflow-hidden"
    >
      {/* Car plate with mouse parallax + idle engine vibration */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: carY, scale: carScale }}
        aria-hidden
      >
        <div
          className="idle-shake h-full w-full"
          style={{
            transform: `translate3d(${pointer.x * -18}px, ${pointer.y * -12}px, 0)`,
            transition: "transform 500ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="breathe h-full w-full">
            <img
              src={heroCar}
              alt="Dodge Challenger SRT Demon in fog with glowing red headlights"
              width={1920}
              height={1088}
              className="h-full w-full scale-110 object-cover object-center opacity-90"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_55%,transparent,rgba(5,5,5,0.75)_75%,#0a0a0a_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-jet to-transparent" />
        {/* Headlight bloom */}
        <div className="pointer-events-none absolute top-[58%] left-[38%] h-40 w-64 -translate-x-1/2 rounded-full bg-glow/30 blur-[70px] pulse-glow" />
      </motion.div>

      {/* Left rail */}
      <div className="absolute top-1/2 left-5 z-10 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex">
        <span className="font-mono text-[10px] tracking-[0.3em] text-foreground">01</span>
        <span className="h-24 w-px bg-gradient-to-b from-primary to-transparent" />
        <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">09</span>
      </div>

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 w-full px-6 pt-28 md:px-16 lg:px-24"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.8em" }}
          animate={{ opacity: 1, letterSpacing: "0.42em" }}
          transition={{ delay: 0.3, duration: 1.4 }}
          className="eyebrow mb-5 text-smoke"
        >
          Dodge Challenger
        </motion.p>

        <h1 className="display text-[clamp(4rem,17vw,15rem)] tracking-[-0.03em]">
          {word("SRT", 0.45)}
          {word("Demon", 0.6)}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 1 }}
          className="mt-6 max-w-md text-sm leading-relaxed tracking-[0.18em] text-muted-foreground uppercase"
        >
          Unleash pure American muscle — 808 horsepower, factory built for the drag strip.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 1 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticButton
            onClick={() =>
              document.getElementById("specs")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore The Beast
          </MagneticButton>
          <div className="flex items-center gap-6 font-mono text-[10px] tracking-[0.24em] text-muted-foreground uppercase">
            <span>
              <span className="text-foreground">808</span> HP
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span>
              <span className="text-foreground">2.3</span>s 0–60
            </span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity: fade }}
        className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/50"
        >
          <ArrowDown className="h-3.5 w-3.5 text-primary" />
        </motion.div>
        <span className="eyebrow text-[9px]">Scroll to experience</span>
      </motion.div>
    </section>
  );
}

export function MagneticButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement | null>(null);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      data-cursor="go"
      className="group relative overflow-hidden rounded-full border border-primary/60 bg-primary/5 px-8 py-4 font-mono text-[11px] tracking-[0.28em] uppercase transition-[border-color,background-color,box-shadow,transform] duration-500 ease-out hover:border-primary hover:bg-primary/15 hover:shadow-[0_0_50px_-8px_var(--glow-red)]"
    >
      <span className="relative z-10 flex items-center gap-3">
        {children}
        <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
      <span className="absolute inset-y-0 -left-1/4 w-1/3 bg-white/15 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100 group-hover:[animation:sweep_1.1s_ease-out]" />
    </button>
  );
}
