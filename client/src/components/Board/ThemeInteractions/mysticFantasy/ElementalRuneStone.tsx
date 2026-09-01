import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

const ELEMENTS = [
  { name: 'PYRO RUNE', icon: '🔥', glyph: 'ᚠ', color: 'text-amber-400', glow: 'shadow-amber-500/40', desc: 'Flame mana resonates warmly through the stone.' },
  { name: 'HYDRO RUNE', icon: '💧', glyph: 'ᛚ', color: 'text-cyan-400', glow: 'shadow-cyan-500/40', desc: 'Tidal currents flow through ancient carved veins.' },
  { name: 'VOLT RUNE', icon: '⚡', glyph: 'ᛋ', color: 'text-yellow-300', glow: 'shadow-yellow-400/40', desc: 'Lightning sparks crackle upon the stone face.' },
  { name: 'FLORA RUNE', icon: '🌿', glyph: 'ᛒ', color: 'text-emerald-400', glow: 'shadow-emerald-500/40', desc: 'Verdant moss and ivy climb the monolith.' },
  { name: 'ASTRAL RUNE', icon: '✨', glyph: 'ᛏ', color: 'text-purple-300', glow: 'shadow-purple-500/40', desc: 'Starlight harmonics pulse from the deep earth.' },
];

export const ElementalRuneStone: React.FC = () => {
  const audio = useAudio();
  const [elemIdx, setElemIdx] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  const curr = ELEMENTS[elemIdx];

  const handleRuneClick = () => {
    audio.playRunePulseSound();
    setIsPulsing(true);
    setShowStatus(true);
    setElemIdx((prev) => (prev + 1) % ELEMENTS.length);
    setTimeout(() => setIsPulsing(false), 500);
    setTimeout(() => setShowStatus(false), 2200);
  };

  return (
    <div className="relative group flex items-end">
      {/* Physical Carved Standing Stone with Moss & Ivy */}
      <button
        type="button"
        onClick={handleRuneClick}
        className="relative flex flex-col items-center p-1 rounded-2xl bg-slate-950/40 hover:bg-slate-900/60 border border-purple-900/40 hover:border-amber-400 transition-all duration-300 cursor-pointer backdrop-blur-xs"
        title="ANCIENT STANDING RUNE STONE — Touch the mossy monolith to invoke elemental resonance"
      >
        {/* Carved Monolith Stone Core */}
        <div className={`w-8 h-9 sm:w-9 sm:h-10 rounded-t-lg bg-stone-900 border-2 border-stone-600 p-0.5 flex flex-col justify-between items-center relative overflow-hidden shadow-lg ${curr.glow}`}>
          {/* Climbing Moss */}
          <div className="absolute top-0 left-0 w-2 h-3 bg-emerald-700/80 rounded-br-md" />

          {/* Carved Glowing Ancient Rune Glyph */}
          <span className={`text-[12px] font-serif font-black ${curr.color} mt-0.5 leading-none transition-transform ${isPulsing ? 'scale-125 animate-ping' : ''}`}>
            {curr.glyph}
          </span>

          {/* Rune Icon */}
          <div className="text-[8px] leading-none mb-0.5">{curr.icon}</div>

          {/* Stone Base Line */}
          <div className="w-full h-0.5 bg-gradient-to-r from-emerald-600 via-stone-500 to-amber-600" />
        </div>

        {/* Moss & Cobblestone Earth Base */}
        <div className="w-9 h-1.5 bg-emerald-950 rounded-full border border-emerald-700/60 flex justify-around items-center px-0.5 mt-0.5">
          <div className="w-1.5 h-1 rounded-full bg-stone-600" />
          <div className="w-2 h-1 rounded-full bg-emerald-600" />
        </div>
      </button>

      {/* Diegetic In-World Rune Status Note */}
      {showStatus && (
        <div className="absolute left-full bottom-0 ml-2 z-40 px-2.5 py-1 rounded-xl bg-slate-950/95 border border-purple-400 shadow-xl text-left animate-in fade-in zoom-in-95 duration-150 pointer-events-none whitespace-nowrap">
          <span className={`text-[7.5px] font-serif font-bold ${curr.color}`}>
            {curr.icon} {curr.name}: {curr.glyph} Active
          </span>
        </div>
      )}
    </div>
  );
};
