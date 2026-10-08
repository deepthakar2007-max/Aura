import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getBanners } from "../../api/bannerApi";

const FALLBACK = [
  {
    _id: "fallback",
    title: "Timeless Elegance, Redefined",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=80",
    objectPosition: "center",
    link: "/shop",
    duration: 6,
    storyText: "",
  },
];

const DEFAULT_TEXT =
  "Discover exceptional craftsmanship, rare materials, and uncompromising design curated for the world's most discerning collectors.";

export default function HeroBanner() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const [slides, setSlides] = useState(FALLBACK);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    getBanners("hero")
      .then((res) => {
        if (res.data.length) {
          setSlides(res.data);
          setIndex(0);
        }
      })
      .catch(() => {});
  }, []);

  const slide = slides[index] || slides[0];
  const seconds = Math.max(2, slide.duration || 6);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % slides.length),
    [slides.length],
  );
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const timer = setTimeout(next, seconds * 1000);
    return () => clearTimeout(timer);
  }, [index, paused, slides.length, seconds, next]);

  const isExternal = (url) => /^https?:\/\//i.test(url);
  const target = slide.link || "/shop";

  return (
    <section
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative h-[550px] sm:h-[650px] overflow-hidden flex items-end bg-ink"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <AnimatePresence>
          <motion.div
            key={slide._id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-cover"
              initial={{ scale: 1 }}
              animate={{ scale: 1.12 }}
              transition={{ duration: seconds + 1.5, ease: "linear" }}
              style={{
                backgroundImage: `url('${slide.image}')`,
                backgroundPosition: slide.objectPosition || "center",
              }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pb-16 sm:pb-20 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg"
          >
            <span className="inline-block bg-accent/90 text-ink text-[10px] tracking-widest uppercase px-3 py-1 rounded-full mb-4">
              New Autumn/Winter Collection
            </span>
            <h1 className="font-display text-3xl sm:text-5xl text-white leading-tight">
              {slide.title}
            </h1>
            <p className="text-white/80 mt-4 text-sm leading-relaxed max-w-md">
              {slide.storyText || DEFAULT_TEXT}
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              {isExternal(target) ? (
                <a
                  href={target}
                  className="flex items-center gap-2 bg-white text-ink text-xs tracking-widest uppercase px-6 py-3.5 hover:bg-cream transition-colors"
                >
                  Explore Collection <ArrowRight size={14} />
                </a>
              ) : (
                <Link
                  to={target}
                  className="flex items-center gap-2 bg-white text-ink text-xs tracking-widest uppercase px-6 py-3.5 hover:bg-cream transition-colors"
                >
                  Explore Collection <ArrowRight size={14} />
                </Link>
              )}
              <button className="bg-white/10 backdrop-blur-md border border-white/40 text-white text-xs tracking-widest uppercase px-6 py-3.5 hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                View The Lookbook
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {slides.length > 1 && (
        <>
          <div className="absolute bottom-5 left-5 sm:left-8 flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s._id}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="relative h-[3px] w-8 sm:w-12 bg-white/30 overflow-hidden rounded-full"
              >
                {i === index && (
                  <motion.div
                    key={`${index}-${paused}`}
                    className="absolute inset-y-0 left-0 bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: paused ? "0%" : "100%" }}
                    transition={{
                      duration: paused ? 0 : seconds,
                      ease: "linear",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="absolute bottom-4 right-5 sm:right-8 hidden sm:flex items-center gap-3 text-white">
            <span className="text-xs tracking-widest text-white/70">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </span>
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/15 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/15 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
