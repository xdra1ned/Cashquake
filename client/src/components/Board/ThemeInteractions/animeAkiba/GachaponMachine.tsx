import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAudio } from '../../../../context/AudioContext';

interface GachaItem {
  name: string;
  rarity: 'COMMON' | 'RARE' | 'SUPER RARE' | 'ULTRA RARE';
  icon: string;
  color: string;
  borderColor: string;
}

const GACHA_ITEMS: GachaItem[] = [
  { name: 'Kira-Neko Plushie', rarity: 'COMMON', icon: '🐱', color: '#f472b6', borderColor: '#ec4899' },
  { name: 'Lucky Maneki Charm', rarity: 'COMMON', icon: '🐾', color: '#fbbf24', borderColor: '#f59e0b' },
  { name: 'Starlight Scepter', rarity: 'RARE', icon: '🪄', color: '#a855f7', borderColor: '#8b5cf6' },
  { name: 'Mecha-01 Micro-Figure', rarity: 'RARE', icon: '🤖', color: '#38bdf8', borderColor: '#0ea5e9' },
  { name: 'Idol Symphony Badge', rarity: 'SUPER RARE', icon: '⭐', color: '#fde047', borderColor: '#eab308' },
  { name: '8-Bit Dragon Slayer', rarity: 'ULTRA RARE', icon: '🗡️', color: '#f43f5e', borderColor: '#e11d48' },
];

export const GachaponMachine: React.FC = () => {
  const audio = useAudio();
  const [crankAngle, setCrankAngle] = useState(0);
  const [isVending, setIsVending] = useState(false);
  const [collectedItem, setCollectedItem] = useState<GachaItem | null>(null);

  const handleTurn = () => {
    if (isVending) return;
    audio.playGachaponSound();
    setIsVending(true);
    setCrankAngle((prev) => prev + 360);

    setTimeout(() => {
      const randomItem = GACHA_ITEMS[Math.floor(Math.random() * GACHA_ITEMS.length)];
      setCollectedItem(randomItem);
      setIsVending(false);
    }, 450);

    setTimeout(() => {
      setCollectedItem(null);
    }, 4000);
  };

  return (
    <div
      className="relative group cursor-pointer select-none"
      onClick={handleTurn}
      title="Akiba Gachapon Machine — Click to twist crank and get a capsule collectible"
    >
      {/* Gachapon Body Housing */}
      <div className="relative w-14 h-18 sm:w-16 sm:h-20 flex flex-col items-center">
        {/* Transparent Capsule Globe Dome */}
        <div className="relative w-12 h-10 sm:w-14 sm:h-11 rounded-t-2xl bg-gradient-to-b from-sky-400/20 via-slate-800/80 to-slate-900 border-2 border-pink-400/80 shadow-lg flex items-center justify-center overflow-hidden">
          {/* Glass reflection streak */}
          <div className="absolute top-1 left-1.5 w-8 h-2 bg-white/20 rounded-full rotate-[-15deg] pointer-events-none" />

          {/* Tumbling Colorful Toy Capsules inside Dome */}
          <div className="relative w-full h-full p-1 flex flex-wrap gap-0.5 items-center justify-center">
            {['#ec4899', '#06b6d4', '#fbbf24', '#a855f7', '#22c55e', '#ef4444'].map((col, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full border border-white/60 shadow-sm transition-transform duration-300 ${
                  isVending ? 'animate-spin-slow scale-110' : ''
                }`}
                style={{ backgroundColor: col }}
              />
            ))}
          </div>
        </div>

        {/* Machine Lower Base & Mechanism */}
        <div className="w-13 sm:w-15 h-8 sm:h-9 rounded-b-lg bg-gradient-to-b from-rose-600 to-rose-800 border-x-2 border-b-2 border-rose-900 shadow-xl flex flex-col items-center justify-between p-0.5 -mt-0.5">
          {/* Mechanical Turning Dial Crank */}
          <div
            className="w-4 h-4 rounded-full bg-amber-400 border border-amber-600 shadow flex items-center justify-center transition-transform duration-500 ease-out mt-0.5"
            style={{ transform: `rotate(${crankAngle}deg)` }}
          >
            <div className="w-3 h-1 bg-amber-700 rounded-full" />
          </div>

          {/* Capsule Dispense Chute Door */}
          <div className="w-6 h-2.5 rounded bg-slate-950 border border-slate-700 flex items-center justify-center">
            <div className={`w-2 h-1 rounded-full bg-pink-400 ${isVending ? 'animate-ping' : ''}`} />
          </div>
        </div>
      </div>

      {/* Station Stencil */}
      <div className="text-center mt-[-2px]">
        <span className="text-[7.5px] font-mono font-bold tracking-wider text-slate-400 group-hover:text-pink-300 transition-colors uppercase">
          🎰 GACHAPON
        </span>
      </div>

      {/* Capsule Prize Reveal Pill (Anchored securely above popping into arena center, 100% visible and unclipped) */}
      {collectedItem && (
        <div
          className="absolute bottom-full mb-1.5 left-0 whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-950/95 border text-[9px] font-mono font-bold shadow-2xl z-50 animate-fade-in pointer-events-auto backdrop-blur-md flex items-center gap-1.5 cursor-default"
          style={{ borderColor: collectedItem.borderColor, color: collectedItem.color }}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[12px] shrink-0">{collectedItem.icon}</span>
          <div className="flex flex-col text-left">
            <span className="leading-tight">{collectedItem.name}</span>
            <span className="text-[7px] text-slate-400 uppercase tracking-widest">{collectedItem.rarity}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCollectedItem(null);
            }}
            className="ml-1.5 p-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
            title="Dismiss Capsule Item"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
