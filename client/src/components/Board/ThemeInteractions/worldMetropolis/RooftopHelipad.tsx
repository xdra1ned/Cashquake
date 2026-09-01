import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

export const RooftopHelipad: React.FC = () => {
  const audio = useAudio();
  const [isActive, setIsActive] = useState(false);

  const handleHelipadClick = () => {
    audio.playHelipadBeacon();
    setIsActive(true);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleHelipadClick}
        className="group relative flex flex-col items-center p-1 rounded-xl bg-slate-950/80 border border-slate-700/60 hover:border-amber-400/80 transition-all duration-200 cursor-pointer backdrop-blur-md"
        title="ROOFTOP HELIPAD — Click to ping city airspace beacon"
      >
        {/* Helipad Platform */}
        <div className="w-10 h-8 sm:w-11 sm:h-9 rounded-lg bg-[#0C1420] border border-amber-500/40 p-1 flex flex-col justify-center items-center relative overflow-hidden group-hover:border-amber-300">
          {/* Helipad 'H' Landing Target */}
          <div className="w-6 h-6 rounded-full border-2 border-amber-400/70 flex items-center justify-center relative">
            <span className="text-[9px] font-black text-amber-300 font-mono leading-none">
              H
            </span>

            {/* Corner LED Beacons */}
            <div className={`absolute top-0 right-0 w-1 h-1 rounded-full ${isActive ? 'bg-red-400 animate-ping' : 'bg-red-500/80'}`} />
            <div className={`absolute bottom-0 left-0 w-1 h-1 rounded-full ${isActive ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500/80'}`} />
          </div>

          {/* Radar Sweep Effect */}
          {isActive && (
            <div className="absolute inset-0 bg-amber-400/10 rounded-lg animate-pulse pointer-events-none" />
          )}
        </div>

        {/* Building Roof Base */}
        <div className="w-8 h-1 bg-slate-800 rounded-full border border-slate-700 mt-0.5" />
      </button>

      {/* Airspace Telemetry Status (Downward positioning for zero clipping) */}
      {isActive && (
        <div className="absolute top-full right-0 mt-1.5 z-40 w-44 p-2 rounded-xl bg-slate-950/98 border border-amber-400 shadow-2xl backdrop-blur-md text-left animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-[7px] font-mono text-amber-300 font-bold border-b border-slate-800 pb-1">
            <span>🚁 AIRSPACE TELEMETRY</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsActive(false);
              }}
              className="text-slate-400 hover:text-white text-[9px] px-1 rounded hover:bg-slate-800"
            >
              ✕
            </button>
          </div>
          <div className="text-[8.5px] font-black text-emerald-300 mt-1 font-display">
            HELIPAD 01: CLEARED
          </div>
          <div className="text-[7px] font-mono text-slate-400 mt-0.5">
            VISIBILITY: UNLIMITED • 1013 HPA
          </div>
        </div>
      )}
    </div>
  );
};
