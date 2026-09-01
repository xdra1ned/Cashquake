import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

const DOCKING_STATUSES = [
  'DOCKING CLAMPS: SECURED',
  'AIRLOCK PRESSURIZED // 1.0 ATM',
  'CARGO TRANSFER IN PROGRESS',
  'ORBITAL SHUTTLE // CLEARED',
];

export const DockingBay: React.FC = () => {
  const { playDockingClampSound } = useAudio();
  const [isClamped, setIsClamped] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleDock = () => {
    playDockingClampSound();
    setIsClamped(true);

    const nextStatus = DOCKING_STATUSES[Math.floor(Math.random() * DOCKING_STATUSES.length)];
    setStatusMsg(nextStatus);

    setTimeout(() => {
      setIsClamped(false);
    }, 1500);

    setTimeout(() => {
      setStatusMsg(null);
    }, 4200);
  };

  return (
    <div className="relative group cursor-pointer select-none" onClick={handleDock} title="Orbital Docking Bay — Click to cycle docking clamps & shuttle lock">
      <div className="relative w-24 h-20 sm:w-28 sm:h-22 flex items-center justify-center">
        {/* Docking Guide Rail Platform Base */}
        <div className="absolute inset-x-1 bottom-2 h-7 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-lg flex items-center justify-between px-2 overflow-hidden">
          {/* Guide Rail Track lines */}
          <div className="w-full h-1 bg-slate-800 border-t border-b border-amber-500/30 flex justify-around">
            <div className="w-1 h-full bg-amber-400 animate-pulse" />
            <div className="w-1 h-full bg-amber-400 animate-pulse" />
          </div>

          {/* Left Mechanical Clamp Arm */}
          <div
            className={`absolute left-1.5 top-1 bottom-1 w-2.5 rounded-sm bg-gradient-to-r from-amber-600 to-amber-400 border border-amber-300 shadow transition-transform duration-300 ${
              isClamped ? 'translate-x-2 scale-110' : ''
            }`}
          />

          {/* Right Mechanical Clamp Arm */}
          <div
            className={`absolute right-1.5 top-1 bottom-1 w-2.5 rounded-sm bg-gradient-to-l from-amber-600 to-amber-400 border border-amber-300 shadow transition-transform duration-300 ${
              isClamped ? '-translate-x-2 scale-110' : ''
            }`}
          />
        </div>

        {/* Docked Exploration Shuttle Craft */}
        <div
          className={`relative z-10 transition-transform duration-500 flex flex-col items-center ${
            isClamped ? 'translate-y-0.5 scale-95' : '-translate-y-1'
          }`}
        >
          {/* Shuttle Nosecone & Fuselage */}
          <div className="relative w-8 h-10 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 border border-slate-500 rounded-t-full shadow-xl flex flex-col items-center">
            {/* Cockpit Visor Glass */}
            <div className="w-4 h-2.5 bg-sky-900 border border-cyan-400 rounded-t-full mt-1.5 shadow-inner" />
            {/* Thermal Tiles */}
            <div className="w-5 h-2 border-t border-slate-700 mt-1" />
            {/* Navigation Strobe on Nose */}
            <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          </div>

          {/* Delta Wings & Wingtip Beacons */}
          <div className="w-14 h-3 -mt-3 bg-slate-400 border border-slate-600 rounded flex justify-between px-0.5 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-sm shadow-red-500" />
            <div className="w-4 h-1.5 bg-slate-800 rounded-sm" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500" />
          </div>
        </div>

        {/* Docking Status Alert Pill */}
        {statusMsg && (
          <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-950/95 border border-amber-400/90 text-[9px] font-mono font-bold text-amber-300 shadow-2xl z-50 animate-fade-in pointer-events-none backdrop-blur-md">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mr-1 animate-ping" />
            <span>{statusMsg}</span>
          </div>
        )}
      </div>

      {/* Station Stencil */}
      <div className="text-center mt-[-4px]">
        <span className="text-[8px] font-mono font-bold tracking-wider text-slate-400 group-hover:text-amber-300 transition-colors uppercase">
          🚀 DOCKING BAY 07
        </span>
      </div>
    </div>
  );
};
