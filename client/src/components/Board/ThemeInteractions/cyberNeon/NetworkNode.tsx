import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

export const NetworkNode: React.FC = () => {
  const audio = useAudio();
  const [isPulsing, setIsPulsing] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleNodeClick = () => {
    audio.playNetworkNodeSound();
    setIsPulsing(true);
    setIsAlertOpen(true);
    setTimeout(() => setIsPulsing(false), 800);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleNodeClick}
        className="group relative flex flex-col items-center p-1 rounded-xl bg-slate-950/90 border border-emerald-500/50 hover:border-emerald-400 transition-all duration-200 cursor-pointer backdrop-blur-md"
        title="CITY NETWORK NODE — Click to pulse data packets through the grid"
      >
        {/* Node Crystal Unit */}
        <div className="w-10 h-8 sm:w-11 sm:h-9 rounded-lg bg-[#04100E] border border-emerald-500/50 p-1 flex flex-col justify-center items-center relative overflow-hidden group-hover:border-emerald-300">
          {/* Data Lines & Core Node */}
          <div className="w-5 h-5 rounded-full border border-emerald-400/60 flex items-center justify-center relative">
            <span className="text-[8px] font-black text-emerald-300 font-mono leading-none">
              🌐
            </span>
          </div>

          {/* Data Transfer Packet Animation */}
          {isPulsing && (
            <div className="absolute inset-0 bg-emerald-400/20 rounded-lg animate-ping pointer-events-none" />
          )}
        </div>

        {/* Base */}
        <div className="w-6 h-1 bg-slate-800 rounded-full border border-emerald-900/40 mt-0.5" />
      </button>

      {/* Network Node Telemetry Toast */}
      {isAlertOpen && (
        <div className="absolute top-full left-0 mt-1.5 z-40 w-44 p-2 rounded-xl bg-slate-950/98 border border-emerald-400 shadow-2xl backdrop-blur-md text-left animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-[7px] font-mono text-emerald-300 font-bold border-b border-slate-800 pb-1">
            <span>📡 DATA NODE 07</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsAlertOpen(false);
              }}
              className="text-slate-400 hover:text-white text-[9px] px-1 rounded hover:bg-slate-800"
            >
              ✕
            </button>
          </div>
          <div className="text-[8.5px] font-black text-cyan-300 mt-1 font-display">
            TRAFFIC: 12,481 PKTS/S
          </div>
          <div className="text-[7px] font-mono text-slate-300 mt-0.5">
            STATUS: ENCRYPTED & STABLE
          </div>
        </div>
      )}
    </div>
  );
};
