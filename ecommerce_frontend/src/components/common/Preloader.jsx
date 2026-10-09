/**
 * Preloader.jsx  ·  Aura
 * Path: ecommerce_frontend/src/components/common/Preloader.jsx
 *
 * Self-contained: only React is needed. All CSS lives inside this file, so no
 * page, component or stylesheet in the project has to change.
 *
 * Exports
 *   default  Preloader          Full-screen intro shown while the site loads.
 *   named    PreloaderFallback  Same look, lighter. Use it as a
 *                               <Suspense fallback={...}> or in place of any
 *                               plain "Loading..." text.
 *
 * Preloader props (all optional)
 *   ready        boolean   Hold the intro until this is true (e.g. !authLoading). Default true.
 *   minDuration  number    Minimum time on screen in ms. Default 2000.
 *   tagline      string    Small line under the horizon. Pass "" to hide it.
 *   onComplete   function  Called once the screen has fully opened.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* ───────────────────────────── CONFIG ───────────────────────────── */

// Change the brand colours here (6-digit hex only).
const THEME = {
  bg: "#0f0c1d", // midnight ink
  fg: "#f4efe9", // pearl: wordmark and numerals
  core: "#ffc79b", // warm centre of the aura
  mid: "#f58fb4", // rose
  cool: "#7a6cf5", // violet outer glow
};

const FONT_SANS =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const FONT_SERIF =
  '"Cormorant Garamond", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif';

const MIN_DURATION = 2000; // ms the intro stays up at the very least
const MAX_WAIT = 10000; // ms after which it opens no matter what
const FINISH_MS = 500; // final sprint to 100%
const HOLD_MS = 300; // pause on 100% before opening
const PANEL_DELAY_MS = 140;
const PANEL_MS = 1000;
const EXIT_MS = PANEL_DELAY_MS + PANEL_MS + 20;

/* ───────────────────────────── LOGO ───────────────────────────── */

// "AURA" as single-weight line art. Each glyph is drawn on a 100-unit cap height.
const GLYPHS = [
  { x: 0, paths: ["M0 100L38 0L76 100", "M12.2 68H63.8"] }, // A
  { x: 100, paths: ["M0 0V68A32 32 0 0 0 64 68V0"] }, // U
  { x: 196, paths: ["M0 100V0H34A25 25 0 0 1 34 50H0", "M31 50L62 100"] }, // R
  { x: 282, paths: ["M0 100L38 0L76 100", "M12.2 68H63.8"] }, // A
];

const AuraLogo = () => {
  let step = 0;
  return (
    <svg
      className="aura-pl__logo"
      viewBox="-8 -8 374 116"
      role="img"
      aria-label="Aura"
      focusable="false"
    >
      <defs>
        {/* userSpaceOnUse so the flat crossbars (zero-height bbox) still get the gradient */}
        <linearGradient
          id="aura-pl-stroke"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="0"
          y2="100"
        >
          <stop offset="0" stopColor={THEME.fg} />
          <stop offset="1" stopColor={THEME.core} />
        </linearGradient>
      </defs>
      {GLYPHS.map((glyph) => (
        <g key={glyph.x} transform={`translate(${glyph.x} 0)`}>
          {glyph.paths.map((d) => (
            <path key={d} d={d} pathLength="1" style={{ "--i": step++ }} />
          ))}
        </g>
      ))}
    </svg>
  );
};

/* Top and bottom halves of the screen. Each carries half of the glow, so the
   aura splits open together with the curtain. */
const Panel = ({ side }) => (
  <div className={`aura-pl__panel aura-pl__panel--${side}`}>
    <span className="aura-pl__glow">
      <span className="aura-pl__halo aura-pl__halo--wide" />
      <span className="aura-pl__halo aura-pl__halo--core" />
    </span>
  </div>
);

/* ───────────────────────────── STYLES ───────────────────────────── */

