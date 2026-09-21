export default function AnnouncementBar() {
  return (
    <div className="bg-ink text-paper text-xs py-2.5 px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <p className="flex items-center gap-2">
          <span className="text-accent">✦</span>
          Complimentary global white-glove shipping & bespoke packaging on all
          orders over $1,000.
        </p>
        <p className="hidden sm:block text-paper/70">
          Private Concierge: +1 (800) 555-AURA
        </p>
      </div>
    </div>
  );
}
