import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../api/categoryApi";

export default function CategoryShowcase() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-8 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs tracking-widest uppercase text-accent mb-2">
            Curated Categories
          </p>
          <h2 className="font-display text-3xl text-ink">The Masterpieces</h2>
        </div>
        <p className="text-sm text-ink/50 max-w-xs text-right hidden sm:block">
          Each category represents an intersection of heritage artistry and
          contemporary vision.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {categories.map((cat, idx) => (
          <Link
            key={cat._id}
            to={`/shop?category=${cat.name}`}
            className="group relative aspect-[3/4] overflow-hidden bg-cream"
          >
            <img
              src={cat.img}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <p className="text-[10px] tracking-widest uppercase text-accent mb-1">
                {String(idx + 1).padStart(2, "0")} / Collection
              </p>
              <p className="text-white font-medium capitalize">{cat.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
