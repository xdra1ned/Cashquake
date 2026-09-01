import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

export const FloatingNetworkNode: React.FC = () => {
  const audio = useAudio();
  const [isPulsing, setIsPulsing] = useState(false);
  const [showData, setShowData] = useState(false);

  const handleClick = () => {
    audio.playNetworkNodeSound();
    setIsPulsing(true);
    setShowData(true);
    setTimeout(() => setIsPulsing(false), 600);
  };

  return (
    <div className="relative group">
      {/* Floating Holographic Crystal Node */}
      <button
        type="button"
        onClick={handleClick}
        className="relative flex flex-col items-center p-1 rounded-xl bg-slate-950/90 border border-purple-500/60 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-200 cursor-pointer backdrop-blur-md"
        title="FLOATING DATA CONDUIT — Click to pulse network packets through the grid"
      >
        {/* Suspended Octahedron Core */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#080414] border border-purple-400/70 p-1 flex flex-col justify-center items-center relative overflow-hidden group-hover:border-purple-300">
          {/* Animated Diamond Core */}
          <div className="w-6 h-6 rotate-45 border-2 border-purple-400/80 flex items-center justify-center relative bg-purple-950/40 shadow-sm shadow-purple-500">
            <div className={`w-2.5 h-2.5 rounded-full bg-cyan-300 ${isPulsing ? 'animate-ping' : 'animate-pulse'}`} />
          </div>

          {/* Laser fiber connections */}
          <div className="absolute inset-0 flex items-center justify-between px-0.5 pointer-events-none">
            <div className="w-2 h-0.5 bg-purple-400/60" />
            <div className="w-2 h-0.5 bg-cyan-400/60" />
          </div>
        </div>

        {/* Anchor Cable */}
        <div className="w-1 h-3 bg-gradient-to-b from-purple-500/80 to-transparent mx-auto" />
      </button>

      {/* Floating Holographic Data Readout */}
      {showData && (
        <div className="absolute right-full top-0 mr-2 z-40 w-48 sm:w-52 p-2.5 rounded-2xl bg-slate-950/98 border-2 border-purple-400 shadow-2xl shadow-purple-500/30 backdrop-blur-md text-left animate-in fade-in zoom-in-95 duration-150 pointer-events-auto">
          <div className="flex items-center justify-between border-b border-purple-900/80 pb-1 mb-1.5">
            <span className="text-[7.5px] font-mono font-black text-purple-300 uppercase tracking-wider">
              🌐 DATA CONDUIT 07
            </span>
            <button
              type="button"
              onClick={() => setShowData(false)}
              className="text-slate-400 hover:text-white text-[9px] px-1 rounded hover:bg-slate-800"
            >
              ✕
            </button>
          </div>
          <div className="text-[8px] font-black text-cyan-300 font-display">
            PACKETS: 14,892 PKTS/S
          </div>
          <div className="text-[7.5px] font-mono text-emerald-400 mt-0.5">
            LATENCY: 0.2MS • ENCRYPTED
          </div>
          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-1.5">
            <div className="bg-purple-400 h-full w-full animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};
