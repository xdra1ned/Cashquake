import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

export const StreetDataPort: React.FC = () => {
  const audio = useAudio();
  const [isPulsing, setIsPulsing] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  const handleClick = () => {
    audio.playCyberTransitSound();
    setIsPulsing(true);
    setShowStatus(true);
    setTimeout(() => setIsPulsing(false), 600);
  };

  return (
    <div className="relative group">
      {/* Street-Level Fiber Terminal */}
      <button
        type="button"
        onClick={handleClick}
        className="relative flex flex-col items-center p-1 rounded-xl bg-slate-950/90 border border-cyan-500/60 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-200 cursor-pointer backdrop-blur-md"
        title="STREET-LEVEL DATA PORT — Click to pulse transit telemetry"
      >
        {/* Hexagonal Port Core */}
        <div className="w-10 h-9 sm:w-11 sm:h-10 rounded-lg bg-[#040B18] border border-cyan-400/60 p-1 flex flex-col justify-between items-center relative overflow-hidden group-hover:border-cyan-300">
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full bg-cyan-400 ${isPulsing ? 'animate-ping' : 'animate-pulse'}`} />
            <span className="text-[6px] font-mono font-black text-cyan-300 tracking-wider">
              TRANSIT
            </span>
          </div>

          {/* Transit Symbol */}
          <div className="text-[9px] text-cyan-300 leading-none">🚝</div>

          {/* Road Contact Line */}
          <div className="w-full h-0.5 bg-cyan-400/80" />
        </div>

        {/* Road Surface Mount */}
        <div className="w-8 h-1 bg-slate-800 rounded-full border border-slate-700 mt-0.5" />
      </button>

      {/* Upward In-World Transit HUD */}
      {showStatus && (
        <div className="absolute right-full bottom-0 mr-2 z-40 w-48 sm:w-52 p-2.5 rounded-2xl bg-slate-950/98 border-2 border-cyan-400 shadow-2xl shadow-cyan-500/30 backdrop-blur-md text-left animate-in fade-in zoom-in-95 duration-150 pointer-events-auto">
          <div className="flex items-center justify-between border-b border-cyan-900/80 pb-1 mb-1.5">
            <span className="text-[7.5px] font-mono font-black text-cyan-300 uppercase tracking-wider">
              🚝 TRANSIT HUB 04
            </span>
            <button
              type="button"
              onClick={() => setShowStatus(false)}
              className="text-slate-400 hover:text-white text-[9px] px-1 rounded hover:bg-slate-800"
            >
              ✕
            </button>
          </div>
          <div className="text-[8px] font-black text-cyan-300 font-display">
            MAGLEV LINE A: 02 MIN
          </div>
          <div className="text-[7.5px] font-mono text-emerald-400 mt-0.5">
            DESTINATION: NEXUS PRIME
          </div>
        </div>
      )}
    </div>
  );
};
