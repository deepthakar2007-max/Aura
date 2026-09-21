export default function Philosophy() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <p className="text-xs tracking-widest uppercase text-accent mb-2">
          The AURA Philosophy
        </p>
        <h2 className="font-display text-3xl text-ink leading-tight">
          Artisanal Mastery Meets Uncompromising Vision
        </h2>
        <p className="text-ink/60 text-sm mt-4 max-w-md leading-relaxed">
          We partner exclusively with multi-generational ateliers and visionary
          modern designers who treat objects as cultural artifacts. Every piece
          in our portfolio undergoes rigorous curation to ensure absolute
          permanence of style.
        </p>
        <div className="flex gap-10 mt-8">
          <div>
            <p className="font-display text-2xl text-ink">100%</p>
            <p className="text-xs text-ink/50 mt-1">
              Verified Ethical Sourcing
            </p>
          </div>
          <div>
            <p className="font-display text-2xl text-ink">50+</p>
            <p className="text-xs text-ink/50 mt-1">Global Master Ateliers</p>
          </div>
        </div>
      </div>
      <img
        src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80"
        alt="Craftsmanship"
        className="w-full aspect-[4/3] object-cover"
      />
    </section>
  );
}
