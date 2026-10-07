import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getBanners } from "../../api/bannerApi";
import ScrollReveal from "../animations/ScrollReveal";

export default function EditorialSection() {
  const [story, setStory] = useState(null);

  useEffect(() => {
    getBanners("editorial")
      .then((res) => setStory(res.data[0] || null))
      .catch(() => {});
  }, []);

  if (!story) return null;

  return (
    <ScrollReveal>
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-0 bg-cream/40 rounded-2xl overflow-hidden">
          <div
            className="aspect-[4/5] md:aspect-auto bg-cover"
            style={{
              backgroundImage: `url('${story.image}')`,
              backgroundPosition: story.objectPosition || "center",
            }}
          />
          <div className="p-8 sm:p-12 flex flex-col justify-center">
            <p className="text-xs tracking-widest uppercase text-accent mb-3">
              The Curated Edit
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight mb-5">
              {story.storyTitle || story.title}
            </h2>
            <p className="text-ink/60 leading-relaxed mb-8 whitespace-pre-line">
              {story.storyText}
            </p>
            {story.link && (
              <Link
                to={story.link}
                className="inline-flex items-center gap-2 text-sm font-medium text-ink group w-fit"
              >
                Discover the edit
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            )}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
