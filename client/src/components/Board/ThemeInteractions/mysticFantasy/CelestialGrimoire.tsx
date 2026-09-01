import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

const PROPHECIES = [
  'THE STARS FORETELL: A FORTUNATE TURN APPROACHES.',
  'ANCIENT RUNES WHISPER: GREAT WEALTH MAY CHANGE HANDS.',
  'THE CRYSTALS HAVE SPOKEN: YOUR PATH REMAINS UNCERTAIN.',
  'THE ARCANE WINDS SHIFT TOWARD THE REALM TOWERS.',
  'CELESTIAL HARMONY REIGNS OVER THE ENCHANTED REALM.',
  'THE ANCIENT TOME GLOWS: FATE FAVORS THE BOLD WANDERER.',
];

export const CelestialGrimoire: React.FC = () => {
  const audio = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [prophecy, setProphecy] = useState('');
  const [isTurningPages, setIsTurningPages] = useState(false);

  const handleOpenGrimoire = () => {
    audio.playGrimoireOpenSound();
    setIsTurningPages(true);
    setIsOpen(true);
    const randomProphecy = PROPHECIES[Math.floor(Math.random() * PROPHECIES.length)];
    setProphecy(randomProphecy);
    setTimeout(() => {
      setIsTurningPages(false);
    }, 700);
  };

  return (
    <div className="relative group flex items-end">
      {/* Physical Carved Lectern with Wizard NPC & Ancient Grimoire */}
      <button
        type="button"
        onClick={handleOpenGrimoire}
        className="relative flex items-end gap-1.5 p-1 rounded-2xl bg-slate-950/40 hover:bg-slate-900/60 border border-purple-900/40 hover:border-amber-400/80 transition-all duration-300 cursor-pointer backdrop-blur-xs"
        title="WIZARD'S CELESTIAL GRIMOIRE — Click to consult the ancient spellbook on its carved lectern"
      >
        {/* Wizard NPC Silhouette with Starry Robe & Crystal Staff */}
        <div className="flex flex-col items-center select-none">
          {/* Pointed Wizard Hat with Starlight Tip */}
          <div className="w-0 h-0 border-x-4 border-x-transparent border-b-8 border-b-indigo-950 relative">
            <div className="w-1 h-1 rounded-full bg-amber-300 absolute -top-1 -left-0.5 animate-ping" />
          </div>
          {/* Wizard Robe & Long White Beard */}
          <div className="w-5 h-6 bg-gradient-to-b from-indigo-900 to-slate-950 rounded-t-md border border-indigo-700/60 flex flex-col items-center justify-between relative p-0.5">
            <span className="text-[7px] text-amber-200">🧙‍♂️</span>
            <div className="w-2.5 h-1.5 bg-slate-100 rounded-b-full -mt-1" title="Wizard Beard" />
          </div>
        </div>

        {/* Ornate Wooden Lectern & Open Leather-Bound Spellbook */}
        <div className="flex flex-col items-center">
          {/* Flickering Candles atop Lectern */}
          <div className="flex justify-between w-full px-1 mb-0.5">
            <div className="flex flex-col items-center">
              <div className="w-1 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <div className="w-1 h-2 bg-amber-100" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-1 h-1.5 rounded-full bg-amber-400 animate-ping delay-150" />
              <div className="w-1 h-2 bg-amber-100" />
            </div>
          </div>

          {/* Ancient Leather-Bound Spellbook */}
          <div className="w-9 h-7 sm:w-10 sm:h-8 rounded-sm bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border border-amber-500/80 p-0.5 flex flex-col justify-between items-center shadow-md relative overflow-hidden">
            {/* Pages & Floating Runes */}
            <div className="w-full h-full bg-[#FEF3C7] rounded-xs border border-amber-600/40 p-0.5 flex items-center justify-around text-[9px]">
              <span className={`transition-transform duration-300 ${isTurningPages ? '-rotate-12 scale-110' : ''}`}>📜</span>
              <span className="text-[7px] font-serif font-black text-amber-900">ᚠ ᚱ</span>
            </div>

            {/* Glowing Golden Book Edge */}
            <div className="w-full h-0.5 bg-amber-400" />
          </div>

          {/* Carved Oak Lectern Pillar */}
          <div className="w-3 h-3 bg-amber-950 border-x border-amber-800" />
          <div className="w-6 h-1 bg-amber-950 rounded-full border border-amber-800" />
        </div>
      </button>

      {/* Diegetic Rolled Parchment Prophecy Ribbon */}
      {isOpen && (
        <div className="absolute left-full top-0 ml-2 z-40 w-52 sm:w-56 p-2.5 rounded-xl bg-amber-950/95 border-2 border-amber-500 shadow-2xl shadow-purple-950 text-left animate-in fade-in zoom-in-95 duration-150 pointer-events-auto">
          {/* Scroll Header */}
          <div className="flex items-center justify-between border-b border-amber-800 pb-1 mb-1.5">
            <div className="flex items-center gap-1">
              <span className="text-[9px]">✨</span>
              <span className="text-[8px] font-serif font-black text-amber-200 uppercase tracking-wider">
                CELESTIAL GRIMOIRE
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-amber-400 hover:text-amber-100 text-[9px] px-1 rounded"
              title="Close Tome"
            >
              ✕
            </button>
          </div>

          {isTurningPages ? (
            /* Page Turning Animation */
            <div className="py-1 font-serif text-center text-amber-300 text-[8px] italic animate-pulse">
              Turning ancient parchment pages...
            </div>
          ) : (
            /* Revealed In-World Prophecy */
            <div className="p-1.5 rounded-lg bg-amber-900/60 border border-amber-700/60 text-[8px] font-serif font-bold text-amber-100 leading-relaxed shadow-inner">
              "{prophecy}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
