import { motion } from "motion/react";

const values = [
  "Sourced from rare artisans.",
  "Designed for uncompromising aesthetics.",
  "Built to last generations.",
];

export default function ManifestoStrip() {
  return (
    <section className="bg-ink border-y border-white/10">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-20 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-accent mb-8">
          The AURA Ethos
        </p>
        <div className="space-y-5">
          {values.map((line, i) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="font-display text-2xl sm:text-4xl text-white/90 leading-snug"
            >
              {line}
            </motion.p>
          ))}
        </div>
        <div className="w-16 h-px bg-accent mx-auto mt-10" />
      </div>
    </section>
  );
}
