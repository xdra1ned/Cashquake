import React from 'react';

/**
 * Frutiger Aero Ambient Center Arena Background Visuals.
 * Completely non-interactive (pointer-events-none) ambient decorations:
 * soft cloud silhouettes, floating glossy aqua glass droplets, specular water reflections, and daylight eco green glows.
 */
export const FrutigerAeroInteractions: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {/* Soft Aqua & Sky Blue Ambient Daylight Glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-sky-300/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
      <div className="absolute top-10 right-1/3 w-64 h-64 bg-white/30 rounded-full blur-2xl" />

      {/* Floating Glossy Water Droplets with Specular Dots */}
      <div className="absolute top-10 left-12 w-10 h-10 rounded-full bg-gradient-to-br from-white/90 via-sky-200/50 to-cyan-400/30 border border-white shadow-md flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-white/90 -translate-x-1 -translate-y-1" />
      </div>

      <div className="absolute bottom-12 right-12 w-12 h-12 rounded-full bg-gradient-to-br from-white/90 via-emerald-200/50 to-sky-300/30 border border-white shadow-md flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-white/90 -translate-x-1.5 -translate-y-1.5" />
      </div>

      <div className="absolute top-1/2 left-8 w-8 h-8 rounded-full bg-gradient-to-br from-white/80 via-cyan-200/40 to-sky-300/20 border border-white/80 shadow-sm flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-white/90 -translate-x-0.5 -translate-y-0.5" />
      </div>

      {/* Soft White Cloud Silhouette Flank */}
      <div className="absolute top-2 right-1/4 opacity-40">
        <svg width="150" height="50" viewBox="0 0 150 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 25 40 Q 35 20 60 25 Q 80 10 105 22 Q 125 15 138 32 Q 145 40 130 44 L 25 44 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {/* Fresh Green Eco Leaf Flank Accent */}
      <div className="absolute bottom-4 left-1/4 opacity-30">
        <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 10 35 Q 40 5 70 20 Q 30 45 10 35 Z"
            fill="#22C55E"
          />
        </svg>
      </div>
    </div>
  );
};
