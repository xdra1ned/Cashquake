import React from 'react';
import { BoardThemeId } from '@shared/types';
import { getTheme } from '../../theme/themeRegistry';

interface ThemedPageEnvironmentProps {
  themeId: BoardThemeId;
}

/**
 * Layer 1 — Page Environment Layer.
 * Renders lightweight, non-interactive, atmospheric background visuals behind all UI panels & board.
 * Pointer-events-none, fixed position, zero layout shift or performance drag.
 */
export const ThemedPageEnvironment: React.FC<ThemedPageEnvironmentProps> = ({ themeId }) => {
  const theme = getTheme(themeId);
  const atmosphere = theme.colors.atmosphericId;

  return (
    <div
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden transition-colors duration-700"
      style={{ background: theme.colors.pageBgGradient }}
    >
      {/* 1. Cosmic Space Expanse Starfield & Nebula Overlay */}
      {atmosphere === 'stars_nebula' && (
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sky-500/15 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px]" />
          <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <filter id="space-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#space-noise)" opacity="0.15" />
          </svg>
        </div>
      )}

      {/* 2. Cyber Neon 2099 Grid Matrix & Data Pulse */}
      {atmosphere === 'cyber_grid' && (
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(34, 211, 238, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(34, 211, 238, 0.08) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-cyan-500/10 to-transparent" />
          <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-fuchsia-600/10 rounded-full blur-[120px]" />
        </div>
      )}

      {/* 3. Casino Royale Velvet Lounge & Gold Shimmer */}
      {atmosphere === 'velvet_lounge' && (
        <div className="absolute inset-0 opacity-35">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)]" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-600/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-amber-600/10 rounded-full blur-[120px]" />
        </div>
      )}

      {/* 4. Pixel Quest 8-Bit CRT Arcade Grid */}
      {atmosphere === 'arcade_crt' && (
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.06) 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />
          <div className="absolute top-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
        </div>
      )}

      {/* 5. World Metropolis Dusk-to-Night Architectural City Atmosphere */}
      {atmosphere === 'city_skyline' && (
        <div className="absolute inset-0 opacity-60 overflow-hidden pointer-events-none">
          {/* Horizon Dusk Amber/Orange Glow */}
          <div className="absolute bottom-0 left-0 w-full h-[320px] bg-gradient-to-t from-amber-900/20 via-sky-950/30 to-transparent" />

          {/* Upper City Haze Radial Spotlights */}
          <div className="absolute top-0 left-1/4 w-[700px] h-[450px] bg-sky-600/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-20 right-1/4 w-[500px] h-[350px] bg-amber-500/10 rounded-full blur-[120px]" />

          {/* Vector City Skyline Silhouette at Horizon */}
          <div className="absolute bottom-0 left-0 w-full h-56 opacity-45 pointer-events-none">
            <svg viewBox="0 0 1440 280" className="w-full h-full" preserveAspectRatio="none" fill="none">
              {/* Background Building Layer */}
              <path
                fill="#0f1b2d"
                d="M 0 280 L 0 180 L 40 180 L 40 140 L 90 140 L 90 180 L 140 180 L 140 110 L 190 110 L 190 180 L 250 180 L 250 200 L 320 200 L 320 120 L 380 120 L 380 90 L 420 90 L 420 280 Z"
              />
              <path
                fill="#13233a"
                d="M 420 280 L 420 150 L 480 150 L 480 100 L 540 100 L 540 150 L 610 150 L 610 70 L 630 70 L 630 50 L 650 50 L 650 70 L 670 70 L 670 150 L 730 150 L 730 200 L 800 200 L 800 130 L 860 130 L 860 280 Z"
              />
              <path
                fill="#0f1b2d"
                d="M 860 280 L 860 170 L 920 170 L 920 110 L 980 110 L 980 170 L 1050 170 L 1050 95 L 1110 95 L 1110 170 L 1180 170 L 1180 140 L 1240 140 L 1240 200 L 1320 200 L 1320 120 L 1380 120 L 1380 180 L 1440 180 L 1440 280 Z"
              />

              {/* Foreground Building Layer */}
              <path
                fill="#0a1220"
                d="M 0 280 L 0 210 L 60 210 L 60 170 L 120 170 L 120 210 L 210 210 L 210 150 L 270 150 L 270 210 L 350 210 L 350 180 L 450 180 L 450 280 Z"
              />
              <path
                fill="#0c1626"
                d="M 450 280 L 450 190 L 520 190 L 520 130 L 580 130 L 580 190 L 680 190 L 680 110 L 700 80 L 720 110 L 720 190 L 820 190 L 820 280 Z"
              />
              <path
                fill="#0a1220"
                d="M 820 280 L 820 190 L 900 190 L 900 140 L 960 140 L 960 190 L 1080 190 L 1080 150 L 1150 150 L 1150 190 L 1260 190 L 1260 160 L 1350 160 L 1350 210 L 1440 210 L 1440 280 Z"
              />

              {/* Subtle Building Window Light Dots */}
              <circle cx="240" cy="170" r="1.5" fill="#FBBF24" opacity="0.8" />
              <circle cx="240" cy="185" r="1.5" fill="#38BDF8" opacity="0.6" />
              <circle cx="550" cy="150" r="1.5" fill="#FBBF24" opacity="0.9" />
              <circle cx="550" cy="165" r="1.5" fill="#38BDF8" opacity="0.7" />
              <circle cx="700" cy="120" r="1.5" fill="#FBBF24" opacity="0.85" />
              <circle cx="700" cy="140" r="1.5" fill="#38BDF8" opacity="0.7" />
              <circle cx="1000" cy="160" r="1.5" fill="#FBBF24" opacity="0.8" />
              <circle cx="1110" cy="170" r="1.5" fill="#38BDF8" opacity="0.6" />
            </svg>
          </div>
        </div>
      )}

      {/* 6. Mystic Fantasy Realm Magical Wisps */}
      {atmosphere === 'mystic_runes' && (
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/3 left-1/5 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[130px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/5 w-[550px] h-[550px] bg-fuchsia-600/15 rounded-full blur-[140px]" />
        </div>
      )}

      {/* 7. Anime Akiba District Neon Glow & Bokeh */}
      {atmosphere === 'neon_akiba' && (
        <div className="absolute inset-0 opacity-35">
          <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-[130px]" />
          <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[130px]" />
        </div>
      )}

      {/* 8. Frutiger Aero Optimistic Sky, Aqua Atmosphere, Drifting Clouds & Lush Green Hills */}
      {atmosphere === 'aero_eco' && (
        <div className="absolute inset-0 opacity-80 overflow-hidden">
          {/* Top Sunlight / Solar Flare Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-white/40 via-sky-200/20 to-transparent rounded-full blur-[70px]" />

          {/* Drifting Soft White Cloud Silhouettes */}
          <div className="absolute top-8 left-10 opacity-30 animate-pulse">
            <svg width="240" height="90" viewBox="0 0 240 90" fill="none">
              <path d="M 30 70 Q 50 35 90 45 Q 120 20 160 35 Q 190 25 210 50 Q 230 65 210 75 Z" fill="#FFFFFF" />
            </svg>
          </div>
          <div className="absolute top-16 right-16 opacity-25">
            <svg width="280" height="100" viewBox="0 0 280 100" fill="none">
              <path d="M 40 80 Q 70 40 120 50 Q 150 25 200 40 Q 240 30 260 65 Q 275 80 250 85 Z" fill="#FFFFFF" />
            </svg>
          </div>

          {/* Distant Lush Green Rolling Hills Horizon Silhouette */}
          <div className="absolute bottom-0 left-0 w-full h-48 opacity-45 pointer-events-none">
            <svg viewBox="0 0 1440 320" className="w-full h-full preserve-3d" preserveAspectRatio="none">
              <path
                fill="#4ADE80"
                fillOpacity="0.5"
                d="M0,192L60,186.7C120,181,240,171,360,181.3C480,192,600,224,720,213.3C840,203,960,149,1080,149.3C1200,150,1320,203,1380,229.3L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              />
              <path
                fill="#22C55E"
                fillOpacity="0.4"
                d="M0,224L80,240C160,256,320,288,480,277.3C640,267,800,213,960,197.3C1120,181,1280,203,1360,213.3L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
              />
            </svg>
          </div>

          {/* Floating Glossy Water Droplets & Aqua Glass Bubbles */}
          <div className="absolute top-1/3 left-16 w-14 h-14 rounded-full bg-gradient-to-br from-white/60 via-sky-300/30 to-cyan-400/20 border border-white/80 shadow-md backdrop-blur-sm flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white/90 -translate-x-1.5 -translate-y-1.5" />
          </div>

          <div className="absolute top-1/2 right-24 w-18 h-18 rounded-full bg-gradient-to-br from-white/70 via-emerald-200/40 to-sky-300/20 border border-white/90 shadow-md backdrop-blur-sm flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white/90 -translate-x-2 -translate-y-2" />
          </div>

          <div className="absolute bottom-32 left-1/4 w-10 h-10 rounded-full bg-gradient-to-br from-white/60 via-cyan-300/30 to-emerald-300/20 border border-white/70 shadow-sm flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white/90 -translate-x-1 -translate-y-1" />
          </div>
        </div>
      )}
    </div>
  );
};
