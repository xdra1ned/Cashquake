import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

export const SurveillanceDrone: React.FC = () => {
  const audio = useAudio();
  const [isScanned, setIsScanned] = useState(false);

  const handleDroneClick = () => {
    audio.playDroneScanSound();
    setIsScanned(true);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleDroneClick}
        className="group relative flex flex-col items-center p-1 rounded-xl bg-slate-950/90 border border-rose-500/50 hover:border-rose-400 transition-all duration-200 cursor-pointer backdrop-blur-md"
        title="SURVEILLANCE DRONE — Click to ping autonomous patrol unit"
      >
        {/* Drone Body Frame with gentle hover float */}
        <div className="w-10 h-8 sm:w-11 sm:h-9 rounded-lg bg-[#0C0612] border border-rose-500/50 p-1 flex flex-col justify-center items-center relative overflow-hidden group-hover:border-rose-400">
          {/* Drone Rotors & Central Sensor Eye */}
          <div className="w-6 h-6 rounded-full border border-rose-400/60 flex items-center justify-center relative">
            <span className="text-[9px] font-black text-rose-300 font-mono leading-none">
              👁️
            </span>

            {/* Corner LED Beacons */}
            <div className={`absolute top-0 right-0 w-1 h-1 rounded-full ${isScanned ? 'bg-cyan-400 animate-ping' : 'bg-rose-500'}`} />
            <div className={`absolute bottom-0 left-0 w-1 h-1 rounded-full ${isScanned ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
          </div>

          {/* Scanning Beam Sweep */}
          <div className="absolute inset-0 bg-rose-500/10 rounded-lg animate-pulse pointer-events-none" />
        </div>

        {/* Shadow / Base */}
        <div className="w-6 h-1 bg-slate-800 rounded-full border border-rose-900/40 mt-0.5" />
      </button>

      {/* Drone Patrol Telemetry Toast */}
      {isScanned && (
        <div className="absolute top-full right-0 mt-1.5 z-40 w-44 p-2 rounded-xl bg-slate-950/98 border border-rose-400 shadow-2xl backdrop-blur-md text-left animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-[7px] font-mono text-rose-300 font-bold border-b border-slate-800 pb-1">
            <span>🛸 PATROL DRONE 07</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsScanned(false);
              }}
              className="text-slate-400 hover:text-white text-[9px] px-1 rounded hover:bg-slate-800"
            >
              ✕
            </button>
          </div>
          <div className="text-[8.5px] font-black text-cyan-300 mt-1 font-display">
            PATROL: CENTRAL DISTRICT
          </div>
          <div className="text-[7px] font-mono text-emerald-400 mt-0.5">
            THREAT LEVEL: NOMINAL
          </div>
        </div>
      )}
    </div>
  );
};
