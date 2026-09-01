import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

export const FirewallSecurityGate: React.FC = () => {
  const audio = useAudio();
  const [isOverridden, setIsOverridden] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  const handleGateClick = () => {
    audio.playSecurityScanSound();
    setIsOverridden(true);
    setShowStatus(true);
    setTimeout(() => setIsOverridden(false), 1200);
  };

  return (
    <div className="relative group">
      {/* Ground-Level Firewall Security Barrier */}
      <button
        type="button"
        onClick={handleGateClick}
        className="relative flex flex-col items-center p-1 rounded-xl bg-slate-950/90 border border-rose-500/60 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-200 cursor-pointer backdrop-blur-md"
        title="FIREWALL SECURITY GATE — Click to trigger quantum override"
      >
        {/* Laser Grid Barrier */}
        <div className="w-10 h-9 sm:w-11 sm:h-10 rounded-lg bg-[#0C040E] border border-rose-400/60 p-1 flex flex-col justify-between items-center relative overflow-hidden group-hover:border-cyan-300">
          {/* Top Warning Badge */}
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${isOverridden ? 'bg-cyan-400' : 'bg-rose-500'} animate-pulse`} />
            <span className={`text-[6px] font-mono font-black ${isOverridden ? 'text-cyan-300' : 'text-rose-300'} tracking-wider`}>
              {isOverridden ? 'GRANTED' : 'SECURE'}
            </span>
          </div>

          {/* 3 Vertical Laser Containment Beams */}
          <div className="w-full flex justify-center gap-1.5 py-0.5">
            <div className={`w-0.5 h-3 ${isOverridden ? 'bg-cyan-400 shadow-cyan-400' : 'bg-rose-500 shadow-rose-500'} shadow-sm rounded-full`} />
            <div className={`w-0.5 h-3 ${isOverridden ? 'bg-cyan-300 shadow-cyan-300' : 'bg-rose-400 shadow-rose-400'} shadow-sm rounded-full`} />
            <div className={`w-0.5 h-3 ${isOverridden ? 'bg-cyan-400 shadow-cyan-400' : 'bg-rose-500 shadow-rose-500'} shadow-sm rounded-full`} />
          </div>

          {/* Ground Contact Line */}
          <div className={`w-full h-0.5 ${isOverridden ? 'bg-cyan-400' : 'bg-rose-500'}`} />
        </div>

        {/* Concrete Pavement Mount */}
        <div className="w-8 h-1 bg-slate-800 rounded-full border border-slate-700 mt-0.5" />
      </button>

      {/* Upward In-World Holographic Security HUD */}
      {showStatus && (
        <div className="absolute left-full bottom-0 ml-2 z-40 w-48 sm:w-52 p-2.5 rounded-2xl bg-slate-950/98 border-2 border-rose-400 shadow-2xl shadow-rose-500/30 backdrop-blur-md text-left animate-in fade-in zoom-in-95 duration-150 pointer-events-auto">
          <div className="flex items-center justify-between border-b border-rose-900/80 pb-1 mb-1.5">
            <span className="text-[7.5px] font-mono font-black text-rose-300 uppercase tracking-wider">
              🛡️ FIREWALL NODE
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
            OVERRIDE: AUTHENTICATED
          </div>
          <div className="text-[7.5px] font-mono text-emerald-400 mt-0.5">
            ACCESS: SECTOR 07 CLEAR
          </div>
        </div>
      )}
    </div>
  );
};
