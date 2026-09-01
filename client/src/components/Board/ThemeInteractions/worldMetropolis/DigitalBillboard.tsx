import React, { useState, useEffect } from 'react';
import { useAudio } from '../../../../context/AudioContext';

const BILLBOARD_ADS = [
  { tag: 'LUXURY LIVING', headline: 'GRAND METROPOLIS RESIDENCES', sub: 'Penthouses & High-Rise Suites Available', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/40', text: 'text-amber-300' },
  { tag: 'NEW DEVELOPMENT', headline: 'NORTH DISTRICT COMMERCIAL TOWER', sub: 'Prime Financial District Office Spaces', color: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/40', text: 'text-cyan-300' },
  { tag: 'TRANSIT NETWORK', headline: 'METROLINE EXPRESS 24/7', sub: 'High-Speed Transit Connecting All 8 Districts', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/40', text: 'text-emerald-300' },
  { tag: 'WEALTH MANAGEMENT', headline: 'CITY BANK & TRUST', sub: 'Capitalizing Urban Investments Since 1924', color: 'from-purple-500/20 to-indigo-500/20', border: 'border-purple-500/40', text: 'text-purple-300' },
];

export const DigitalBillboard: React.FC = () => {
  const audio = useAudio();
  const [adIndex, setAdIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-cycle advertisement every 6.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % BILLBOARD_ADS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const handleNextAd = () => {
    audio.playBillboardClick();
    setIsTransitioning(true);
    setAdIndex((prev) => (prev + 1) % BILLBOARD_ADS.length);
    setTimeout(() => setIsTransitioning(false), 250);
  };

  const ad = BILLBOARD_ADS[adIndex];

  return (
    <button
      type="button"
      onClick={handleNextAd}
      className={`group relative flex flex-col p-1.5 rounded-xl bg-slate-950/80 border ${ad.border} shadow-md hover:scale-105 transition-all duration-200 cursor-pointer backdrop-blur-md text-left w-32 sm:w-36`}
      title="DIGITAL BILLBOARD — Click to cycle city advertisements"
    >
      {/* LED Billboard Frame */}
      <div className={`w-full rounded-lg bg-gradient-to-r ${ad.color} p-1.5 border border-white/10 relative overflow-hidden flex flex-col justify-between h-10 sm:h-11 transition-opacity ${isTransitioning ? 'opacity-40' : 'opacity-100'}`}>
        <div className="flex items-center justify-between">
          <span className="text-[6px] font-mono font-bold px-1 rounded bg-black/50 text-slate-300 tracking-wider">
            {ad.tag}
          </span>
          <span className="text-[5.5px] font-mono text-slate-400">TAP ↻</span>
        </div>

        <div className="mt-0.5">
          <div className={`text-[7.5px] sm:text-[8px] font-black leading-tight truncate ${ad.text} font-display`}>
            {ad.headline}
          </div>
          <div className="text-[6px] text-slate-400 truncate leading-none mt-0.5">
            {ad.sub}
          </div>
        </div>

        {/* Subtle LED Scanline Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* Structural Support Legs */}
      <div className="flex justify-between px-3 w-full -mt-0.5">
        <div className="w-1 h-1 bg-slate-600 rounded-b" />
        <div className="w-1 h-1 bg-slate-600 rounded-b" />
      </div>
    </button>
  );
};