const rgb = (hex) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const CSS = `
.aura-pl{
  --pl-bg:${THEME.bg};
  --pl-fg:${rgb(THEME.fg)};
  --pl-core:${rgb(THEME.core)};
  --pl-mid:${rgb(THEME.mid)};
  --pl-cool:${rgb(THEME.cool)};
  --pl-p:0;
  --pl-glow:min(120vmax,1100px);
  --pl-ease:cubic-bezier(.76,0,.24,1);
  --pl-out:cubic-bezier(.16,1,.3,1);
  position:fixed;top:0;left:0;right:0;bottom:0;z-index:999999;
  overflow:hidden;color:rgb(var(--pl-fg));font-family:${FONT_SANS};
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
  touch-action:none;overscroll-behavior:contain;user-select:none;-webkit-user-select:none;
}
.aura-pl.is-exit{pointer-events:none}

/* curtain */
.aura-pl__panel{
  position:absolute;left:0;right:0;height:calc(50% + 1px);overflow:hidden;
  background:var(--pl-bg);will-change:transform;
  transition:transform ${PANEL_MS}ms var(--pl-ease) ${PANEL_DELAY_MS}ms;
}
.aura-pl__panel--top{top:0}
.aura-pl__panel--bottom{bottom:0}
.aura-pl__panel::before{
  content:"";position:absolute;top:0;left:0;right:0;bottom:0;
  opacity:.07;pointer-events:none;background-image:${GRAIN};
}
.aura-pl.is-exit .aura-pl__panel--top{transform:translateY(-101%)}
.aura-pl.is-exit .aura-pl__panel--bottom{transform:translateY(101%)}

/* the aura: a glow centred on the horizon, growing with progress */
.aura-pl__glow{
  position:absolute;left:50%;width:var(--pl-glow);height:var(--pl-glow);
  pointer-events:none;will-change:transform,opacity;
  opacity:calc(.1 + var(--pl-p) * .9);
}
.aura-pl__panel--top .aura-pl__glow{bottom:0;transform:translate(-50%,50%) scale(calc(.5 + var(--pl-p) * .5))}
.aura-pl__panel--bottom .aura-pl__glow{top:0;transform:translate(-50%,-50%) scale(calc(.5 + var(--pl-p) * .5))}
.aura-pl__halo{position:absolute;border-radius:50%}
.aura-pl__halo--wide{
  top:0;left:0;right:0;bottom:0;
  background:radial-gradient(closest-side,
    rgb(var(--pl-cool)/.36) 0%,rgb(var(--pl-cool)/.25) 20%,rgb(var(--pl-cool)/.13) 45%,
    rgb(var(--pl-cool)/.05) 72%,rgb(var(--pl-cool)/0) 100%);
  animation:aura-pl-breathe 7s ease-in-out infinite;
}
.aura-pl__halo--core{
  top:18%;left:18%;right:18%;bottom:18%;
  background:radial-gradient(closest-side,
    rgb(var(--pl-core)/.6) 0%,rgb(var(--pl-core)/.42) 14%,rgb(var(--pl-mid)/.27) 32%,
    rgb(var(--pl-mid)/.14) 52%,rgb(var(--pl-mid)/.05) 74%,rgb(var(--pl-mid)/0) 100%);
  animation:aura-pl-breathe 5s ease-in-out -2s infinite;
}
@keyframes aura-pl-breathe{0%,100%{transform:scale(.92);opacity:.75}50%{transform:scale(1.06);opacity:1}}

/* everything that sits on top of the curtain */
.aura-pl__stage{
  position:absolute;top:0;left:0;right:0;bottom:0;
  transition:opacity .5s ease,transform 1.1s var(--pl-ease);
}
.aura-pl.is-exit .aura-pl__stage{opacity:0;transform:scale(1.05)}

.aura-pl__brand{
  position:absolute;left:0;right:0;bottom:calc(50% + clamp(20px,4.4vh,42px));
  display:flex;justify-content:center;
}
.aura-pl__logo{
  display:block;width:min(70vw,460px);height:auto;overflow:visible;
  filter:drop-shadow(0 0 18px rgb(var(--pl-mid)/.32));
  transition:filter .6s ease;
}
.aura-pl.is-done .aura-pl__logo{filter:drop-shadow(0 0 30px rgb(var(--pl-core)/.65))}
.aura-pl__logo path{
  fill:none;stroke:url(#aura-pl-stroke);stroke-width:2.1;
  stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:6;
  stroke-dasharray:1 2;stroke-dashoffset:1;
  animation:aura-pl-draw .9s var(--pl-out) forwards;
  animation-delay:calc(.3s + var(--i) * .12s);
}
@keyframes aura-pl-draw{to{stroke-dashoffset:0}}

/* horizon = progress bar, grows from the centre */
.aura-pl__line{position:absolute;left:0;right:0;top:50%;height:1px;margin-top:-.5px}
.aura-pl__line i{
  display:block;height:100%;transform-origin:50% 50%;
  transform:scaleX(var(--pl-p));will-change:transform;
  background:linear-gradient(90deg,transparent,rgb(var(--pl-cool)/.9) 14%,rgb(var(--pl-mid)) 36%,rgb(var(--pl-fg)) 50%,rgb(var(--pl-mid)) 64%,rgb(var(--pl-cool)/.9) 86%,transparent);
  box-shadow:0 0 16px rgb(var(--pl-mid)/.5);
}
.aura-pl.is-done .aura-pl__line i{animation:aura-pl-flash .7s ease-out}
@keyframes aura-pl-flash{0%{filter:brightness(1)}35%{filter:brightness(2.4)}100%{filter:brightness(1)}}

.aura-pl__tagline{
  position:absolute;left:0;right:0;top:calc(50% + clamp(20px,4vh,38px));margin:0;text-align:center;
  font-family:${FONT_SERIF};font-style:italic;font-weight:400;
  font-size:clamp(1rem,2.4vw,1.25rem);letter-spacing:.02em;
  color:rgb(var(--pl-fg)/.72);
  opacity:0;animation:aura-pl-unblur 1s ease 1.15s forwards;
}
@keyframes aura-pl-unblur{from{opacity:0;filter:blur(6px)}to{opacity:1;filter:blur(0)}}

.aura-pl__counter{
  position:absolute;right:clamp(20px,4vw,56px);
  bottom:calc(clamp(18px,4vh,44px) + env(safe-area-inset-bottom,0px));
  display:flex;align-items:flex-start;gap:.3em;line-height:1;
  font-size:clamp(2.6rem,8vw,5.5rem);font-weight:200;letter-spacing:-.03em;
  font-variant-numeric:tabular-nums;color:rgb(var(--pl-fg)/.92);
  opacity:0;animation:aura-pl-fade .8s ease .5s forwards;
}
.aura-pl__counter small{
  margin-top:.85em;font-size:.2em;font-weight:400;letter-spacing:.1em;color:rgb(var(--pl-mid));
}
@keyframes aura-pl-fade{from{opacity:0}to{opacity:1}}

/* lighter variant for Suspense / inline loading states */
.aura-pl--fallback{--pl-p:.7;z-index:999990;opacity:0;animation:aura-pl-fade .45s ease .25s forwards}
.aura-pl__line--sweep{background:rgb(var(--pl-fg)/.1)}
.aura-pl__line--sweep i{
  width:34%;transform:translateX(-100%);
  animation:aura-pl-sweep 1.5s var(--pl-ease) infinite;
}
@keyframes aura-pl-sweep{to{transform:translateX(294%)}}

@media (prefers-reduced-motion:reduce){
  .aura-pl__panel{transition:opacity .45s ease}
  .aura-pl.is-exit .aura-pl__panel--top,
  .aura-pl.is-exit .aura-pl__panel--bottom{transform:none;opacity:0}
  .aura-pl.is-exit .aura-pl__stage{transform:none}
  .aura-pl__halo{animation:none}
  .aura-pl__logo path{animation-duration:.01ms;animation-delay:0s}
  .aura-pl__tagline,.aura-pl__counter{animation-duration:.01ms;animation-delay:0s}
  .aura-pl__line--sweep i{animation:none;width:100%;transform:none}
}
`;

