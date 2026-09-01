import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

const COMMS_LOGS = [
  'EXPLORER LOG: ORBIT STABLE',
  'EVA SYSTEM // NOMINAL',
  'SOLAR WIND: 420 km/s',
  'MISSION LOG UPDATED // SECTOR 1',
  'HULL INSPECTION COMPLETE',
];

export const AstronautExplorer: React.FC = () => {
  const { playAstronautCommsSound } = useAudio();
  const [logMsg, setLogMsg] = useState<string | null>(null);
  const [isTalking, setIsTalking] = useState(false);

  const handleComms = () => {
    playAstronautCommsSound();
    setIsTalking(true);

    const nextLog = COMMS_LOGS[Math.floor(Math.random() * COMMS_LOGS.length)];
    setLogMsg(nextLog);

    setTimeout(() => {
      setIsTalking(false);
    }, 1200);

    setTimeout(() => {
      setLogMsg(null);
    }, 4000);
  };

  return (
    <div className="relative group cursor-pointer select-none" onClick={handleComms} title="Spacewalk Astronaut Explorer — Click to open radio transmission log">
      <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center">
        {/* Exterior Safety Tether Cable to Station */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60" viewBox="0 0 80 80">
          <path d="M 10 70 Q 30 50, 42 42" stroke="#64748B" strokeWidth="1.2" strokeDasharray="3 2" fill="none" />
        </svg>

        {/* Astronaut Character with Gentle Zero-G Buoyancy Float */}
        <div className={`relative flex flex-col items-center transition-transform duration-500 animate-pulse ${isTalking ? 'scale-110' : ''}`}>
          {/* Pressurized EVA Helmet */}
          <div className="relative w-6.5 h-6.5 rounded-full bg-slate-200 border-2 border-slate-400 shadow-md flex items-center justify-center">
            {/* Golden Reflective Visor Shield */}
            <div className="w-4 h-2.5 rounded-full bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 border border-amber-200 shadow-inner flex items-start justify-end pr-0.5">
              <div className="w-1 h-1 bg-white rounded-full opacity-80 mt-0.5" />
            </div>

            {/* Helmet Headlamp / Comms Beacon */}
            <div className={`absolute -top-1 right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm ${isTalking ? 'animate-ping' : ''}`} />
          </div>

          {/* Life Support Torso Unit & EVA Suit */}
          <div className="relative w-7.5 h-7.5 rounded-lg bg-gradient-to-b from-slate-100 to-slate-300 border border-slate-400 shadow flex flex-col items-center justify-between p-1 -mt-1">
            {/* Chest Control Display Pad */}
            <div className="w-4.5 h-2 rounded bg-slate-900 flex items-center justify-around px-0.5">
              <div className="w-1 h-1 rounded-full bg-emerald-400" />
              <div className="w-1 h-1 rounded-full bg-cyan-400" />
              <div className="w-1 h-1 rounded-full bg-rose-400" />
            </div>

            {/* Mission Patch */}
            <div className="w-2 h-1.5 rounded bg-blue-600 border border-white/50" />
          </div>

          {/* Pressurized Boots */}
          <div className="flex gap-1 -mt-0.5">
            <div className="w-2 h-2 rounded-b bg-slate-400 border border-slate-600" />
            <div className="w-2 h-2 rounded-b bg-slate-400 border border-slate-600" />
          </div>
        </div>
      </div>

      {/* Station Stencil */}
      <div className="text-center mt-[-2px]">
        <span className="text-[8px] font-mono font-bold tracking-wider text-slate-400 group-hover:text-cyan-300 transition-colors uppercase">
          👨‍🚀 EVA EXPLORER
        </span>
      </div>

      {/* Radio Comms Broadcast Pill (Anchored securely below Eva, 100% visible and unclipped) */}
      {logMsg && (
        <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-950/95 border border-cyan-400/90 text-[9px] font-mono font-bold text-cyan-300 shadow-2xl z-50 animate-fade-in pointer-events-none backdrop-blur-md">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1 animate-pulse" />
          <span>{logMsg}</span>
        </div>
      )}
    </div>
  );
};
