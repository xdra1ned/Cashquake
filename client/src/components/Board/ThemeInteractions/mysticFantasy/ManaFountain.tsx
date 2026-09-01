import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

export const ManaFountain: React.FC = () => {
  const audio = useAudio();
  const [isRippling, setIsRippling] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  const handleClick = () => {
    audio.playFountainRippleSound();
    setIsRippling(true);
    setShowStatus(true);
    setTimeout(() => setIsRippling(false), 700);
    setTimeout(() => setShowStatus(false), 2000);
  };

  return (
    <div className="relative group flex items-end">
      {/* Physical Mossy Forest Spring Pool with Water Lilies & Crystal Shards */}
      <button
        type="button"
        onClick={handleClick}
        className="relative flex flex-col items-center p-1 rounded-2xl bg-slate-950/40 hover:bg-slate-900/60 border border-cyan-900/40 hover:border-cyan-300 transition-all duration-300 cursor-pointer backdrop-blur-xs"
        title="ENCHANTED FOREST SPRING — Touch the pool to create crystal water ripples"
      >
        {/* Floating Water Lily on Pool Surface */}
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-[9px] leading-none animate-float">🪷</span>
          <div className="w-1 h-1 rounded-full bg-cyan-300 animate-ping" />
        </div>

        {/* Natural Stone Spring Basin */}
        <div className="w-9 h-8 sm:w-10 sm:h-9 rounded-full bg-[#061826] border-2 border-emerald-800/80 p-0.5 flex items-center justify-center relative shadow-lg">
          {/* Shimmering Azure Spring Water */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500 via-sky-600 to-indigo-700 flex items-center justify-center relative overflow-hidden">
            {/* Ripple Wave */}
            <div className={`w-3 h-3 rounded-full border border-white/90 ${isRippling ? 'animate-ping' : 'animate-pulse'}`} />
            <div className="absolute inset-0 bg-white/10" />
          </div>

          {/* Emerging Raw Crystal Shards around Pool Rim */}
          <div className="absolute -top-1 right-1 w-1.5 h-2.5 bg-cyan-300 rounded-xs border border-white rotate-12" />
          <div className="absolute -bottom-0.5 left-1 w-1.5 h-2 bg-purple-300 rounded-xs border border-white -rotate-12" />
        </div>

        {/* Moss & Pebble Basin Bed */}
        <div className="w-9 h-1.5 bg-emerald-950 rounded-full border border-emerald-600/60 flex justify-around items-center px-1 mt-0.5">
          <div className="w-1 h-1 rounded-full bg-cyan-400" />
          <div className="w-1 h-1 rounded-full bg-pink-300" />
        </div>
      </button>

      {/* Diegetic In-World Water Purity Ripple Note */}
      {showStatus && (
        <div className="absolute right-full bottom-0 mr-2 z-40 px-2.5 py-1 rounded-xl bg-slate-950/95 border border-cyan-400 shadow-xl text-left animate-in fade-in zoom-in-95 duration-150 pointer-events-none whitespace-nowrap">
          <span className="text-[7.5px] font-serif font-bold text-cyan-200">
            ⛲ Forest Spring: Crystalline Purity
          </span>
        </div>
      )}
    </div>
  );
};
