import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAudio } from '../../../../context/AudioContext';

interface AnimeAd {
  title: string;
  tagline: string;
  genre: string;
  color: string;
  accent: string;
  icon: string;
}

const ADS: AnimeAd[] = [
  {
    title: 'STARLIGHT☆IDOL',
    tagline: 'LIVE AT AKIBA DOME! 🎤✨',
    genre: 'Idol Symphony',
    color: '#ec4899',
    accent: '#fbbf24',
    icon: '🌟',
  },
  {
    title: 'NEON HEARTS',
    tagline: 'PREMIERES THIS FRIDAY! 💖⚡',
    genre: 'Cyber Romance',
    color: '#06b6d4',
    accent: '#f472b6',
    icon: '💕',
  },
  {
    title: 'MAGICAL ACADEMY',
    tagline: 'NEW SEASON STREAMING! 🪄🔮',
    genre: 'Spellbound Fantasy',
    color: '#8b5cf6',
    accent: '#fde047',
    icon: '✨',
  },
  {
    title: 'TOKYO MECHA 01',
    tagline: 'THE ULTIMATE CLASH! 🤖💥',
    genre: 'Sci-Fi Action',
    color: '#ef4444',
    accent: '#38bdf8',
    icon: '⚔️',
  },
  {
    title: 'MOONLIGHT CAFÉ',
    tagline: 'DELICIOUS PARFAITS & TEA! 🍰☕',
    genre: 'Slice of Life',
    color: '#f43f5e',
    accent: '#a855f7',
    icon: '🎀',
  },
  {
    title: 'AKIBA BATTLE FEST',
    tagline: 'ARCADE CHAMPIONSHIP! 🕹️🏆',
    genre: 'Esports Anime',
    color: '#f59e0b',
    accent: '#10b981',
    icon: '🔥',
  },
];

export const AnimeBillboard: React.FC = () => {
  const audio = useAudio();
  const [adIndex, setAdIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showHUD, setShowHUD] = useState(false);

  const currentAd = ADS[adIndex];

  const cycleAd = () => {
    audio.playAnimeBillboardSound();
    setIsTransitioning(true);
    setShowHUD(true);
    setAdIndex((prev) => (prev + 1) % ADS.length);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 400);

    setTimeout(() => {
      setShowHUD(false);
    }, 3500);
  };

  return (
    <div
      className="relative group cursor-pointer select-none"
      onClick={cycleAd}
      title="Giant Anime Billboard — Click to cycle featured anime advertisements"
    >
      {/* Scaffolding Frame & Billboard Housing */}
      <div className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-lg bg-slate-950/95 border-2 border-slate-700 shadow-xl overflow-hidden group-hover:border-pink-400 transition-colors">
        {/* Top Scaffolding Lamps */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-800 flex justify-around items-center px-1">
          <div className="w-1 h-1 rounded-full bg-pink-400 animate-pulse" />
          <div className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
          <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        {/* Screen Display Area */}
        <div
          className={`w-full h-full pt-2 px-1.5 pb-1 flex flex-col justify-between items-center transition-all duration-300 ${
            isTransitioning ? 'scale-95 opacity-50 blur-[1px]' : 'scale-100 opacity-100'
          }`}
          style={{
            background: `linear-gradient(135deg, #090314 0%, ${currentAd.color}22 100%)`,
          }}
        >
          {/* Top Marquee Header */}
          <div className="w-full flex items-center justify-between px-0.5">
            <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider" style={{ color: currentAd.accent }}>
              {currentAd.genre}
            </span>
            <span className="text-[9px] leading-none">{currentAd.icon}</span>
          </div>

          {/* Featured Anime Title */}
          <div className="text-center w-full">
            <span
              className="text-[9.5px] sm:text-[10.5px] font-extrabold font-display tracking-tight leading-tight block truncate drop-shadow"
              style={{ color: currentAd.color }}
            >
              {currentAd.title}
            </span>
            <span className="text-[7px] font-sans text-slate-300 leading-none block truncate mt-0.5 opacity-90">
              {currentAd.tagline}
            </span>
          </div>

          {/* Bottom LED ticker */}
          <div className="w-full flex items-center justify-between border-t border-white/10 pt-0.5">
            <span className="text-[6.5px] font-mono text-slate-400">秋葉原ビジョン</span>
            <div className="flex gap-0.5">
              {ADS.map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-1 rounded-full transition-all ${
                    i === adIndex ? 'bg-pink-400 scale-125' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Diegetic Label */}
      <div className="text-center mt-0.5">
        <span className="text-[7.5px] font-mono font-bold tracking-wider text-slate-400 group-hover:text-pink-300 transition-colors uppercase">
          📺 ANIME BILLBOARD
        </span>
      </div>

      {/* Floating In-World Advertisement Info HUD (Anchored below, 100% visible and unclipped) */}
      {showHUD && (
        <div
          className="absolute top-full mt-1.5 left-0 whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-950/95 border text-[9px] font-mono font-bold shadow-2xl z-50 animate-fade-in pointer-events-auto backdrop-blur-md flex items-center gap-1.5 cursor-default"
          style={{ borderColor: `${currentAd.color}90`, color: currentAd.color }}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-ping shrink-0" style={{ backgroundColor: currentAd.color }} />
          <span className="truncate max-w-[200px] sm:max-w-[260px]">{currentAd.title}: {currentAd.tagline}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowHUD(false);
            }}
            className="ml-1 p-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
            title="Dismiss Announcement"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
