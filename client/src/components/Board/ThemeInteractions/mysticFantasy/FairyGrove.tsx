import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

export const FairyGrove: React.FC = () => {
  const audio = useAudio();
  const [isBlooming, setIsBlooming] = useState(false);
  const [showDust, setShowDust] = useState(false);

  const handleBloom = () => {
    audio.playWispChimeSound();
    setIsBlooming(true);
    setShowDust(true);
    setTimeout(() => {
      setIsBlooming(false);
    }, 800);
    setTimeout(() => {
      setShowDust(false);
    }, 1600);
  };

  return (
    <div className="relative group flex items-end">
      {/* Physical Fairy Grove with Giant Glowing Flower & Winged Fairies */}
      <button
        type="button"
        onClick={handleBloom}
        className="relative flex flex-col items-center p-1 rounded-2xl bg-slate-950/40 hover:bg-slate-900/60 border border-pink-900/40 hover:border-pink-300 transition-all duration-300 cursor-pointer backdrop-blur-xs"
        title="ENCHANTED FAIRY GROVE — Click the giant magical blossom to release fairy pollen"
      >
        {/* Floating Winged Fairies */}
        <div className="flex justify-between w-full px-1 -mb-1 pointer-events-none">
          {/* Fairy 1 */}
          <div className="flex items-center gap-0.5 animate-float">
            <span className="text-[10px] leading-none">🧚</span>
            <div className="w-1 h-1 rounded-full bg-pink-300 animate-ping" />
          </div>
          {/* Fairy 2 */}
          <div className="flex items-center gap-0.5 animate-float delay-300">
            <div className="w-1 h-1 rounded-full bg-cyan-300 animate-ping" />
            <span className="text-[9px] leading-none">✨</span>
          </div>
        </div>

        {/* Giant Enchanted Flower Core */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-purple-950 via-pink-900 to-indigo-950 border border-pink-400/60 p-1 flex items-center justify-center relative shadow-lg">
          {/* Animated Petals */}
          <div className={`w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 via-purple-300 to-amber-200 flex items-center justify-center transition-transform duration-500 shadow-md ${isBlooming ? 'scale-125 rotate-45' : 'animate-pulse'}`}>
            <span className="text-[11px] leading-none">🌸</span>
          </div>

          {/* Orbiting Stardust Rings */}
          <div className="absolute inset-0 rounded-full border border-pink-300/40 animate-spin" />
        </div>

        {/* Mossy Ground & Luminous Toadstools */}
        <div className="w-10 h-2 bg-emerald-950/80 rounded-full border border-emerald-700/60 flex justify-around items-center px-1 mt-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <div className="w-2 h-1 rounded-full bg-emerald-500" />
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </div>
      </button>

      {/* Ephemeral Fairy Dust Sparkle Trail */}
      {showDust && (
        <div className="absolute right-full top-0 mr-1.5 z-40 px-2 py-1 rounded-xl bg-slate-950/95 border border-pink-400 shadow-lg text-[7.5px] font-serif italic text-pink-200 animate-in fade-in zoom-in-90 duration-150 pointer-events-none whitespace-nowrap">
          ✨ Fairy pollen drifts through the grove...
        </div>
      )}
    </div>
  );
};