/* ───────────────────────────── COMPONENT ───────────────────────────── */

export default function Preloader({
  onComplete,
  ready = true,
  minDuration = MIN_DURATION,
  tagline = "Curated for you",
}) {
  const [phase, setPhase] = useState("loading"); // loading → done → exit → gone
  const rootRef = useRef(null);
  const counterRef = useRef(null);
  const readyRef = useRef(ready);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Lock page scroll until the curtain starts to open.
  const locked = phase === "loading" || phase === "done";
  useLayoutEffect(() => {
    if (!locked) return undefined;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, [locked]);

  // Timeline: progress → 100% → hold → open → unmount.
  useEffect(() => {
    const root = rootRef.current;
    const counter = counterRef.current;
    if (!root || !counter) return undefined;

    const reduce = !!(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    const minMs = reduce ? 600 : minDuration;
    const timers = [];
    const t0 = performance.now();

    let raf = 0;
    let alive = true;
    let pageReady = false;
    let finishing = false;
    let shown = 0;
    let from = 0;
    let finishAt = 0;

    const paint = (value) => {
      shown = value;
      root.style.setProperty("--pl-p", (value / 100).toFixed(4));
      counter.textContent = String(Math.round(value)).padStart(3, "0");
    };
    paint(0);

    // Real signals: window "load" + web fonts, on top of the minimum duration.
    const markReady = () => {
      pageReady = true;
    };
    const loaded = new Promise((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", resolve, { once: true });
    });
    Promise.all([loaded, document.fonts && document.fonts.ready]).then(
      markReady,
      markReady,
    );

    const finish = () => {
      const hold = reduce ? 120 : HOLD_MS;
      const exit = reduce ? 480 : EXIT_MS;
      setPhase("done");
      timers.push(setTimeout(() => setPhase("exit"), hold));
      timers.push(
        setTimeout(() => {
          setPhase("gone");
          if (onCompleteRef.current) onCompleteRef.current();
        }, hold + exit),
      );
    };

    const tick = (now) => {
      if (!alive) return;
      const elapsed = Math.max(now - t0, 0);

      if (!finishing) {
        // Eases towards ~88%, then creeps towards 97% while we wait for the page.
        const k = Math.min(elapsed / minMs, 1);
        let target = 88 * (1 - (1 - k) ** 2);
        if (elapsed > minMs)
          target += 9 * (1 - Math.exp(-(elapsed - minMs) / 2500));
        paint(Math.max(shown, target));

        const canFinish =
          (pageReady && readyRef.current) || elapsed >= MAX_WAIT;
        if (elapsed >= minMs && canFinish) {
          finishing = true;
          from = shown;
          finishAt = now;
        }
      } else {
        const k = Math.min((now - finishAt) / FINISH_MS, 1);
        paint(from + (100 - from) * (1 - (1 - k) ** 3));
        if (k >= 1) {
          finish();
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
    // The timeline must run exactly once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      ref={rootRef}
      className={`aura-pl is-${phase}`}
      role="status"
      aria-busy={phase !== "exit"}
      aria-label="Loading Aura"
    >
      <style>{CSS}</style>
      <Panel side="top" />
      <Panel side="bottom" />

      <div className="aura-pl__stage" aria-hidden="true">
        <div className="aura-pl__brand">
          <AuraLogo />
        </div>
        <div className="aura-pl__line">
          <i />
        </div>
        {tagline ? <p className="aura-pl__tagline">{tagline}</p> : null}
        <div className="aura-pl__counter">
          <span ref={counterRef}>000</span>
          <small>%</small>
        </div>
      </div>
    </div>
  );
}

/**
 * Lighter version of the same screen for route / chunk loading.
 * Fades in after a short delay so fast loads never flash it.
 *   <Suspense fallback={<PreloaderFallback />}> ... </Suspense>
 */
export function PreloaderFallback() {
  return (
    <div
      className="aura-pl aura-pl--fallback"
      role="status"
      aria-label="Loading"
    >
      <style>{CSS}</style>
      <Panel side="top" />
      <Panel side="bottom" />
      <div className="aura-pl__stage" aria-hidden="true">
        <div className="aura-pl__brand">
          <AuraLogo />
        </div>
        <div className="aura-pl__line aura-pl__line--sweep">
          <i />
        </div>
      </div>
    </div>
  );
}
