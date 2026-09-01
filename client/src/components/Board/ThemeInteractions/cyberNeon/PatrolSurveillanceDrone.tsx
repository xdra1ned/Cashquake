import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

export const PatrolSurveillanceDrone: React.FC = () => {
  const audio = useAudio();
  const [isScanning, setIsScanning] = useState(false);
  const [showScanHud, setShowScanHud] = useState(false);

  const handleDroneClick = () => {
    audio.playDroneScanSound();
    setIsScanning(true);
    setShowScanHud(true);
    setTimeout(() => setIsScanning(false), 800);
  };

  return (
    <div className="relative group flex flex-col items-center">
      {/* Hovering Surveillance Unit in Airspace */}
      <button
        type="button"
        onClick={handleDroneClick}
        className="relative flex flex-col items-center p-1 rounded-xl bg-slate-950/80 border border-rose-500/50 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-500/30 transition-all duration-200 cursor-pointer backdrop-blur-md animate-float"
        title="PATROL SURVEILLANCE DRONE — Click to trigger biometric scan sweep"
      >
        {/* Drone Hull & Rotors */}
        <div className="w-11 h-8 sm:w-12 sm:h-9 rounded-lg bg-[#0E0614] border border-rose-400/60 p-1 flex flex-col justify-center items-center relative overflow-hidden group-hover:border-rose-300">
          {/* Dual Thruster Pods */}
          <div className="w-full flex items-center justify-between px-0.5 pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 animate-ping" />
            {/* Center Sensor Turret */}
            <div className="w-4 h-4 rounded-full border border-rose-400/80 flex items-center justify-center bg-rose-950/50">
              <span className="text-[7.5px] font-black text-rose-300">👁️</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400/80 animate-ping" />
          </div>

          {/* Laser Scanner Emitter Bar */}
          <div className="w-full h-0.5 bg-rose-400/80 mt-1" />
        </div>

        {/* Downward Laser Beam Projection during Scan */}
        {isScanning && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-16 h-8 bg-gradient-to-b from-rose-500/40 via-rose-500/10 to-transparent pointer-events-none animate-pulse" />
        )}
      </button>

      {/* Downward In-World Laser Scan HUD */}
      {showScanHud && (
        <div className="absolute top-full mt-2 z-40 w-48 sm:w-52 p-2.5 rounded-2xl bg-slate-950/98 border-2 border-rose-400 shadow-2xl shadow-rose-500/30 backdrop-blur-md text-left animate-in fade-in zoom-in-95 duration-150 pointer-events-auto">
          <div className="flex items-center justify-between border-b border-rose-900/80 pb-1 mb-1.5">
            <span className="text-[7.5px] font-mono font-black text-rose-300 uppercase tracking-wider">
              🛸 DRONE UNIT 07
            </span>
            <button
              type="button"
              onClick={() => setShowScanHud(false)}
              className="text-slate-400 hover:text-white text-[9px] px-1 rounded hover:bg-slate-800"
            >
              ✕
            </button>
          </div>
          <div className="text-[8px] font-black text-cyan-300 font-display">
            IDENTITY: VERIFIED
          </div>
          <div className="text-[7.5px] font-mono text-emerald-400 mt-0.5">
            PATROL: CENTRAL • THREAT: ZERO
          </div>
        </div>
      )}
    </div>
  );
};
