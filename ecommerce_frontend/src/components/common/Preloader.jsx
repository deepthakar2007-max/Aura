import React, { useState, useEffect } from "react";

const Preloader = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show preloader for 1.8 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      const removeTimer = setTimeout(onFinish, 600); // Match transition duration
      return () => clearTimeout(removeTimer);
    }, 1800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#09090b] text-white transition-opacity duration-700 ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      {/* Brand Monogram / Name */}
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-light tracking-[0.4em] text-neutral-100 mb-2">
          AURA
        </h1>
        {/* Thin Gold Divider */}
        <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent my-4"></div>
        <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-neutral-400">
          Exquisite Luxury Collection
        </p>
      </div>

      {/* Ultra-thin Minimalist Loader Progress Line */}
      <div className="absolute bottom-16 w-40 h-[2px] bg-neutral-800 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300 to-transparent animate-[pulse_1.5s_infinite]"></div>
      </div>
    </div>
  );
};

export default Preloader;
