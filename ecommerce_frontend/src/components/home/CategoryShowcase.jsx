import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { getCategories } from "../../api/categoryApi";
import StaggerContainer, {
  staggerItemVariants,
} from "../animations/StaggerContainer";

export default function CategoryShowcase() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  return (
    <section className="bg-ink py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-widest uppercase text-accent mb-2">
              Curated Categories
            </p>
            <h2 className="font-display text-3xl text-white">
              The Masterpieces
            </h2>
          </div>
          <p className="text-sm text-white/40 max-w-xs text-right hidden sm:block">
            Each category represents an intersection of heritage artistry and
            contemporary vision.
          </p>
        </div>

        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <motion.div key={cat._id} variants={staggerItemVariants}>
              <Link
                to={`/shop?category=${cat.name}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl block"
              >
                <motion.img
                  src={cat.img}
                  alt={cat.name}
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2.5">
                    <p className="text-[10px] tracking-widest uppercase text-accent mb-0.5">
                      {String(idx + 1).padStart(2, "0")} / Collection
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-white font-medium capitalize truncate">
                        {cat.name}
                      </p>
                      <ArrowUpRight
                        size={16}
                        className="text-white/70 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      />
                    </div>
                    {cat.tagline && (
                      <p className="text-[11px] text-white/60 mt-1 truncate">
                        {cat.tagline}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
