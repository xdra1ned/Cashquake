import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useAudio } from '../../context/AudioContext';
import { ActiveCasinoEvent, GenericThemedOutcome, BoardThemeId } from '@shared/types';
import { X, Sparkles, Trophy, Gift, Cpu, Building2, Wand2, Orbit, Flame } from 'lucide-react';

interface ThemedFortuneModalProps {
  event: ActiveCasinoEvent;
  themeId: BoardThemeId;
}

export const ThemedFortuneModal: React.FC<ThemedFortuneModalProps> = ({ event, themeId }) => {
  const { spinCasinoEvent, resolveCasinoEvent } = useSocket();
  const { playThemeSound } = useAudio();

  const outcome = event.outcome as GenericThemedOutcome;
  const isSpinning = event.status === 'spinning';

  const [phase, setPhase] = useState<'intro' | 'interacting' | 'revealed'>('intro');

  useEffect(() => {
    if (event.status === 'spinning') {
      setPhase('interacting');
      const timer = setTimeout(() => {
        setPhase('revealed');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [event.status]);

  const handleAction = () => {
    playThemeSound(themeId, 'button_tap');
    setPhase('interacting');
    spinCasinoEvent();
  };

  const handleClaim = () => {
    playThemeSound(themeId, 'button_tap');
    resolveCasinoEvent();
  };

  const getThemeStyling = () => {
    switch (themeId) {
      case 'pixel_arcade':
        return {
          title: 'PIXEL 8-BIT LOOT CHEST',
          promptText: 'You discovered a Pixel Loot Chest! Open it to reveal your treasure.',
          btnText: 'OPEN LOOT CHEST',
          spinningText: 'UNLOCKING CHEST...',
          bg: 'bg-slate-900 border-4 border-yellow-400 font-mono shadow-[0_0_30px_rgba(234,179,8,0.4)]',
          headerBg: 'bg-yellow-500/20 text-yellow-300 border-b-2 border-yellow-400',
          btnBg: 'bg-yellow-500 hover:bg-yellow-400 text-black font-bold border-2 border-yellow-300',
          icon: <Gift className="w-8 h-8 text-yellow-400 animate-bounce" />,
          accentColor: '#eab308',
        };
      case 'cyber_neon':
        return {
          title: 'CYBER HACK TERMINAL',
          promptText: 'You accessed a Cyber Mainframe Terminal! Override firewall security to breach the vault.',
          btnText: 'BREACH TERMINAL',
          spinningText: 'DECRYPTING MAINFRAME...',
          bg: 'bg-slate-950 border-2 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.5)]',
          headerBg: 'bg-cyan-500/20 text-cyan-300 border-b border-cyan-400',
          btnBg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.6)]',
          icon: <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />,
          accentColor: '#06b6d4',
        };
      case 'world_tour':
        return {
          title: 'METRO CITY LOTTERY',
          promptText: 'You entered the Municipal City Lottery! Scratch your ticket to claim your municipal grant.',
          btnText: 'SCRATCH TICKET',
          spinningText: 'DRAWING LOTTERY TICKET...',
          bg: 'bg-slate-950/95 border-2 border-amber-400/80 shadow-[0_10px_40px_rgba(245,158,11,0.35)] backdrop-blur-xl',
          headerBg: 'bg-amber-500/20 text-amber-300 border-b border-amber-400/60 font-black',
          btnBg: 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-500/30 border border-amber-300/80',
          icon: <Building2 className="w-8 h-8 text-amber-400 animate-pulse" />,
          accentColor: '#f59e0b',
        };
      case 'mystic_fantasy':
        return {
          title: 'ENCHANTED CRYSTAL ORB',
          promptText: 'You approached the Arcane Crystal Orb! Gaze into the crystal to foresee your destiny.',
          btnText: 'GAZE INTO ORB',
          spinningText: 'CHANNELING ARCANE MANA...',
          bg: 'bg-purple-950 border-2 border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.5)]',
          headerBg: 'bg-purple-500/20 text-purple-200 border-b border-purple-400',
          btnBg: 'bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.6)]',
          icon: <Wand2 className="w-8 h-8 text-purple-300 animate-pulse" />,
          accentColor: '#a855f7',
        };
      case 'cosmic_space':
        return {
          title: 'ALIEN ARTIFACT SCANNER',
          promptText: 'You activated an Alien Artifact Scanner! Scan the deep-space core to harvest quantum energy.',
          btnText: 'SCAN ARTIFACT',
          spinningText: 'ANALYZING QUANTUM CORE...',
          bg: 'bg-indigo-950 border-2 border-indigo-400 shadow-[0_0_35px_rgba(99,102,241,0.5)]',
          headerBg: 'bg-indigo-500/20 text-indigo-200 border-b border-indigo-400',
          btnBg: 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.6)]',
          icon: <Orbit className="w-8 h-8 text-indigo-300 animate-spin-slow" />,
          accentColor: '#6366f1',
        };
      case 'anime_akiba':
        return {
          title: 'AKIBA GACHAPON MACHINE',
          promptText: 'You stepped up to an Akiba Gachapon Machine! Insert your coin and turn the dial.',
          btnText: 'TURN GACHAPON DIAL',
          spinningText: 'DISPENSING CAPSULE...',
          bg: 'bg-slate-900 border-2 border-pink-400 shadow-[0_0_35px_rgba(236,72,153,0.5)]',
          headerBg: 'bg-pink-500/20 text-pink-300 border-b border-pink-400',
          btnBg: 'bg-pink-500 hover:bg-pink-400 text-white font-bold shadow-[0_0_15px_rgba(236,72,153,0.6)]',
          icon: <Sparkles className="w-8 h-8 text-pink-300 animate-bounce" />,
          accentColor: '#ec4899',
        };
      case 'frutiger_aero':
        return {
          title: 'AERO AQUA FORTUNE',
          promptText: 'You reached the Aero Aqua Energy Orb! Open the glossy glass capsule to harvest eco energy.',
          btnText: 'OPEN AQUA CAPSULE',
          spinningText: 'HARVESTING AQUA ENERGY...',
          bg: 'bg-slate-900/95 border-2 border-sky-400 shadow-[0_10px_40px_rgba(56,189,248,0.4)] backdrop-blur-xl',
          headerBg: 'bg-sky-500/20 text-sky-200 border-b border-sky-400 font-black',
          btnBg: 'bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-black shadow-lg shadow-sky-500/30 border border-white/60',
          icon: <Sparkles className="w-8 h-8 text-sky-300 animate-pulse" />,
          accentColor: '#0284c7',
        };
      default:
        return {
          title: 'FORTUNE EVENT',
          promptText: 'You landed on Quake Fortune! Reveal your fortune.',
          btnText: 'REVEAL FORTUNE',
          spinningText: 'REVEALING FORTUNE...',
          bg: 'bg-slate-900 border-2 border-blue-400',
          headerBg: 'bg-blue-500/20 text-blue-300',
          btnBg: 'bg-blue-600 text-white',
          icon: <Trophy className="w-8 h-8 text-blue-400" />,
          accentColor: '#3b82f6',
        };
    }
  };

  const themeStyle = getThemeStyling();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className={`relative w-full max-w-md rounded-2xl overflow-hidden text-slate-100 ${themeStyle.bg}`}>
        {/* Header */}
        <div className={`px-5 py-4 flex items-center justify-between ${themeStyle.headerBg}`}>
          <div className="flex items-center gap-3">
            {themeStyle.icon}
            <h3 className="text-lg font-black tracking-wider uppercase">{themeStyle.title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-6">
          {phase === 'intro' && (
            <div className="space-y-4">
              <div className="text-6xl my-2 animate-bounce">
                {outcome.itemSymbol || '🎁'}
              </div>
              <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                {themeStyle.promptText}
              </p>
              <button
                onClick={handleAction}
                className={`w-full py-3.5 px-6 rounded-xl text-lg uppercase tracking-wide transition-all transform active:scale-95 ${themeStyle.btnBg}`}
              >
                {themeStyle.btnText}
              </button>
            </div>
          )}

          {phase === 'interacting' && (
            <div className="space-y-4 py-6">
              <div className="w-16 h-16 mx-auto rounded-full border-4 border-t-transparent border-current text-cyan-400 animate-spin" />
              <p className="text-lg font-bold tracking-wide animate-pulse">
                {themeStyle.spinningText}
              </p>
            </div>
          )}

          {phase === 'revealed' && (
            <div className="space-y-5 animate-scale-up">
              <div className="text-6xl my-2">
                {outcome.itemSymbol || (outcome.payout >= 0 ? '🏆' : '💸')}
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black uppercase tracking-wider text-yellow-300">
                  {outcome.title}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  {outcome.description}
                </p>
              </div>

              <div className={`text-2xl font-black ${outcome.payout >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {outcome.payout >= 0 ? `+$${outcome.payout}` : `-$${Math.abs(outcome.payout)}`}
              </div>

              <button
                onClick={handleClaim}
                className={`w-full py-3.5 px-6 rounded-xl text-lg uppercase tracking-wide transition-all transform active:scale-95 ${themeStyle.btnBg}`}
              >
                CONFIRM RESULT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
