import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

const VISIONS = [
  { icon: '🌙', name: 'THE CRESCENT MOON', desc: 'The tides of fortune align favorably.' },
  { icon: '🐉', name: 'THE SLEEPING DRAGON', desc: 'Hidden wealth rests within the mountain keep.' },
  { icon: '🏰', name: 'THE WIZARD CITADEL', desc: 'The high spires welcome new travelers.' },
  { icon: '🧚', name: 'THE FAIRY BLESSING', desc: 'Stardust guides your next destination.' },
  { icon: '👁️', name: 'THE ALL-SEEING EYE', desc: 'Destiny reveals paths unseen.' },
];

export const CrystalOracle: React.FC = () => {
  const audio = useAudio();
  const [isGazing, setIsGazing] = useState(false);
  const [visionIdx, setVisionIdx] = useState<number | null>(null);

  const handleConsult = () => {
    audio.playCrystalShimmerSound();
    setIsGazing(true);
    const randomIdx = Math.floor(Math.random() * VISIONS.length);
    setVisionIdx(randomIdx);
    setTimeout(() => {
      setIsGazing(false);
    }, 700);
  };

  const curr = visionIdx !== null ? VISIONS[visionIdx] : null;

  return (
    <div className="relative group flex items-end">
      {/* Mystical Fortune-Teller's Shrine & Crystal Orb */}
      <button
        type="button"
        onClick={handleConsult}
        className="relative flex flex-col items-center p-1 rounded-2xl bg-slate-950/40 hover:bg-slate-900/60 border border-cyan-900/40 hover:border-cyan-400 transition-all duration-300 cursor-pointer backdrop-blur-xs"
        title="FORTUNE-TELLER'S CRYSTAL ORACLE — Touch the enchanted orb to peer into destiny"
      >
        {/* Hanging Mystic Star Charms */}
        <div className="flex justify-between w-full px-1 mb-0.5 pointer-events-none">
          <div className="text-[7px] text-amber-300 animate-pulse">⭐</div>
          <div className="text-[7px] text-purple-300 animate-pulse delay-200">✨</div>
        </div>

        {/* Mossy Stone Shrine & Velvet Cushion */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 border border-cyan-400/60 p-0.5 flex items-center justify-center relative shadow-lg">
          {/* Luminous Crystal Sphere */}
          <div className={`w-7 h-7 rounded-full bg-gradient-to-tr from-purple-700 via-cyan-400 to-white flex items-center justify-center relative shadow-inner ${isGazing ? 'animate-ping' : 'animate-pulse'}`}>
            {/* Inner Vision Silhouette */}
            {curr ? (
              <span className="text-[10px] leading-none text-slate-900 font-bold transition-all duration-300">
                {curr.icon}
              </span>
            ) : (
              <div className="w-2 h-2 rounded-full bg-white/80" />
            )}
          </div>

          {/* Orbiting Starlight Mote */}
          <div className="absolute inset-0 rounded-full border border-cyan-300/40 animate-spin pointer-events-none" />
        </div>

        {/* Carved Stone Pedestal with Candles */}
        <div className="w-8 h-2 bg-stone-900 rounded-full border border-stone-700 flex justify-between items-center px-1 mt-0.5">
          <div className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
          <div className="w-3 h-0.5 bg-cyan-500/60" />
          <div className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
        </div>
      </button>

      {/* Diegetic In-World Vision Ribbon */}
      {curr && (
        <div className="absolute right-full top-0 mr-2 z-40 w-44 sm:w-48 p-2 rounded-xl bg-indigo-950/95 border border-cyan-400 shadow-xl text-left animate-in fade-in zoom-in-95 duration-150 pointer-events-auto">
          <div className="flex items-center justify-between border-b border-indigo-800 pb-0.5 mb-1">
            <span className="text-[7.5px] font-serif font-black text-cyan-200 uppercase tracking-wider">
              {curr.icon} {curr.name}
            </span>
            <button
              type="button"
              onClick={() => setVisionIdx(null)}
              className="text-cyan-400 hover:text-cyan-100 text-[8px] px-1 rounded"
            >
              ✕
            </button>
          </div>
          <p className="text-[7.5px] font-serif italic text-indigo-100 leading-tight">
            "{curr.desc}"
          </p>
        </div>
      )}
    </div>
  );
};
