import { motion } from "motion/react";
import { SectionHeader } from "./SectionHeader";
import { useCountUp } from "./hooks";
import tunnel from "@/assets/gallery-4.jpg";

const STATS = [
  { value: 110, suffix: "+", label: "Years of Dodge heritage" },
  { value: 3300, suffix: "", label: "Demons ever built" },
  { value: 1, suffix: "", label: "Car banned by the NHRA" },
  { value: 9.65, suffix: "s", label: "Certified quarter mile", decimals: 2 },
];

function Stat({
  value,
  suffix,
  label,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}) {
  const { ref, display } = useCountUp(value, decimals);
  return (
    <div>
      <p className="display text-5xl ember-text md:text-6xl">
        <span ref={ref} className="tabular-nums">
          {display}
        </span>
        {suffix}
      </p>
      <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="relative px-6 py-28 md:px-16 md:py-40 lg:px-24">
      <SectionHeader
        index="08"
        eyebrow="About"
        title={
          <>
            Born from
            <br />
            heritage
          </>
        }
      />

      <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9 }}
            className="text-lg leading-relaxed text-smoke md:text-xl"
          >
            The Challenger SRT Demon is not a statement of speed. It is a statement of intent — a
            street-legal drag car sold with a warranty, a passenger seat you had to pay for, and a
            crate of parts the factory dared you to install.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, delay: 0.12 }}
            className="max-w-xl text-sm leading-relaxed text-muted-foreground"
          >
            Every element was tuned for a single 1,320-foot mission: the TransBrake, the Torque
            Reserve, the Power Chiller, the drag radials, the 35% stiffer launch geometry. Then
            Dodge built exactly 3,300 of them and walked away.
          </motion.p>

          <div className="grid grid-cols-2 gap-8 border-t border-white/8 pt-10">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, delay: i * 0.09 }}
              >
                <Stat {...s} />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          whileInView={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] overflow-hidden rounded-sm border border-white/8"
        >
          <img
            src={tunnel}
            alt="Challenger SRT Demon in a red-lit tunnel"
            width={1600}
            height={1008}
            loading="lazy"
            className="h-full w-full scale-110 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-jet via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6">
            <p className="eyebrow text-primary">Serial 0001 / 3300</p>
            <p className="display mt-2 text-3xl">Uncompromising</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
