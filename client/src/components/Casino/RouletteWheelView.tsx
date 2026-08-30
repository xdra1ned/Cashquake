import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import type { ActiveCasinoEvent, RouletteOutcome } from '@shared/types';
import { useAudio } from '../../context/AudioContext';

const ROULETTE_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

const RED_NUMS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

interface RouletteWheelViewProps {
  event: ActiveCasinoEvent;
  isMyEvent: boolean;
  onSpin: () => void;
  onResolve: () => void;
}

export const RouletteWheelView: React.FC<RouletteWheelViewProps> = ({
  event,
  isMyEvent,
  onSpin,
  onResolve,
}) => {
  const audio = useAudio();
  const outcome = event.outcome as RouletteOutcome;

  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [ballRotation, setBallRotation] = useState<number>(0);
  const [ballRadius, setBallRadius] = useState<number>(142);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [hasLanded, setHasLanded] = useState<boolean>(false);

  const hasTriggeredSpinRef = useRef<boolean>(false);

  const targetIndex = ROULETTE_ORDER.indexOf(outcome.number);
  const sliceAngle = 360 / ROULETTE_ORDER.length;

  const handleStartSpin = () => {
    if (isSpinning || hasLanded) return;
    setIsSpinning(true);
    hasTriggeredSpinRef.current = true;
    audio.playRouletteSpin();
    if (isMyEvent) {
      onSpin();
    }

    // Wheel spins clockwise 5-7 full turns + aligns target pocket to top pointer (270 deg)
    const targetPocketAngle = targetIndex * sliceAngle;
    const finalWheelDeg = 360 * 5 + (360 - targetPocketAngle);

    // Ball spins counter-clockwise 8 full turns
    const finalBallDeg = -(360 * 8 + targetPocketAngle);

    setWheelRotation(finalWheelDeg);
    setBallRotation(finalBallDeg);

    // Ball starts on outer track (142px) and drops inward to pocket track (112px) near the end
    setTimeout(() => {
      setBallRadius(112);
      audio.playRouletteBallDrop();
    }, 2200);

    // Landed finish after 2.9 seconds
    setTimeout(() => {
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
    }, 2900);
  };

  // Sync if status is already spinning (e.g. spectator view) or if bot event starts
  useEffect(() => {
    if (event.status === 'spinning' && !hasTriggeredSpinRef.current && !isSpinning && !hasLanded) {
      handleStartSpin();
    }
  }, [event.status]);

  useEffect(() => {
    if (!isMyEvent && !hasTriggeredSpinRef.current && !isSpinning && !hasLanded) {
      const timer = setTimeout(() => {
        if (!hasTriggeredSpinRef.current) {
          handleStartSpin();
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isMyEvent]);

  const numColor = outcome.number === 0 ? 'bg-emerald-600' : outcome.color === 'red' ? 'bg-rose-600' : 'bg-slate-900';

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 w-full">
      {/* Subtitle / Flavor Banner */}
      <div className="text-center mb-3">
        <span className="text-[11px] uppercase tracking-widest text-amber-400 font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
          European Royal Roulette • Single Zero 37-Pocket
        </span>
      </div>

      {/* Interactive Roulette Wheel Arena */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center my-2 select-none">
        {/* Top Gold Pointer Indicator */}
        <div className="absolute top-0 z-20 -translate-y-1 flex flex-col items-center">
          <div className="w-4 h-4 bg-amber-400 rotate-45 border-2 border-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
        </div>

        {/* Outer Brass Ring Frame */}
        <div className="absolute inset-0 rounded-full border-4 border-amber-600/80 shadow-[0_0_25px_rgba(217,119,6,0.4)] bg-gradient-to-b from-amber-900/60 to-emerald-950/80 p-2">
          {/* Rotating Roulette Wheel */}
          <div
            className="w-full h-full rounded-full relative transition-transform"
            style={{
              transform: `rotate(${wheelRotation}deg)`,
              transitionDuration: isSpinning ? '2.8s' : '0s',
              transitionTimingFunction: 'cubic-bezier(0.15, 0.85, 0.35, 1)',
            }}
          >
            <svg viewBox="0 0 300 300" className="w-full h-full">
              {/* Outer pocket dividers */}
              {ROULETTE_ORDER.map((num, idx) => {
                const angle = (idx * sliceAngle * Math.PI) / 180;
                const nextAngle = ((idx + 1) * sliceAngle * Math.PI) / 180;
                const rOuter = 145;
                const rInner = 95;

                const x1 = 150 + rOuter * Math.cos(angle);
                const y1 = 150 + rOuter * Math.sin(angle);
                const x2 = 150 + rOuter * Math.cos(nextAngle);
                const y2 = 150 + rOuter * Math.sin(nextAngle);
                const x3 = 150 + rInner * Math.cos(nextAngle);
                const y3 = 150 + rInner * Math.sin(nextAngle);
                const x4 = 150 + rInner * Math.cos(angle);
                const y4 = 150 + rInner * Math.sin(angle);

                const isZero = num === 0;
                const isRed = RED_NUMS.has(num);
                const fillColor = isZero ? '#059669' : isRed ? '#DC2626' : '#0F172A';

                const midAngle = ((idx + 0.5) * sliceAngle * Math.PI) / 180;
                const textR = 120;
                const textX = 150 + textR * Math.cos(midAngle);
                const textY = 150 + textR * Math.sin(midAngle);
                const textRot = (idx + 0.5) * sliceAngle + 90;

                return (
                  <g key={num}>
                    <path
                      d={`M ${x1} ${y1} A ${rOuter} ${rOuter} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 0 0 ${x4} ${y4} Z`}
                      fill={fillColor}
                      stroke="#CA8A04"
                      strokeWidth="0.75"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="var(--font-mono)"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textRot} ${textX} ${textY})`}
                    >
                      {num}
                    </text>
                  </g>
                );
              })}

              {/* Inner Brass Hub & Turret */}
              <circle cx="150" cy="150" r="92" fill="#04180D" stroke="#D97706" strokeWidth="2" />
              <circle cx="150" cy="150" r="70" fill="#062314" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="150" cy="150" r="38" fill="#78350F" stroke="#FBBF24" strokeWidth="2" />
              <circle cx="150" cy="150" r="14" fill="#FDE047" />

              {/* 4 Golden Turret Cross Handles */}
              {Array.from({ length: 4 }).map((_, i) => {
                const rot = i * 90;
                return (
                  <g key={i} transform={`rotate(${rot} 150 150)`}>
                    <line x1="150" y1="112" x2="150" y2="136" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="150" cy="110" r="4" fill="#FBBF24" stroke="#78350F" strokeWidth="1" />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Orbiting Ivory Ball */}
        <div
          className="absolute w-full h-full pointer-events-none transition-transform"
          style={{
            transform: `rotate(${ballRotation}deg)`,
            transitionDuration: isSpinning ? '2.8s' : '0s',
            transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.4, 1)',
          }}
        >
          <div
            className="absolute top-1/2 left-1/2 w-3.5 h-3.5 -mt-1.5 -ml-1.5 rounded-full bg-slate-100 border border-slate-300 shadow-[0_0_8px_rgba(255,255,255,0.9)]"
            style={{
              transform: `translateY(-${ballRadius}px)`,
              transition: 'transform 0.7s ease-in',
            }}
          />
        </div>
      </div>

      {/* Outcome Reveal Banner (shown after wheel lands) */}
      {hasLanded && (
        <div className="w-full max-w-sm my-3 p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-amber-500/40 shadow-2xl animate-fade-in flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-xl text-white font-black font-mono text-base border border-white/20 shadow-md ${numColor}`}>
              #{outcome.number} {outcome.color.toUpperCase()}
            </span>
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
                onClick={handleStartSpin}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm tracking-wide uppercase shadow-[0_0_20px_rgba(245,158,11,0.5)] transition btn-tactile flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>SPIN ROULETTE</span>
              </button>
            ) : (
              <div className="text-xs text-slate-400 font-mono italic animate-pulse">
                Waiting for player to spin the roulette wheel...
              </div>
            )}
          </>
        )}

        {isSpinning && (
          <div className="text-xs font-bold text-amber-300 font-mono tracking-wider animate-pulse flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>WHEEL IN MOTION...</span>
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
