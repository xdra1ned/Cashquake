import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

export const ForestWisp: React.FC = () => {
  const audio = useAudio();
  const [isSparkling, setIsSparkling] = useState(false);
  const [showTag, setShowTag] = useState(false);

  const handleWispClick = () => {
    audio.playWispChimeSound();
    setIsSparkling(true);
    setShowTag(true);
    setTimeout(() => {
      setIsSparkling(false);
      setShowTag(false);
    }, 1200);
  };

  return (
    <div className="relative group flex items-center gap-2">
      {/* Tiny Perched Dragon Familiar */}
      <div className="flex items-center gap-0.5 select-none opacity-80 hover:opacity-100 transition" title="Celestial Dragon Familiar">
        <span className="text-[11px] leading-none">🐉</span>
        <div className="w-1 h-1 rounded-full bg-amber-400 animate-ping" />
      </div>

      {/* Floating Spirit Wisp / Winged Fairy */}
      <button
        type="button"
        onClick={handleWispClick}
        className="relative flex items-center p-1 rounded-full bg-slate-950/40 hover:bg-slate-900/60 border border-pink-400/40 hover:border-pink-300 transition-all duration-200 cursor-pointer backdrop-blur-xs animate-float"
        title="ENCHANTED SPIRIT FAIRY — Click to play with the magical fairy"
      >
        {/* Fairy Orb & Fluttering Wings */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-purple-500 via-pink-400 to-amber-200 p-0.5 flex items-center justify-center relative shadow-md shadow-pink-500/40">
          <span className={`text-[11px] leading-none ${isSparkling ? 'animate-spin' : 'animate-pulse'}`}>
            🧚
          </span>
          {/* Sparkle Rings */}
          <div className={`absolute inset-0 rounded-full border border-pink-300 ${isSparkling ? 'animate-ping' : ''}`} />
        </div>
      </button>

      {/* Ephemeral Sparkle Tag */}
      {showTag && (
        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 z-40 px-2 py-0.5 rounded-full bg-slate-950/95 border border-pink-400 shadow-lg text-[7px] font-serif font-bold text-pink-200 animate-in fade-in zoom-in-90 duration-150 pointer-events-none whitespace-nowrap">
          ✨ FAIRY BLESSING ✨
        </div>
      )}
    </div>
  );
};
