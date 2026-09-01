import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

const SECURITY_LEVELS = [
  { level: 'PUBLIC ACCESS', status: 'BIOMETRIC VERIFIED', clearance: 'LEVEL 1 — TRANSIT & COMMERCE' },
  { level: 'RESIDENT ACCESS', status: 'LATTICE KEY CONFIRMED', clearance: 'LEVEL 2 — ARCOLOGY SUITES' },
  { level: 'CORP CLEARANCE', status: 'QUANTUM TOKEN VALID', clearance: 'LEVEL 3 — FINANCIAL SECTOR' },
];

export const SecurityAccessPanel: React.FC = () => {
  const audio = useAudio();
  const [levelIndex, setLevelIndex] = useState(0);
  const [isToastVisible, setIsToastVisible] = useState(false);

  const handleScanClick = () => {
    audio.playSecurityScanSound();
    setLevelIndex((prev) => (prev + 1) % SECURITY_LEVELS.length);
    setIsToastVisible(true);
  };

  const sec = SECURITY_LEVELS[levelIndex];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleScanClick}
        className="group relative flex flex-col items-center p-1.5 rounded-xl bg-slate-950/90 border border-purple-500/50 hover:border-cyan-400 transition-all duration-200 cursor-pointer backdrop-blur-md"
        title="SECURITY ACCESS PANEL — Click to test biometric identity scan"
      >
        {/* Terminal Housing */}
        <div className="w-11 h-8 sm:w-12 sm:h-9 rounded-lg bg-[#050614] border border-purple-400/60 p-1 flex flex-col justify-between items-center relative overflow-hidden group-hover:border-cyan-300">
          {/* Biometric Fingerprint / Keypad Graphic */}
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-xs bg-purple-500/30 border border-purple-400 flex items-center justify-center text-[7px] text-cyan-300 leading-none">
              🔒
            </div>
            <span className="text-[6.5px] font-mono font-black text-purple-300 tracking-wider">
              ACCESS
            </span>
          </div>

          {/* Glowing Keypad Grid */}
          <div className="w-full flex justify-center gap-1">
            <div className="w-1.5 h-1.5 rounded-xs bg-cyan-400/80 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-xs bg-purple-400/80" />
            <div className="w-1.5 h-1.5 rounded-xs bg-emerald-400/80" />
          </div>

          {/* Under-panel laser bar */}
          <div className="w-full h-0.5 bg-purple-400/60 animate-pulse" />
        </div>

        {/* Base */}
        <div className="w-8 h-1 bg-slate-800 rounded-full border border-purple-900/60 mt-0.5" />
      </button>

      {/* Security Readout Toast (Downward positioning for zero clipping) */}
      {isToastVisible && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-40 w-48 sm:w-52 p-2 rounded-xl bg-slate-950/98 border border-purple-400 shadow-2xl backdrop-blur-md text-left animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-[7px] font-mono text-purple-300 font-bold border-b border-slate-800 pb-1">
            <span>🛡️ SECURITY TERMINAL</span>
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-400 font-bold">{sec.level}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsToastVisible(false);
                }}
                className="text-slate-400 hover:text-white text-[9px] px-1 rounded hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="text-[8.5px] font-black text-emerald-300 mt-1 leading-tight font-display">
            {sec.status}
          </div>
          <div className="text-[7.5px] font-mono text-slate-300 mt-0.5">
            {sec.clearance}
          </div>
        </div>
      )}
    </div>
  );
};
