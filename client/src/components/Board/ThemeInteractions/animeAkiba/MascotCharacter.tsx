import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAudio } from '../../../../context/AudioContext';

const MASCOT_LINES = [
  { text: 'WELCOME TO AKIBA! ✨', sub: 'Let’s roll big and conquer the district! 🌸', icon: '🐾' },
  { text: 'LET’S HAVE SOME FUN! 💖', sub: 'Sending you lucky dice energy! 🎲', icon: '✨' },
  { text: 'BIG DREAMS, BIG CITY! 💰', sub: 'Buy the block, own the wonderland! 🗼', icon: '⭐' },
  { text: 'NYA~ DOUBLE 6 COMING UP! 🍀', sub: 'May the fortune cat bless your turn! 🐱', icon: '🎀' },
];

export const MascotCharacter: React.FC = () => {
  const audio = useAudio();
  const [lineIdx, setLineIdx] = useState(0);
  const [isWaving, setIsWaving] = useState(false);
  const [dialogue, setDialogue] = useState<typeof MASCOT_LINES[0] | null>(null);

  const handleMascotClick = () => {
    audio.playSparkleChime();
    setIsWaving(true);
    const nextLine = MASCOT_LINES[lineIdx];
    setDialogue(nextLine);
    setLineIdx((prev) => (prev + 1) % MASCOT_LINES.length);

    setTimeout(() => {
      setIsWaving(false);
    }, 800);

    setTimeout(() => {
      setDialogue(null);
    }, 3800);
  };

  return (
    <div
      className="relative group cursor-pointer select-none"
      onClick={handleMascotClick}
      title="District Mascot Kira-chan — Click to wave and hear mascot greetings"
    >
      {/* Mascot Character Avatar Container */}
      <div className="relative w-14 h-16 sm:w-16 sm:h-18 flex flex-col items-center justify-center">
        {/* Animated Chibi Neko Mascot Figure */}
        <div className={`relative flex flex-col items-center transition-transform duration-300 ${isWaving ? 'scale-115 rotate-3' : 'hover:scale-105'}`}>
          {/* Cat Ears */}
          <div className="w-9 sm:w-10 flex justify-between px-0.5 -mb-1">
            <div className="w-3 h-3 rounded-tl-full bg-pink-500 border border-pink-300 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-tl-full bg-pink-200" />
            </div>
            <div className="w-3 h-3 rounded-tr-full bg-pink-500 border border-pink-300 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-tr-full bg-pink-200" />
            </div>
          </div>

          {/* Chibi Head */}
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-b from-amber-100 to-amber-200 border-2 border-pink-400 shadow-md flex flex-col items-center justify-center px-1">
            {/* Sparkly Anime Eyes */}
            <div className="w-full flex justify-around items-center pt-0.5">
              <div className="w-2 h-2.5 rounded-full bg-purple-900 border border-pink-400 flex items-start justify-end pr-0.5">
                <div className="w-0.5 h-0.5 rounded-full bg-white" />
              </div>
              <div className="w-2 h-2.5 rounded-full bg-purple-900 border border-pink-400 flex items-start justify-end pr-0.5">
                <div className="w-0.5 h-0.5 rounded-full bg-white" />
              </div>
            </div>

            {/* Rosy Cheeks */}
            <div className="w-full flex justify-between px-1 -mt-0.5">
              <div className="w-1.5 h-0.5 rounded-full bg-pink-400 opacity-80" />
              <div className="w-1.5 h-0.5 rounded-full bg-pink-400 opacity-80" />
            </div>

            {/* Cute Cat Mouth */}
            <span className="text-[5px] leading-none text-slate-800 font-bold">ω</span>
          </div>

          {/* Bell Collar & Outfit */}
          <div className="w-6 h-5 rounded-b-lg bg-pink-600 border border-pink-300 shadow flex flex-col items-center justify-between p-0.5 -mt-1">
            {/* Golden Jingle Bell */}
            <div className="w-2 h-2 rounded-full bg-amber-400 border border-amber-600 shadow-sm flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-slate-900" />
            </div>
            {/* White paws */}
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Station Stencil */}
      <div className="text-center mt-[-4px]">
        <span className="text-[7.5px] font-mono font-bold tracking-wider text-slate-400 group-hover:text-pink-300 transition-colors uppercase">
          🐱 KIRA-CHAN
        </span>
      </div>

      {/* Mascot Speech Dialogue Bubble (Anchored securely above popping into arena center, 100% visible and unclipped) */}
      {dialogue && (
        <div
          className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-950/95 border border-pink-400/90 text-[9px] font-mono font-bold text-pink-300 shadow-2xl z-50 animate-fade-in pointer-events-auto backdrop-blur-md flex items-center gap-1.5 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[12px] shrink-0">{dialogue.icon}</span>
          <div className="flex flex-col text-left">
            <span className="leading-tight text-pink-200">{dialogue.text}</span>
            <span className="text-[7.5px] text-slate-300 font-sans leading-none mt-0.5">{dialogue.sub}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDialogue(null);
            }}
            className="ml-1.5 p-0.5 rounded text-pink-400/70 hover:text-white hover:bg-pink-950/60 transition shrink-0"
            title="Dismiss Dialogue"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
