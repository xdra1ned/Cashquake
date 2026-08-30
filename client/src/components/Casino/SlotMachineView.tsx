import React, { useEffect, useRef, useState } from 'react';
import { Crown, Sparkles, Zap } from 'lucide-react';
import type { ActiveCasinoEvent, SlotsOutcome } from '@shared/types';
import { CASINO_SLOT_SYMBOLS } from '@shared/constants';
import { useAudio } from '../../context/AudioContext';

interface SlotMachineViewProps {
  event: ActiveCasinoEvent;
  isMyEvent: boolean;
  onSpin: () => void;
  onResolve: () => void;
}

export const SlotMachineView: React.FC<SlotMachineViewProps> = ({
  event,
  isMyEvent,
  onSpin,
  onResolve,
}) => {
  const audio = useAudio();
  const outcome = event.outcome as SlotsOutcome;

  const [isLeverPulled, setIsLeverPulled] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [lockedReels, setLockedReels] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [currentDisplaySymbols, setCurrentDisplaySymbols] = useState<[string, string, string]>([
    '7️⃣',
    '💎',
    '🔔',
  ]);
  const [hasLanded, setHasLanded] = useState<boolean>(false);

  const hasTriggeredSpinRef = useRef<boolean>(false);
  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handlePullLever = () => {
    if (isSpinning || hasLanded) return;
    setIsSpinning(true);
    setIsLeverPulled(true);
    hasTriggeredSpinRef.current = true;

    audio.playSlotLever();
    if (isMyEvent) {
      onSpin();
    }

    // Reset lever return
    setTimeout(() => {
      setIsLeverPulled(false);
    }, 350);

    // Continuous reel blur cycling
    spinIntervalRef.current = setInterval(() => {
      audio.playSlotReelSpin();
      setCurrentDisplaySymbols([
        CASINO_SLOT_SYMBOLS[Math.floor(Math.random() * CASINO_SLOT_SYMBOLS.length)],
        CASINO_SLOT_SYMBOLS[Math.floor(Math.random() * CASINO_SLOT_SYMBOLS.length)],
        CASINO_SLOT_SYMBOLS[Math.floor(Math.random() * CASINO_SLOT_SYMBOLS.length)],
      ]);
    }, 75);

    // Reel 1 Lock at 1.3s
    setTimeout(() => {
      setLockedReels([true, false, false]);
      setCurrentDisplaySymbols((prev) => [outcome.reels[0], prev[1], prev[2]]);
      audio.playSlotReelStop(0);
    }, 1300);

    // Reel 2 Lock at 1.9s
    setTimeout(() => {
      setLockedReels([true, true, false]);
      setCurrentDisplaySymbols((prev) => [outcome.reels[0], outcome.reels[1], prev[2]]);
      audio.playSlotReelStop(1);
    }, 1900);

    // Reel 3 Lock at 2.6s (Final Reveal)
    setTimeout(() => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
      }
      setLockedReels([true, true, true]);
      setCurrentDisplaySymbols(outcome.reels);
      audio.playSlotReelStop(2);
      setIsSpinning(false);
      setHasLanded(true);

      if (outcome.isJackpot) {
        audio.playCasinoJackpot();
      } else if (outcome.payout > 0) {
        audio.playSmallWin();
        audio.playChipClink();
      } else {
        audio.playErrorBuzz();
      }
    }, 2600);
  };

  // Sync if status is already spinning (e.g. spectator view) or if bot event starts
  useEffect(() => {
    if (event.status === 'spinning' && !hasTriggeredSpinRef.current && !isSpinning && !hasLanded) {
      handlePullLever();
    }
  }, [event.status]);

  useEffect(() => {
    if (!isMyEvent && !hasTriggeredSpinRef.current && !isSpinning && !hasLanded) {
      const timer = setTimeout(() => {
        if (!hasTriggeredSpinRef.current) {
          handlePullLever();
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isMyEvent]);

  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 w-full">
      {/* Marquee Top Title */}
      <div className="text-center mb-3">
        <span className="text-[11px] uppercase tracking-widest text-amber-400 font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
          Mechanical 3-Reel Slot Machine • High-Roller Jackpots
        </span>
      </div>

      {/* Slot Machine Cabinet Chassis */}
      <div className="relative flex items-center justify-center my-2 select-none">
        {/* Main Cabinet Body */}
        <div className="w-72 sm:w-84 rounded-3xl bg-gradient-to-b from-amber-950 via-slate-900 to-black p-4 border-4 border-amber-600 shadow-[0_0_30px_rgba(217,119,6,0.4)] flex flex-col items-center gap-3 relative">
          {/* Glowing Top Marquee */}
          <div className="w-full py-1.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 border border-yellow-300 shadow-inner flex items-center justify-between text-slate-950">
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span className="text-xs font-black tracking-widest uppercase font-display">
              777 QUAKE SLOTS
            </span>
            <Sparkles className="w-4 h-4 fill-slate-950" />
          </div>

          {/* Payline Viewing Window */}
          <div className="w-full rounded-2xl bg-black/90 p-3 border-2 border-amber-500/60 shadow-inner relative flex items-center justify-center gap-2 sm:gap-3 overflow-hidden">
            {/* Horizontal Payline Guide Line */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-rose-500/40 pointer-events-none z-10" />

            {/* 3 Physical Reels */}
            {currentDisplaySymbols.map((sym, idx) => {
              const isLocked = lockedReels[idx];
              return (
                <div
                  key={idx}
                  className={`w-16 h-24 sm:w-20 sm:h-28 rounded-xl bg-gradient-to-b from-slate-100 via-white to-slate-200 border-2 border-slate-300 flex items-center justify-center text-3xl sm:text-4xl shadow-inner relative transition-all ${
                    !isLocked && isSpinning ? 'blur-[1px] scale-[0.98]' : 'scale-100'
                  }`}
                >
                  <span className="select-none filter drop-shadow-md">
                    {sym}
                  </span>

                  {/* Reel Lock Overlay Flash */}
                  {isLocked && (
                    <div className="absolute inset-0 rounded-xl border-2 border-amber-400/80 bg-amber-400/10 pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Paytable Micro Legend */}
          <div className="w-full grid grid-cols-3 gap-1 text-[9px] font-mono text-amber-300/80 text-center bg-slate-950/70 p-1.5 rounded-lg border border-amber-500/20">
            <div>7️⃣7️⃣7️⃣ $500</div>
            <div>💎💎💎 $300</div>
            <div>⭐⭐⭐ $200</div>
          </div>
        </div>

        {/* Physical Mechanical Lever Arm (Right Side) */}
        <div className="relative -ml-1 sm:-ml-2 flex flex-col items-center">
          {/* Lever Pivot Base */}
          <div className="w-5 h-10 rounded-r-lg bg-amber-700 border-t-2 border-b-2 border-r-2 border-amber-500 shadow-md" />

          {/* Lever Shaft & Knob */}
          <div
            onClick={isMyEvent && !isSpinning && !hasLanded ? handlePullLever : undefined}
            className={`absolute top-2 left-2 flex flex-col items-center transition-transform origin-bottom cursor-pointer select-none group ${
              isLeverPulled ? 'rotate-45 translate-y-3' : 'rotate-0'
            }`}
            style={{ transitionDuration: '200ms' }}
            title={isMyEvent && !isSpinning && !hasLanded ? 'Click or Drag to Pull Lever' : undefined}
          >
            {/* Shaft */}
            <div className="w-2.5 h-16 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 rounded-t border border-slate-400 shadow-md group-hover:brightness-110" />
            {/* Red Glossy Knob */}
            <div className="w-7 h-7 -mt-1 rounded-full bg-gradient-to-br from-rose-500 via-red-600 to-rose-950 border-2 border-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.7)] group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      {/* Outcome Reveal Banner */}
      {hasLanded && (
        <div className="w-full max-w-sm my-3 p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-amber-500/40 shadow-2xl animate-fade-in flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            {outcome.isJackpot && (
              <Crown className="w-5 h-5 text-amber-400 fill-amber-400 animate-bounce" />
            )}
            <span className="text-sm font-black text-amber-300 tracking-wide font-display">
              {outcome.title}
            </span>
          </div>

          <p className="text-xs text-slate-300 text-center font-sans">
            {outcome.description}
          </p>

          <div className="flex items-center gap-3 mt-1">
            <div className={`text-base font-black font-mono ${outcome.payout >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {outcome.payout >= 0 ? `+ $${outcome.payout}` : `- $${Math.abs(outcome.payout)}`}
            </div>
            {outcome.multiplier > 0 && (
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {outcome.multiplier}× Payout
              </span>
            )}
          </div>
        </div>
      )}

      {/* Interactive Controls */}
      <div className="mt-3 flex flex-col items-center gap-2 w-full max-w-xs">
        {!isSpinning && !hasLanded && (
          <>
            {isMyEvent ? (
              <button
                onClick={handlePullLever}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm tracking-wide uppercase shadow-[0_0_20px_rgba(245,158,11,0.5)] transition btn-tactile flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>PULL LEVER & SPIN</span>
              </button>
            ) : (
              <div className="text-xs text-slate-400 font-mono italic animate-pulse">
                Waiting for player to pull the slot lever...
              </div>
            )}
          </>
        )}

        {isSpinning && (
          <div className="text-xs font-bold text-amber-300 font-mono tracking-wider animate-pulse flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>REELS SPINNING...</span>
          </div>
        )}

        {hasLanded && (
          <>
            {isMyEvent ? (
              <button
                onClick={onResolve}
                className="w-full py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition btn-tactile"
              >
                Claim & Continue
              </button>
            ) : (
              <div className="text-xs text-slate-400 font-mono">
                Spin finished. Returning to board...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
