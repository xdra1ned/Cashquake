import React, { useState, useEffect } from 'react';
import { useAudio } from '../../../../context/AudioContext';

export const NeuralAccessTerminal: React.FC = () => {
  const audio = useAudio();
  const [phase, setPhase] = useState<'idle' | 'breaching' | 'projecting'>('idle');
  const [hexCode, setHexCode] = useState('0x7F2A..');

  // Hexadecimal scrambling effect during breach sequence
  useEffect(() => {
    if (phase !== 'breaching') return;
    const interval = setInterval(() => {
      const hex = '0x' + Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase().padStart(6, '0');
      setHexCode(hex);
    }, 90);
    const timeout = setTimeout(() => {
      setPhase('projecting');
    }, 1200);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [phase]);

  const handleInteract = () => {
    if (phase === 'idle') {
      audio.playCyberTerminalSound();
      setPhase('breaching');
    } else {
      setPhase('idle');
    }
  };

  return (
    <div className="relative group">
      {/* Wall-Mounted Cyberdeck Terminal */}
      <button
        type="button"
        onClick={handleInteract}
        className="relative flex flex-col items-center p-1 rounded-xl bg-slate-950/90 border border-cyan-500/60 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-200 cursor-pointer backdrop-blur-md"
        title="NEURAL ACCESS TERMINAL — Click to initiate physical system breach"
      >
        {/* Optical Glass Lens & Biometric Sensor */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#020512] border border-cyan-400/70 p-1 flex flex-col justify-between items-center relative overflow-hidden group-hover:border-cyan-300">
          {/* Holographic Emitter Ring */}
          <div className="w-6 h-6 rounded-full border border-cyan-400/50 flex items-center justify-center relative bg-cyan-950/40">
            <span className="text-[9px] font-black text-cyan-300 font-mono leading-none">
              ◈
            </span>
            <div className={`absolute inset-0 rounded-full border border-cyan-300 ${phase !== 'idle' ? 'animate-ping' : ''}`} />
          </div>

          {/* Conduit Touch Pad */}
          <div className="w-full flex items-center justify-between px-0.5 z-10">
            <div className="w-1.5 h-1 rounded-xs bg-purple-400 animate-pulse" />
            <span className="text-[6px] font-mono font-black text-cyan-300 tracking-wider">
              {phase === 'idle' ? 'ACCESS' : phase === 'breaching' ? 'BREACH' : 'ONLINE'}
            </span>
            <div className="w-1.5 h-1 rounded-xs bg-cyan-400 animate-pulse" />
          </div>

          {/* Bottom Fiber Light Bar */}
          <div className="w-full h-0.5 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400" />
        </div>

        {/* Conduit Cable Stems descending into building infrastructure */}
        <div className="w-1 h-3 bg-gradient-to-b from-cyan-500/80 to-transparent mx-auto" />
      </button>

      {/* Diegetic In-World Holographic HUD Projection */}
      {phase !== 'idle' && (
        <div className="absolute left-full top-0 ml-2 z-40 w-52 sm:w-60 p-3 rounded-2xl bg-slate-950/98 border-2 border-cyan-400 shadow-2xl shadow-cyan-500/30 backdrop-blur-md text-left animate-in fade-in zoom-in-95 duration-150 pointer-events-auto">
          {/* Holographic Header */}
          <div className="flex items-center justify-between border-b border-cyan-900/80 pb-1.5 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[8px] font-mono font-black text-cyan-300 uppercase tracking-wider">
                {phase === 'breaching' ? 'DECRYPTING NEURAL GRID...' : 'NEURAL MAINFRAME HUD'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPhase('idle')}
              className="text-slate-400 hover:text-white text-[10px] px-1.5 py-0.5 rounded hover:bg-slate-800 transition"
              title="Close Projection"
            >
              ✕
            </button>
          </div>

          {phase === 'breaching' ? (
            /* Active Decryption Hex Stream */
            <div className="flex flex-col gap-1 py-1 font-mono">
              <div className="text-[8px] text-purple-300 font-bold">
                BYPASSING LATENCY FIREWALL...
              </div>
              <div className="p-1.5 rounded-lg bg-[#020716] border border-cyan-500/40 text-[9px] text-cyan-300 font-black tracking-widest text-center animate-pulse">
                {hexCode} • AUTH: 99.8%
              </div>
              <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-1">
                <div className="bg-cyan-400 h-full w-4/5 animate-pulse" />
              </div>
            </div>
          ) : (
            /* Live System Diagnostics HUD */
            <div className="flex flex-col gap-1.5 font-mono text-[8px]">
              <div className="flex justify-between items-center bg-cyan-950/40 px-2 py-1 rounded-lg border border-cyan-500/30">
                <span className="text-slate-300">NODE 01 STATUS</span>
                <span className="text-emerald-400 font-black">ONLINE (99.98%)</span>
              </div>
              <div className="flex justify-between items-center bg-purple-950/30 px-2 py-1 rounded-lg border border-purple-500/30">
                <span className="text-slate-300">CIPHER SHIELD</span>
                <span className="text-purple-300 font-black">256-QUBIT ACTIVE</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 px-2 py-1 rounded-lg border border-slate-800">
                <span className="text-slate-300">CITY GRID LOAD</span>
                <span className="text-cyan-300 font-black">4.2 TW OPTIMAL</span>
              </div>
              <div className="text-[7px] text-slate-400 mt-1 text-center italic">
                *Atmospheric telemetry. Zero effect on match rules.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
