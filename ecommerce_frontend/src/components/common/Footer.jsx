import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-cream/60 border-t border-ink/10 mt-10">
      <div className="max-w-7xl mx-auto px-8 py-16 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <p className="font-display text-xl tracking-[0.2em] text-ink mb-3">
            AURA
          </p>
          <p className="text-sm text-ink/50 leading-relaxed">
            Curated luxury goods and exceptional lifestyle experiences for the
            discerning consumer.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-widest uppercase text-ink/40 mb-4">
            Navigation
          </p>
          <ul className="space-y-2 text-sm text-ink/60">
            <li>Shop New Arrivals</li>
            <li>Curated Collections</li>
            <li>Exclusive Wishlist</li>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-widest uppercase text-ink/40 mb-4">
            Stay Connected
          </p>
          <p className="text-sm text-ink/60 mb-3">
            Subscribe to receive private sale access and editorial updates.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border border-ink/15 bg-white px-3 py-2 text-sm focus:outline-none"
            />
            <button className="bg-ink text-white text-xs uppercase px-4 py-2">
              Join
            </button>
          </div>
        </div>
        <div>
          <p className="text-xs tracking-widest uppercase text-ink/40 mb-4">
            Secure Payments
          </p>
          <div className="flex gap-2 flex-wrap">
            {["VISA", "MC", "AMEX", "PAYPAL"].map((p) => (
              <span
                key={p}
                className="border border-ink/15 text-[10px] text-ink/50 px-2 py-1"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-ink/10 py-4 text-center text-xs text-ink/40">
        © 2026 AURA Inc. All rights reserved.
      </div>
    </footer>
  );
}
