import React, { useState, useEffect } from 'react';
import { useAudio } from '../../../../context/AudioContext';

const HOLOGRAPHIC_ADS = [
  {
    corp: 'NEXUS CORPORATION',
    tagline: 'BUILD TOMORROW.',
    accent: '#00F0FF',
    sub: 'QUANTUM ARCOLOGY INVESTMENTS',
  },
  {
    corp: 'NEURALINK DISTRICT',
    tagline: 'CONNECT YOUR WORLD.',
    accent: '#A855F7',
    sub: 'CYBERNETIC HOUSING UNITS',
  },
  {
    corp: 'NIGHT CITY TRANSIT',
    tagline: 'FASTER. SMARTER. AUTOMATED.',
    accent: '#F43F5E',
    sub: 'HIGH-SPEED SKY-MAGLEV PODS',
  },
  {
    corp: 'CYBERLIFE™',
    tagline: 'UPGRADE YOUR FUTURE.',
    accent: '#FDE047',
    sub: 'SYNTHETIC COMMERCE SUITES',
  },
  {
    corp: 'MEGACITY RESIDENCES',
    tagline: 'LIVE ABOVE THE GRID.',
    accent: '#38BDF8',
    sub: 'PENTHOUSE CLOUD ESTATES',
  },
];

export const HolographicBillboard: React.FC = () => {
  const audio = useAudio();
  const [adIndex, setAdIndex] = useState(0);

  // Auto-cycle advertisement every 6.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % HOLOGRAPHIC_ADS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const handleManualCycle = () => {
    audio.playBillboardPulseSound();
    setAdIndex((prev) => (prev + 1) % HOLOGRAPHIC_ADS.length);
  };

  const ad = HOLOGRAPHIC_ADS[adIndex];

  return (
    <button
      type="button"
      onClick={handleManualCycle}
      className="group relative flex flex-col items-center p-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/50 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 cursor-pointer backdrop-blur-md"
      title="HOLOGRAPHIC BILLBOARD — Click to cycle corporate broadcasts"
    >
      {/* Holographic Projection Frame */}
      <div
        className="w-24 h-9 sm:w-28 sm:h-10 rounded-lg bg-[#020510] border p-1 flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-300"
        style={{ borderColor: `${ad.accent}80` }}
      >
        {/* Holographic scanline overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent pointer-events-none animate-pulse" />

        {/* Corporate Title */}
        <div className="flex items-center justify-between w-full z-10 px-0.5">
          <span
            className="text-[6.5px] sm:text-[7px] font-mono font-black tracking-wider uppercase truncate"
            style={{ color: ad.accent }}
          >
            {ad.corp}
          </span>
          <div
            className="w-1.5 h-1.5 rounded-full animate-ping"
            style={{ backgroundColor: ad.accent }}
          />
        </div>

        {/* Main Headline */}
        <div className="text-[7.5px] sm:text-[8px] font-black text-slate-100 font-display leading-tight z-10 tracking-wide">
          {ad.tagline}
        </div>

        {/* Sub-text */}
        <div className="text-[5.5px] sm:text-[6px] font-mono text-slate-400 z-10 truncate w-full">
          {ad.sub}
        </div>
      </div>

      {/* Structural Support Legs */}
      <div className="flex items-center justify-between w-16 px-2 mt-0.5">
        <div className="w-1 h-1.5 bg-slate-700 rounded-b-xs" />
        <div className="w-1 h-1.5 bg-slate-700 rounded-b-xs" />
      </div>
    </button>
  );
};
