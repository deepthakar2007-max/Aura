import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { getBanners } from "../../api/bannerApi";
import ScrollReveal from "../animations/ScrollReveal";

function Card({ banner }) {
  const content = (
    <div className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-cream">
      <img
        src={banner.image}
        alt={banner.title}
        style={{ objectPosition: banner.objectPosition || "center" }}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-3">
        <p className="font-display text-xl text-white leading-snug">
          {banner.title}
        </p>
        <span className="w-9 h-9 rounded-full bg-white/15 backdrop-blur border border-white/30 flex items-center justify-center text-white flex-shrink-0 group-hover:bg-white group-hover:text-ink transition-colors">
          <ArrowUpRight size={16} />
        </span>
      </div>
    </div>
  );

  if (!banner.link) return content;
  if (/^https?:\/\//i.test(banner.link))
    return <a href={banner.link}>{content}</a>;
  return <Link to={banner.link}>{content}</Link>;
}

export default function FeaturedBanners() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    getBanners("featured")
      .then((res) => setBanners(res.data.slice(0, 3)))
      .catch(() => {});
  }, []);

  if (!banners.length) return null;

  return (
    <ScrollReveal>
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <p className="text-xs tracking-widest uppercase text-accent mb-2">
          Featured
        </p>
        <h2 className="font-display text-3xl text-ink mb-10">
          Spotlight Collections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {banners.map((b) => (
            <Card key={b._id} banner={b} />
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
