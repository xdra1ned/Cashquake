import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

const CYBER_TRANSIT_DESTINATIONS = [
  { dest: 'NEXUS DISTRICT', time: 'NEXT MAGLEV — 03 MIN', rail: 'SKY-TRACK 01' },
  { dest: 'NEON MARKET', time: 'POD ARRIVING — 07 MIN', rail: 'SKY-TRACK 02' },
  { dest: 'CORPORATE SECTOR', time: 'EXPRESS COMMUTE — 12 MIN', rail: 'HIGH-SPEED LINE' },
  { dest: 'LOWER CITY', time: 'TRANSIT LOOP — 18 MIN', rail: 'SUB-SECTOR 04' },
];

export const CyberTransitTerminal: React.FC = () => {
  const audio = useAudio();
  const [destIndex, setDestIndex] = useState(0);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const handleTransitClick = () => {
    audio.playCyberTransitSound();
    setDestIndex((prev) => (prev + 1) % CYBER_TRANSIT_DESTINATIONS.length);
    setIsAlertVisible(true);
  };

  const item = CYBER_TRANSIT_DESTINATIONS[destIndex];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleTransitClick}
        className="group relative flex flex-col items-center p-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/50 hover:border-cyan-300 transition-all duration-200 cursor-pointer backdrop-blur-md"
        title="CYBER TRANSIT TERMINAL — Click to inspect autonomous maglev transit lines"
      >
        {/* Transit Canopy Housing */}
        <div className="w-11 h-8 sm:w-12 sm:h-9 rounded-lg bg-[#03091A] border border-cyan-400/60 p-1 flex flex-col justify-between items-center relative overflow-hidden group-hover:border-cyan-300">
          {/* Maglev Pod Silhouette */}
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-xs bg-cyan-400 flex items-center justify-center text-[7px] font-black text-slate-950 leading-none">
              ▲
            </div>
            <span className="text-[6.5px] font-mono font-black text-cyan-300 tracking-wider">
              MAGLEV
            </span>
          </div>

          {/* Elevated Rail Line Graphic */}
          <div className="w-full h-1 bg-cyan-900/60 rounded-xs border-t border-cyan-400/40 relative">
            <div className="w-2.5 h-0.5 bg-cyan-300 rounded-full animate-pulse mx-auto" />
          </div>

          {/* Under-glow */}
          <div className="w-full h-0.5 bg-cyan-400/50 animate-pulse" />
        </div>

        {/* Base */}
        <div className="w-8 h-1 bg-slate-800 rounded-full border border-cyan-900/60 mt-0.5" />
      </button>

      {/* Arrival Dispatch Dropdown Toast */}
      {isAlertVisible && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-40 w-48 sm:w-52 p-2 rounded-xl bg-slate-950/98 border border-cyan-400 shadow-2xl backdrop-blur-md text-left animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-[7px] font-mono text-cyan-300 font-bold border-b border-slate-800 pb-1">
            <span>🚝 SKY-MAGLEV TRANSIT</span>
            <div className="flex items-center gap-1.5">
              <span className="text-purple-400 font-bold">{item.rail}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAlertVisible(false);
                }}
                className="text-slate-400 hover:text-white text-[9px] px-1 rounded hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="text-[8.5px] font-black text-white mt-1 leading-tight font-display">
            {item.dest}
          </div>
          <div className="text-[7.5px] font-mono text-emerald-300 font-semibold mt-0.5">
            {item.time}
          </div>
        </div>
      )}
    </div>
  );
};
