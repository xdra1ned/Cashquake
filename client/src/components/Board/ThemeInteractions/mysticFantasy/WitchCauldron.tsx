import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

const BREWS = [
  { name: 'ELIXIR OF FORTUNE', color: 'from-amber-400 to-pink-500', glow: 'shadow-amber-400/50', desc: 'Golden steam rises with lucky stardust.' },
  { name: 'DRAUGHT OF LEVITATION', color: 'from-cyan-400 to-indigo-500', glow: 'shadow-cyan-400/50', desc: 'Azure bubbles float into the twilight air.' },
  { name: 'ESSENCE OF FIREFLIES', color: 'from-emerald-400 to-teal-500', glow: 'shadow-emerald-400/50', desc: 'Glowing green sparkles illuminate the grove.' },
  { name: 'AMETHYST MANA TONIC', color: 'from-purple-400 to-fuchsia-500', glow: 'shadow-purple-400/50', desc: 'Arcane fragrance wafts through the trees.' },
];

export const WitchCauldron: React.FC = () => {
  const audio = useAudio();
  const [isBrewing, setIsBrewing] = useState(false);
  const [brewIdx, setBrewIdx] = useState(0);
  const [showScroll, setShowScroll] = useState(false);

  const currentBrew = BREWS[brewIdx];

  const handleStirCauldron = () => {
    audio.playCauldronBubbleSound();
    setIsBrewing(true);
    setShowScroll(true);
    setBrewIdx((prev) => (prev + 1) % BREWS.length);
    setTimeout(() => {
      setIsBrewing(false);
    }, 900);
  };

  return (
    <div className="relative group flex items-end">
      {/* Physical Witch & Cauldron Workstation */}
      <button
        type="button"
        onClick={handleStirCauldron}
        className="relative flex items-end gap-1.5 p-1 rounded-2xl bg-slate-950/40 hover:bg-slate-900/60 border border-purple-900/40 hover:border-pink-400/80 transition-all duration-300 cursor-pointer backdrop-blur-xs"
        title="WITCH'S POTION STATION — Click to stir the bubbling cauldron"
      >
        {/* Witch NPC Silhouette */}
        <div className="flex flex-col items-center select-none">
          {/* Pointed Witch Hat with Purple Band */}
          <div className="w-0 h-0 border-x-4 border-x-transparent border-b-8 border-b-slate-950 relative">
            <div className="absolute -bottom-1 -left-2.5 w-5 h-1 bg-purple-700 rounded-full" />
          </div>
          {/* Witch Robe & Cloak */}
          <div className="w-5 h-6 bg-gradient-to-b from-indigo-950 to-slate-950 rounded-t-md border border-purple-800/60 flex items-center justify-center relative">
            <span className="text-[7px] text-amber-200">🧙‍♀️</span>
          </div>
        </div>

        {/* Cast-Iron Bubbling Cauldron on Stone Firepit */}
        <div className="flex flex-col items-center">
          {/* Rising Magical Steam Vapor */}
          <div className="h-4 flex items-center justify-center relative">
            {isBrewing ? (
              <div className="flex gap-1 animate-bounce">
                <span className="text-[10px] animate-ping">✨</span>
                <span className="text-[9px] animate-pulse text-pink-300">💨</span>
                <span className="text-[10px] animate-ping text-amber-300">✨</span>
              </div>
            ) : (
              <div className="text-[8px] text-purple-300/60 animate-pulse">~ ~</div>
            )}
          </div>

          {/* Cauldron Vessel */}
          <div className={`w-8 h-7 sm:w-9 sm:h-8 rounded-full bg-slate-950 border-2 border-stone-700 p-0.5 flex items-center justify-center relative shadow-lg ${isBrewing ? currentBrew.glow : ''}`}>
            {/* Bubbling Potion Liquid Surface */}
            <div className={`w-full h-full rounded-full bg-gradient-to-br ${currentBrew.color} flex items-center justify-center relative overflow-hidden`}>
              <div className={`w-2 h-2 rounded-full bg-white/70 ${isBrewing ? 'animate-ping' : 'animate-pulse'}`} />
              <div className="absolute inset-0 bg-white/10" />
            </div>
            {/* Cauldron Rim Handles */}
            <div className="absolute -left-1 w-1.5 h-1.5 rounded-full border border-stone-600" />
            <div className="absolute -right-1 w-1.5 h-1.5 rounded-full border border-stone-600" />
          </div>

          {/* Firepit Stone Base & Glowing Coals */}
          <div className="w-7 h-1.5 bg-stone-900 rounded-full border border-amber-800/80 flex justify-center items-center gap-0.5 mt-0.5">
            <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
            <div className="w-1.5 h-1 rounded-full bg-orange-600" />
            <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
          </div>
        </div>

        {/* Wooden Potion Table with Herb Jars */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-0.5 mb-0.5">
            <div className="w-1.5 h-2.5 bg-emerald-600 rounded-xs border border-emerald-400/80" title="Herb Jar" />
            <div className="w-1.5 h-3 bg-purple-600 rounded-xs border border-purple-400/80" title="Mana Vial" />
          </div>
          <div className="w-5 h-2 bg-amber-950 rounded-xs border border-amber-800" />
          <div className="w-1 h-3 bg-amber-950" />
        </div>
      </button>

      {/* Atmospheric In-World Parchment Ribbon (Non-intrusive) */}
      {showScroll && (
        <div className="absolute left-full bottom-2 ml-2 z-40 w-44 sm:w-48 p-2 rounded-xl bg-amber-950/95 border border-amber-500/80 shadow-xl shadow-purple-950/80 text-left animate-in fade-in zoom-in-95 duration-150 pointer-events-auto">
          <div className="flex items-center justify-between border-b border-amber-800/80 pb-0.5 mb-1">
            <span className="text-[7.5px] font-serif font-black text-amber-200 uppercase tracking-wider">
              🧪 {currentBrew.name}
            </span>
            <button
              type="button"
              onClick={() => setShowScroll(false)}
              className="text-amber-400 hover:text-amber-100 text-[8px] px-1 rounded"
            >
              ✕
            </button>
          </div>
          <p className="text-[7.5px] font-serif italic text-amber-100 leading-tight">
            {currentBrew.desc}
          </p>
        </div>
      )}
    </div>
  );
};
