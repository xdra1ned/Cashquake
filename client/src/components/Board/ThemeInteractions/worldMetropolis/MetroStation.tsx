import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

const METRO_DISPATCHES = [
  { line: 'LINE A: CENTRAL DISTRICT', status: 'NEXT TRAIN — 02 MIN', track: 'PLATFORM 1' },
  { line: 'EXPRESS 777: GRAND TERMINAL', status: 'BOARDING NOW', track: 'PLATFORM 2' },
  { line: 'METROLINE: RIVERSIDE', status: 'APPROACHING STATION', track: 'PLATFORM 1' },
  { line: 'AIRPORT SHUTTLE', status: 'ON SCHEDULE — 04 MIN', track: 'PLATFORM 3' },
];

export const MetroStation: React.FC = () => {
  const audio = useAudio();
  const [dispatchIndex, setDispatchIndex] = useState(0);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const handleStationClick = () => {
    audio.playMetroChime();
    setDispatchIndex((prev) => (prev + 1) % METRO_DISPATCHES.length);
    setIsAlertVisible(true);
  };

  const dispatch = METRO_DISPATCHES[dispatchIndex];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleStationClick}
        className="group relative flex flex-col items-center p-1.5 rounded-xl bg-slate-950/80 border border-slate-700/60 hover:border-cyan-400/80 transition-all duration-200 cursor-pointer backdrop-blur-md"
        title="METRO STATION ENTRANCE — Click to check live subway arrivals"
      >
        {/* Modern Metro Entrance Canopy */}
        <div className="w-11 h-8 sm:w-12 sm:h-9 rounded-lg bg-[#08101C] border border-cyan-500/40 p-1 flex flex-col justify-between items-center relative overflow-hidden group-hover:border-cyan-300">
          {/* Illuminated Subway M Globe / Sign */}
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 flex items-center justify-center text-[7px] font-black text-slate-950 leading-none">
              M
            </div>
            <span className="text-[6.5px] font-mono font-black text-cyan-300 tracking-wider">
              METRO
            </span>
          </div>

          {/* Stepped Subway Stairs Graphic */}
          <div className="w-full flex flex-col gap-0.5 px-1">
            <div className="w-full h-0.5 bg-slate-600 rounded-xs" />
            <div className="w-4/5 h-0.5 bg-slate-700 rounded-xs mx-auto" />
            <div className="w-3/5 h-0.5 bg-slate-800 rounded-xs mx-auto" />
          </div>

          {/* Under-canopy glow */}
          <div className="w-full h-0.5 bg-cyan-400/40 animate-pulse" />
        </div>

        {/* Street Level Base */}
        <div className="w-8 h-1 bg-slate-800 rounded-full border border-slate-700 mt-0.5" />
      </button>

      {/* Arrival Dispatch Dropdown Toast (Downward positioning for zero clipping) */}
      {isAlertVisible && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-40 w-48 sm:w-52 p-2 rounded-xl bg-slate-950/98 border border-cyan-400 shadow-2xl backdrop-blur-md text-left animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-[7px] font-mono text-cyan-300 font-bold border-b border-slate-800 pb-1">
            <span>🚇 METROPOLIS TRANSIT</span>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">{dispatch.track}</span>
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
            {dispatch.line}
          </div>
          <div className="text-[7.5px] font-mono text-emerald-300 font-semibold mt-0.5">
            {dispatch.status}
          </div>
        </div>
      )}
    </div>
  );
};
