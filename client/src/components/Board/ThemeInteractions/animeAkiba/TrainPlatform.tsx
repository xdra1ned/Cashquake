import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAudio } from '../../../../context/AudioContext';

const TRAIN_STATUSES = [
  { text: 'NEXT TRAIN ARRIVING', sub: 'JR Yamanote Line • Track 1 🟢', color: '#22c55e', icon: '🚅' },
  { text: 'DOORS CLOSING', sub: 'Stand behind yellow safety line ⚠️', color: '#eab308', icon: '🚪' },
  { text: 'RAPID EXPRESS PASSING', sub: 'Non-stop service to Tokyo Station ⚡', color: '#06b6d4', icon: '🚄' },
];

export const TrainPlatform: React.FC = () => {
  const audio = useAudio();
  const [statusIdx, setStatusIdx] = useState(0);
  const [isApproaching, setIsApproaching] = useState(false);
  const [showHUD, setShowHUD] = useState(false);

  const currentStatus = TRAIN_STATUSES[statusIdx];

  const handleTrainClick = () => {
    audio.playTrainArrivalSound();
    setIsApproaching(true);
    setShowHUD(true);
    setStatusIdx((prev) => (prev + 1) % TRAIN_STATUSES.length);

    setTimeout(() => {
      setIsApproaching(false);
    }, 1200);

    setTimeout(() => {
      setShowHUD(false);
    }, 3800);
  };

  return (
    <div
      className="relative group cursor-pointer select-none"
      onClick={handleTrainClick}
      title="Akiba Rail Station Platform — Click to ring departure chime and signal train"
    >
      {/* Platform & Viaduct Housing */}
      <div className="relative w-22 h-14 sm:w-26 sm:h-16 rounded-lg bg-slate-950/95 border-2 border-slate-700 shadow-xl overflow-hidden group-hover:border-emerald-400 transition-colors p-1 flex flex-col justify-between">
        {/* JR Green Station Banner */}
        <div className="w-full h-3 rounded bg-emerald-600 border border-emerald-400 flex items-center justify-between px-1 shadow-sm">
          <span className="text-[6.5px] font-mono font-black text-white tracking-widest leading-none">
            JR 秋葉原駅
          </span>
          <span className="text-[6px] font-mono text-emerald-100">PLATFORM 01</span>
        </div>

        {/* Elevated Tracks & Animated Train Movement */}
        <div className="relative w-full h-6 rounded bg-slate-900 border border-slate-800 flex items-center justify-between px-1 overflow-hidden">
          {/* Steel Rails */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-slate-800 flex flex-col justify-between">
            <div className="w-full h-0.5 bg-slate-600" />
            <div className="w-full h-0.5 bg-slate-600" />
          </div>

          {/* Approaching Train Coach */}
          <div
            className={`relative flex items-center gap-1 transition-transform duration-700 ease-out ${
              isApproaching ? 'translate-x-0' : '-translate-x-2'
            }`}
          >
            <div className="w-8 sm:w-10 h-4 rounded-sm bg-slate-200 border border-emerald-500 flex items-center justify-between px-0.5 shadow">
              <div className="w-1.5 h-2 rounded-xs bg-emerald-600" />
              <div className="flex gap-0.5">
                <div className="w-1.5 h-1.5 bg-yellow-300 rounded-xs" />
                <div className="w-1.5 h-1.5 bg-yellow-300 rounded-xs" />
              </div>
            </div>
            {/* High-beam train headlight */}
            <div className={`w-1.5 h-1.5 rounded-full bg-white shadow-md ${isApproaching ? 'animate-ping' : ''}`} />
          </div>

          {/* Electronic Digital Arrival Signboard */}
          <div className="relative z-10 px-1 py-0.5 rounded bg-slate-950/90 border border-emerald-500/50">
            <span className="text-[6px] font-mono font-bold text-emerald-400">12:45 山手線</span>
          </div>
        </div>
      </div>

      {/* Station Stencil */}
      <div className="text-center mt-0.5">
        <span className="text-[7.5px] font-mono font-bold tracking-wider text-slate-400 group-hover:text-emerald-300 transition-colors uppercase">
          🚅 AKIBA STATION
        </span>
      </div>

      {/* Station Announcement HUD (Anchored securely below right-aligned, 100% visible and unclipped) */}
      {showHUD && (
        <div
          className="absolute top-full mt-1.5 right-0 whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-950/95 border text-[9px] font-mono font-bold shadow-2xl z-50 animate-fade-in pointer-events-auto backdrop-blur-md flex items-center gap-1.5 cursor-default"
          style={{ borderColor: currentStatus.color, color: currentStatus.color }}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[12px] shrink-0">{currentStatus.icon}</span>
          <div className="flex flex-col text-left">
            <span className="leading-tight">{currentStatus.text}</span>
            <span className="text-[7.5px] text-slate-300 font-sans leading-none mt-0.5">{currentStatus.sub}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowHUD(false);
            }}
            className="ml-1.5 p-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
            title="Dismiss Announcement"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
