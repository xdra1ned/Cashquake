import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAudio } from '../../../../context/AudioContext';

const SCREEN_MESSAGES = [
  { text: 'PLAYER 1 READY!', sub: 'ROUND 1 • FIGHT!', color: '#22c55e', icon: '🥊' },
  { text: 'COMBO × 99!', sub: 'ULTRA FINISH!', color: '#f59e0b', icon: '🔥' },
  { text: 'HIGH SCORE: 999,999', sub: 'RANK #1: CASHQUAKE', color: '#ec4899', icon: '🏆' },
  { text: 'INSERT COIN', sub: 'CREDITS: 02', color: '#06b6d4', icon: '🪙' },
];

export const ArcadeCabinet: React.FC = () => {
  const audio = useAudio();
  const [msgIndex, setMsgIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHUD, setShowHUD] = useState(false);

  const currentMsg = SCREEN_MESSAGES[msgIndex];

  const handlePlay = () => {
    audio.playArcadeSound();
    setIsPlaying(true);
    setShowHUD(true);
    setMsgIndex((prev) => (prev + 1) % SCREEN_MESSAGES.length);

    setTimeout(() => {
      setIsPlaying(false);
    }, 600);

    setTimeout(() => {
      setShowHUD(false);
    }, 3500);
  };

  return (
    <div
      className="relative group cursor-pointer select-none"
      onClick={handlePlay}
      title="Akiba Arcade Candy Cabinet — Click to insert coin and play"
    >
      {/* Candy Cab Chassis Body */}
      <div className="relative w-15 h-18 sm:w-17 sm:h-20 flex flex-col items-center">
        {/* Glowing Top Marquee Header */}
        <div className="w-13 sm:w-15 h-3 rounded-t-md bg-gradient-to-r from-cyan-500 via-pink-500 to-cyan-500 p-0.5 shadow-md flex items-center justify-center">
          <span className="text-[6.5px] font-mono font-black text-white tracking-widest leading-none drop-shadow">
            AKIBA ARCADE
          </span>
        </div>

        {/* Angled CRT Screen Bezel */}
        <div className="relative w-14 sm:w-16 h-9 sm:h-10 bg-slate-900 border-2 border-slate-700 rounded-sm shadow-inner flex flex-col items-center justify-center p-1 overflow-hidden">
          {/* CRT Scanline Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />

          {/* Animated Pixel Game Graphics on CRT */}
          <div
            className={`w-full h-full rounded bg-slate-950 flex flex-col items-center justify-center transition-all ${
              isPlaying ? 'scale-105 ring-1 ring-cyan-400' : ''
            }`}
          >
            <span className="text-[10px] leading-none">{currentMsg.icon}</span>
            <span
              className="text-[7px] font-mono font-black tracking-tight leading-none mt-0.5 truncate"
              style={{ color: currentMsg.color }}
            >
              {currentMsg.text}
            </span>
          </div>
        </div>

        {/* Control Panel: Joystick & 6 Pushbuttons */}
        <div className="w-14 sm:w-16 h-5 rounded-b-md bg-gradient-to-b from-slate-200 to-slate-400 border border-slate-500 shadow flex items-center justify-between px-1.5 -mt-0.5">
          {/* 8-Way Arcade Balltop Joystick */}
          <div className={`w-2.5 h-3.5 flex flex-col items-center ${isPlaying ? 'rotate-12' : ''} transition-transform`}>
            <div className="w-2 h-2 rounded-full bg-rose-500 border border-rose-700 shadow-sm" />
            <div className="w-0.5 h-1.5 bg-slate-700" />
          </div>

          {/* 6 Microswitch Action Buttons */}
          <div className="grid grid-cols-3 gap-0.5">
            <div className={`w-1.5 h-1.5 rounded-full bg-blue-500 ${isPlaying ? 'scale-75' : ''}`} />
            <div className={`w-1.5 h-1.5 rounded-full bg-amber-400 ${isPlaying ? 'scale-75' : ''}`} />
            <div className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${isPlaying ? 'scale-75' : ''}`} />
            <div className={`w-1.5 h-1.5 rounded-full bg-pink-500 ${isPlaying ? 'scale-75' : ''}`} />
            <div className={`w-1.5 h-1.5 rounded-full bg-purple-500 ${isPlaying ? 'scale-75' : ''}`} />
            <div className={`w-1.5 h-1.5 rounded-full bg-cyan-400 ${isPlaying ? 'scale-75' : ''}`} />
          </div>
        </div>
      </div>

      {/* Station Stencil */}
      <div className="text-center mt-[-2px]">
        <span className="text-[7.5px] font-mono font-bold tracking-wider text-slate-400 group-hover:text-cyan-300 transition-colors uppercase">
          🕹️ ARCADE CAB
        </span>
      </div>

      {/* Screen Announcement Pill (Anchored securely below left-aligned, 100% visible and unclipped) */}
      {showHUD && (
        <div
          className="absolute top-full mt-1.5 left-0 whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-950/95 border text-[9px] font-mono font-bold shadow-2xl z-50 animate-fade-in pointer-events-auto backdrop-blur-md flex items-center gap-1.5 cursor-default"
          style={{ borderColor: currentMsg.color, color: currentMsg.color }}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-ping shrink-0" style={{ backgroundColor: currentMsg.color }} />
          <span>{currentMsg.text} — {currentMsg.sub}</span>
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
