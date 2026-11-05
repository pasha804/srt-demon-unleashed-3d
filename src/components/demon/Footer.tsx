import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { MagneticButton } from "./Hero";
import drive from "@/assets/footer-drive.jpg";

const NAV = ["Home", "Performance", "Technology", "Gallery", "Specs"];
const INFO = ["Timeline", "Configurator", "About", "Contact", "Privacy Policy"];
const SOCIALS = [Facebook, Instagram, Youtube, Twitter];

export function Footer() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [-60, 40]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.25, 1.05]);

  return (
    <footer ref={ref} className="relative overflow-hidden">
      <div className="relative flex min-h-[78vh] items-center justify-center overflow-hidden">
        <motion.img
          src={drive}
          alt="Challenger SRT Demon driving away toward a city skyline at night"
          width={1920}
          height={912}
          loading="lazy"
          style={{ y: imgY, scale: imgScale }}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-jet via-jet/40 to-jet" />

        <div className="relative z-10 flex flex-col items-center gap-7 px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50, letterSpacing: "0.2em" }}
            whileInView={{ opacity: 1, y: 0, letterSpacing: "-0.01em" }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="display glow-text text-[clamp(2.5rem,10vw,9rem)] ember-text"
          >
            Power Beyond Limits
          </motion.h2>
          <p className="eyebrow">Experience American muscle</p>
          <MagneticButton
            onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}
          >
            Join The Legend
          </MagneticButton>
        </div>
      </div>

      <div className="relative z-10 grid gap-10 border-t border-white/8 px-6 py-14 md:grid-cols-4 md:px-16 lg:px-24">
        <div>
          <p className="display text-2xl">
            SRT<span className="text-primary">DEMON</span>
          </p>
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-muted-foreground">
            An independent cinematic tribute to the Dodge Challenger SRT Demon. Not affiliated with
            Stellantis.
          </p>
        </div>

        <FooterList title="Navigation" items={NAV} />
        <FooterList title="Information" items={INFO} />

        <div>
          <p className="eyebrow mb-4">Follow Us</p>
          <div className="flex gap-3">
            {SOCIALS.map((Icon, i) => (
              <a
                key={i}
                href="#hero"
                data-cursor="true"
                aria-label="Social link"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:border-primary hover:bg-primary/15 hover:shadow-[0_0_28px_-8px_var(--glow-red)]"
              >
                <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/5 px-6 py-6 text-center font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase md:px-16">
        © {new Date().getFullYear()} SRT Demon Experience — All rights reserved
      </div>
    </footer>
  );
}

function FooterList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="eyebrow mb-4">{title}</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item}>
            <a
              href="#hero"
              data-cursor="true"
              className="text-xs text-muted-foreground transition-colors duration-300 hover:text-primary"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
