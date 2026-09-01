import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

const PROJECTION_MODES = [
  { label: 'PLANETARY SYSTEM', icon: '🪐', color: '#38BDF8' },
  { label: 'ASTEROID BELT // SECTOR 7', icon: '☄️', color: '#F59E0B' },
  { label: 'LUNAR ORBITAL TRAJECTORY', icon: '🌔', color: '#C084FC' },
  { label: 'DEEP SPACE EXPLORATION ROUTE', icon: '🌌', color: '#34D399' },
];

export const PlanetariumHologram: React.FC = () => {
  const { playPlanetariumRotateSound } = useAudio();
  const [modeIndex, setModeIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const handleCycle = () => {
    playPlanetariumRotateSound();
    setIsRotating(true);
    setModeIndex((prev) => (prev + 1) % PROJECTION_MODES.length);

    setTimeout(() => {
      setIsRotating(false);
    }, 600);
  };

  const currentMode = PROJECTION_MODES[modeIndex];

  return (
    <div className="relative group cursor-pointer select-none" onClick={handleCycle} title="Holographic Star Chart Projector — Click to cycle astronomical charts">
      <div className="relative w-22 h-20 sm:w-26 sm:h-22 flex flex-col items-center justify-center">
        {/* Holographic Projection Emitter Field */}
        <div className="relative w-14 h-12 flex items-center justify-center">
          {/* Orbital Projection Rings */}
          <div
            className={`absolute inset-0 rounded-full border border-dashed transition-transform duration-700 ${
              isRotating ? 'rotate-180 scale-110' : ''
            }`}
            style={{ borderColor: `${currentMode.color}80` }}
          />
          <div
            className="absolute inset-1.5 rounded-full border transition-transform duration-500"
            style={{ borderColor: `${currentMode.color}40`, transform: isRotating ? 'rotate(-90deg)' : 'rotate(45deg)' }}
          />

          {/* Central Projected Celestial Body Icon */}
          <span className={`text-base transition-transform duration-300 ${isRotating ? 'scale-125' : 'scale-100'}`}>
            {currentMode.icon}
          </span>

          <div
            className="absolute -bottom-1 w-10 h-6 opacity-30 pointer-events-none rounded-b-full"
            style={{ background: `linear-gradient(to top, ${currentMode.color}66, transparent)` }}
          />
        </div>

        {/* Physical Sunken Astrolabe Console Base */}
        <div className="relative w-18 h-4 rounded-full bg-slate-950 border border-slate-700 shadow-xl flex items-center justify-around px-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="w-8 h-1 rounded-full bg-slate-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
        </div>

        {/* In-World Projected Chart Tag */}
        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-lg bg-slate-950/95 border text-[8.5px] font-mono font-bold shadow-2xl z-50 pointer-events-none backdrop-blur-md"
             style={{ borderColor: `${currentMode.color}90`, color: currentMode.color }}>
          <span>{currentMode.label}</span>
        </div>
      </div>

      {/* Station Stencil */}
      <div className="text-center mt-[-4px]">
        <span className="text-[8px] font-mono font-bold tracking-wider text-slate-400 group-hover:text-sky-300 transition-colors uppercase">
          🪐 STAR CHART NAV
        </span>
      </div>
    </div>
  );
};
