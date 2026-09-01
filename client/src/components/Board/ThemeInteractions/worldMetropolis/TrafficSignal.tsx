import React, { useState, useEffect } from 'react';
import { useAudio } from '../../../../context/AudioContext';

type LightState = 'green' | 'yellow' | 'red';

export const TrafficSignal: React.FC = () => {
  const audio = useAudio();
  const [light, setLight] = useState<LightState>('green');

  // Auto-cycle traffic light slowly every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setLight((prev) => {
        if (prev === 'green') return 'yellow';
        if (prev === 'yellow') return 'red';
        return 'green';
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleManualCycle = () => {
    audio.playTrafficBeep();
    setLight((prev) => {
      if (prev === 'green') return 'yellow';
      if (prev === 'yellow') return 'red';
      return 'green';
    });
  };

  return (
    <button
      type="button"
      onClick={handleManualCycle}
      className="group relative flex flex-col items-center p-1 rounded-xl bg-slate-950/80 border border-slate-700/60 hover:border-amber-400/80 transition-all duration-200 cursor-pointer backdrop-blur-md"
      title={`TRAFFIC SIGNAL: ${light.toUpperCase()} — Click to cycle intersection signal`}
    >
      {/* Signal Housing */}
      <div className="w-5 h-11 sm:w-6 sm:h-12 rounded-lg bg-[#090D14] border border-slate-700 p-0.5 flex flex-col justify-between items-center shadow-inner relative">
        {/* Red Light */}
        <div
          className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
            light === 'red'
              ? 'bg-red-500 shadow-md shadow-red-500/80 border border-red-300 animate-pulse'
              : 'bg-red-950/60 border border-red-900/40 opacity-40'
          }`}
        />

        {/* Yellow Light */}
        <div
          className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
            light === 'yellow'
              ? 'bg-amber-400 shadow-md shadow-amber-400/80 border border-amber-200 animate-pulse'
              : 'bg-amber-950/60 border border-amber-900/40 opacity-40'
          }`}
        />

        {/* Green Light */}
        <div
          className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
            light === 'green'
              ? 'bg-emerald-400 shadow-md shadow-emerald-400/80 border border-emerald-200 animate-pulse'
              : 'bg-emerald-950/60 border border-emerald-900/40 opacity-40'
          }`}
        />
      </div>

      {/* Signal Post */}
      <div className="w-1.5 h-2 bg-slate-600 border-x border-slate-500" />
      <div className="w-4 h-1 bg-slate-700 rounded-full border border-slate-600" />
    </button>
  );
};
