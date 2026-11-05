import { motion } from "motion/react";

export function SectionHeader({
  index,
  eyebrow,
  title,
  copy,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  copy?: string;
}) {
  return (
    <div className="mb-14 flex flex-col gap-5 md:mb-20">
      <div className="flex items-center gap-4">
        <span className="font-mono text-[11px] tracking-[0.3em] text-primary">{index}</span>
        <span className="h-px w-12 bg-primary/60" />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 40, clipPath: "inset(0 0 100% 0)" }}
        whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="display max-w-4xl text-[clamp(2.4rem,7vw,6rem)]"
      >
        {title}
      </motion.h2>
      {copy && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="max-w-xl text-sm leading-relaxed text-muted-foreground"
        >
          {copy}
        </motion.p>
      )}
    </div>
  );
}
