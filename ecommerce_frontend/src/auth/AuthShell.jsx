import { Link } from "react-router-dom";
import { motion } from "motion/react";

function Logo({ light }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="w-6 h-6 border border-accent rotate-45" />
      <span
        className={`font-display text-xl tracking-[0.2em] ${light ? "text-white" : "text-ink"}`}
      >
        AURA
      </span>
    </Link>
  );
}

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-paper">
      <div className="hidden md:flex relative flex-col justify-between bg-ink text-white p-12 overflow-hidden">
        <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full border border-accent/20" />
        <div className="absolute -right-8 -top-8 w-80 h-80 rounded-full border border-accent/10" />
        <div className="relative">
          <Logo light />
        </div>
        <div className="relative">
          <p className="text-xs tracking-[0.3em] uppercase text-accent mb-4">
            Luxury, curated
          </p>
          <p className="font-display text-4xl leading-tight max-w-sm">
            Timeless elegance, redefined.
          </p>
        </div>
        <p className="relative text-white/40 text-xs">
          © AURA. All rights reserved.
        </p>
      </div>

      <div className="flex items-center justify-center px-5 py-10 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="md:hidden mb-8">
            <Logo />
          </div>
          <h1 className="font-display text-3xl text-ink">{title}</h1>
          <p className="text-ink/60 text-sm mt-1.5">{subtitle}</p>
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 text-sm text-ink/60">{footer}</div>}
        </motion.div>
      </div>
    </div>
  );
}
