import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Menu, Volume2, VolumeX, X } from "lucide-react";

const LINKS = [
  { id: "hero", label: "Home" },
  { id: "specs", label: "Experience" },
  { id: "performance", label: "Performance" },
  { id: "gallery", label: "Gallery" },
  { id: "engineering", label: "Technology" },
  { id: "timeline", label: "Timeline" },
  { id: "configurator", label: "Configurator" },
  { id: "about", label: "About" },
];

/** Web Audio engine ambience — synthesised, no external files. */
function useEngineAudio() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!on) {
      gainRef.current?.gain.setTargetAtTime(0, ctxRef.current?.currentTime ?? 0, 0.3);
      return;
    }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = ctxRef.current ?? new AC();
    ctxRef.current = ctx;
    void ctx.resume();

    if (!gainRef.current) {
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      gainRef.current = master;

      // Low rumble + harmonics = idling V8.
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 220;
      filter.Q.value = 6;
      filter.connect(master);

      [42, 63, 126].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = i === 2 ? "square" : "sawtooth";
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.value = i === 0 ? 0.5 : 0.14;
        osc.connect(g).connect(filter);
        osc.start();

        // Lopey idle modulation.
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 7.5 + i;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 3 + i * 2;
        lfo.connect(lfoGain).connect(osc.frequency);
        lfo.start();
      });

      // Noise bed for exhaust texture.
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.35;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      const nf = ctx.createBiquadFilter();
      nf.type = "bandpass";
      nf.frequency.value = 140;
      const ng = ctx.createGain();
      ng.gain.value = 0.16;
      noise.connect(nf).connect(ng).connect(master);
      noise.start();
    }
    gainRef.current.gain.setTargetAtTime(0.09, ctx.currentTime, 0.8);
  }, [on]);

  return { on, toggle: () => setOn((v) => !v) };
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("hero");
  const audio = useEngineAudio();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-[60]"
    >
      <div
        className={`flex items-center justify-between px-5 transition-all duration-500 md:px-10 ${
          scrolled
            ? "border-b border-white/5 bg-jet/70 py-3 backdrop-blur-xl"
            : "border-b border-transparent py-6"
        }`}
      >
        <button
          onClick={() => go("hero")}
          data-cursor="top"
          className="display text-xl tracking-[0.08em] md:text-2xl"
        >
          SRT<span className="text-primary glow-text">DEMON</span>
        </button>

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              data-cursor="true"
              className={`relative font-mono text-[10px] tracking-[0.24em] uppercase transition-colors duration-300 ${
                active === l.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
              {active === l.id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-2 left-0 h-px w-full bg-primary"
                  style={{ boxShadow: "0 0 12px var(--glow-red)" }}
                />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={audio.toggle}
            data-cursor={audio.on ? "mute" : "sound"}
            aria-label="Toggle engine audio"
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-colors duration-300 hover:border-primary/70 hover:bg-primary/10"
          >
            {audio.on ? (
              <Volume2 className="h-4 w-4 text-primary" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
            )}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel flex flex-col gap-1 px-5 py-4 lg:hidden"
        >
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="display py-2 text-left text-2xl text-smoke"
            >
              {l.label}
            </button>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
}
