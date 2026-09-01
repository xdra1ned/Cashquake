import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAudio } from '../../../../context/AudioContext';

const MAID_GREETINGS = [
  { text: 'IRASSHAIMASE! ♡', sub: 'Welcome Master & Mistress! 🎀', icon: '☕' },
  { text: 'MOE MOE KYUN! 💖', sub: 'Delicious magic on your dice rolls!', icon: '🪄' },
  { text: 'WELCOME TO MOONLIGHT CAFÉ!', sub: 'Special Strawberry Parfait ready! 🍰', icon: '🍓' },
  { text: 'OKAIRINASAI MASE! ✨', sub: 'We saved the best table for you! 🌸', icon: '🥞' },
];

export const MaidCafe: React.FC = () => {
  const audio = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [greetIndex, setGreetIndex] = useState(0);
  const [greeting, setGreeting] = useState<typeof MAID_GREETINGS[0] | null>(null);

  const handleVisit = () => {
    audio.playCafeChime();
    setIsOpen(true);
    const nextGreet = MAID_GREETINGS[greetIndex];
    setGreeting(nextGreet);
    setGreetIndex((prev) => (prev + 1) % MAID_GREETINGS.length);

    setTimeout(() => {
      setIsOpen(false);
    }, 1200);

    setTimeout(() => {
      setGreeting(null);
    }, 3800);
  };

  return (
    <div
      className="relative group cursor-pointer select-none"
      onClick={handleVisit}
      title="Akiba Maid Café — Click to ring chime and visit Moonlight Café"
    >
      {/* Storefront Façade Housing */}
      <div className="relative w-16 h-18 sm:w-18 sm:h-20 flex flex-col items-center">
        {/* Striped Pink & White Awning Canopy */}
        <div className="relative w-full h-4 rounded-t-md overflow-hidden shadow flex">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`flex-1 h-full ${i % 2 === 0 ? 'bg-pink-500' : 'bg-white'}`}
            />
          ))}
        </div>

        {/* Café Header Signboard */}
        <div className="w-14 sm:w-16 h-3 bg-slate-950 border border-pink-400/80 shadow-md flex items-center justify-center px-1">
          <span className="text-[6px] font-mono font-black text-pink-300 tracking-wider truncate">
            ☕ MOONLIGHT CAFÉ ♡
          </span>
        </div>

        {/* Café Double Door Entrance */}
        <div className="relative w-14 sm:w-16 h-10 sm:h-11 bg-slate-900 border-x border-b border-pink-500/50 shadow-inner flex items-center justify-center p-0.5 overflow-hidden">
          {/* Warm Interior Café Lighting when door opens */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-amber-400/30 via-pink-400/20 to-transparent transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-20'
            }`}
          />

          {/* Cute Maid Silhouette Mascot at Entrance */}
          <div className={`relative flex flex-col items-center transition-transform duration-300 ${isOpen ? 'scale-110' : 'scale-95'}`}>
            {/* White Frilly Maid Headband */}
            <div className="w-4 h-1.5 rounded-t-full bg-white border border-pink-300 shadow-sm" />

            {/* Maid Silhouette Face */}
            <div className="w-3.5 h-3.5 rounded-full bg-amber-100 border border-pink-300 shadow-sm flex items-center justify-around px-0.5 -mt-0.5">
              <div className="w-0.5 h-0.5 rounded-full bg-slate-900" />
              <div className="w-0.5 h-0.5 rounded-full bg-slate-900" />
            </div>

            {/* Maid Uniform & Apron */}
            <div className="w-5 h-4 rounded-b-md bg-slate-900 border border-white flex flex-col items-center justify-between p-0.5 -mt-0.5">
              <div className="w-3 h-2 rounded-sm bg-white" />
              <div className="w-2 h-0.5 bg-pink-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Station Stencil */}
      <div className="text-center mt-[-2px]">
        <span className="text-[7.5px] font-mono font-bold tracking-wider text-slate-400 group-hover:text-pink-300 transition-colors uppercase">
          🎀 MAID CAFÉ
        </span>
      </div>

      {/* Maid Speech Bubble HUD (Anchored securely below right-aligned, 100% visible and unclipped) */}
      {greeting && (
        <div
          className="absolute top-full mt-1.5 right-0 whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-950/95 border border-pink-400/90 text-[9px] font-mono font-bold text-pink-300 shadow-2xl z-50 animate-fade-in pointer-events-auto backdrop-blur-md flex items-center gap-1.5 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[12px] shrink-0">{greeting.icon}</span>
          <div className="flex flex-col text-left">
            <span className="leading-tight text-pink-200">{greeting.text}</span>
            <span className="text-[7.5px] text-slate-300 font-sans leading-none mt-0.5">{greeting.sub}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setGreeting(null);
            }}
            className="ml-1.5 p-0.5 rounded text-pink-400/70 hover:text-white hover:bg-pink-950/60 transition shrink-0"
            title="Dismiss Maid Greeting"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
