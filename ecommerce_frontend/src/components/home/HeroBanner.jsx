import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export default function HeroBanner() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <section
      ref={ref}
      className="relative h-[500px] sm:h-[600px] overflow-hidden flex items-end"
    >
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 bg-cover bg-center"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(20,17,15,0.8), rgba(20,17,15,0.15)), url('https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=80')",
          }}
        />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pb-12 sm:pb-16 w-full">
        <div className="max-w-lg">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block bg-accent/90 text-ink text-[10px] tracking-widest uppercase px-3 py-1 rounded-full mb-4"
          >
            New Autumn/Winter Collection
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display text-3xl sm:text-5xl text-white leading-tight"
          >
            Timeless Elegance, Modern Luxury
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white/80 mt-4 text-sm leading-relaxed max-w-md"
          >
            Discover exceptional craftsmanship, rare materials, and
            uncompromising design curated for the world's most discerning
            collectors.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-3 mt-8"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/shop"
                className="block bg-white text-ink text-xs tracking-widest uppercase px-6 py-3.5 hover:bg-cream transition-colors"
              >
                Explore Collection
              </Link>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="border border-white text-white text-xs tracking-widest uppercase px-6 py-3.5 hover:bg-white/10 transition-colors"
            >
              Private Viewings
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
