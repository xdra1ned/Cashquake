import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAudio } from '../../../../context/AudioContext';

interface Drink {
  name: string;
  flavour: string;
  color: string;
  icon: string;
  temp: 'COLD' | 'HOT';
}

const DRINKS: Drink[] = [
  { name: 'MOON SODA', flavour: 'Sparkling Blue Ramune', color: '#06b6d4', icon: '🌙', temp: 'COLD' },
  { name: 'STAR POP', flavour: 'Super Fizzy Yuzu Citrus', color: '#fbbf24', icon: '⭐', temp: 'COLD' },
  { name: 'KAWAII COLA', flavour: 'Sweet Sakura Cherry', color: '#ec4899', icon: '💖', temp: 'COLD' },
  { name: 'ENERGY☆MAX', flavour: 'Otaku Lightning Berry', color: '#ef4444', icon: '⚡', temp: 'COLD' },
  { name: 'MATCHA FIZZ', flavour: 'Iced Sweet Green Tea', color: '#22c55e', icon: '🍵', temp: 'HOT' },
];

export const AnimeVendingMachine: React.FC = () => {
  const audio = useAudio();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isDispensing, setIsDispensing] = useState(false);
  const [dispensedDrink, setDispensedDrink] = useState<Drink | null>(null);

  const handleVend = () => {
    if (isDispensing) return;
    audio.playVendingMachineSound();
    setIsDispensing(true);
    const nextIdx = (selectedIdx + 1) % DRINKS.length;
    setSelectedIdx(nextIdx);

    setTimeout(() => {
      setDispensedDrink(DRINKS[nextIdx]);
      setIsDispensing(false);
    }, 380);

    setTimeout(() => {
      setDispensedDrink(null);
    }, 3800);
  };

  return (
    <div
      className="relative group cursor-pointer select-none"
      onClick={handleVend}
      title="Japanese Drink Vending Machine — Click to select drink and dispense can"
    >
      {/* Vending Machine Cabinet Body */}
      <div className="relative w-15 h-19 sm:w-17 sm:h-21 rounded-lg bg-gradient-to-b from-cyan-600 via-sky-700 to-sky-900 border-2 border-sky-400/90 shadow-xl flex flex-col items-center p-1 justify-between">
        {/* Top Illuminated Brand Canopy */}
        <div className="w-full h-3 rounded bg-slate-950/90 border border-cyan-300/40 flex items-center justify-between px-1">
          <span className="text-[6.5px] font-mono font-black text-cyan-300 tracking-wider">自動販売機</span>
          <span className="text-[7px]">🥤</span>
        </div>

        {/* Illuminated Glass Display Case with Drink Cans */}
        <div className="w-full h-8 sm:h-9 rounded bg-slate-950/95 border border-sky-300/40 p-0.5 flex flex-col justify-between">
          {/* Row of Miniature Cans */}
          <div className="flex justify-around items-center pt-0.5">
            {DRINKS.map((drink, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-2 h-3.5 rounded-sm shadow-sm flex items-center justify-center text-[5px]"
                  style={{ backgroundColor: drink.color }}
                >
                  <span className="leading-none text-[4px]">{drink.icon}</span>
                </div>
                {/* Cold/Hot Indicator Button */}
                <div
                  className={`w-1.5 h-1 rounded-sm mt-0.5 ${
                    i === selectedIdx && isDispensing
                      ? 'bg-amber-300 ring-1 ring-amber-400 animate-ping'
                      : drink.temp === 'HOT'
                      ? 'bg-rose-500'
                      : 'bg-blue-400'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Lower Coin Slot, Keypad & Push-Flap Door */}
        <div className="w-full h-5 rounded bg-slate-900/90 border border-slate-700 flex items-center justify-between px-1">
          {/* Coin Return & Slot */}
          <div className="flex flex-col gap-0.5">
            <div className="w-2 h-0.5 bg-amber-400 rounded-full" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
          </div>

          {/* Dispense Push Flap Door */}
          <div className={`w-7 h-3 rounded bg-slate-950 border border-cyan-500/60 flex items-center justify-center ${isDispensing ? 'bg-cyan-900/80' : ''}`}>
            <span className="text-[5.5px] font-mono font-bold text-cyan-300">PUSH</span>
          </div>
        </div>
      </div>

      {/* Station Stencil */}
      <div className="text-center mt-[-2px]">
        <span className="text-[7.5px] font-mono font-bold tracking-wider text-slate-400 group-hover:text-cyan-300 transition-colors uppercase">
          🥤 VENDING
        </span>
      </div>

      {/* Dispensed Drink Readout Pill (Anchored securely above right-aligned, 100% visible and unclipped) */}
      {dispensedDrink && (
        <div
          className="absolute bottom-full mb-1.5 right-0 whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-950/95 border text-[9px] font-mono font-bold shadow-2xl z-50 animate-fade-in pointer-events-auto backdrop-blur-md flex items-center gap-1.5 cursor-default"
          style={{ borderColor: dispensedDrink.color, color: dispensedDrink.color }}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[12px] shrink-0">{dispensedDrink.icon}</span>
          <div className="flex flex-col text-left">
            <span className="leading-tight">{dispensedDrink.name}</span>
            <span className="text-[7.5px] text-slate-300 font-sans leading-none mt-0.5">{dispensedDrink.flavour}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDispensedDrink(null);
            }}
            className="ml-1.5 p-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
            title="Dismiss Drink"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
