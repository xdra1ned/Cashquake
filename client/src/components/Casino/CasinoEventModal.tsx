import React from 'react';
import { Sparkles, Users } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { RouletteWheelView } from './RouletteWheelView';
import { SlotMachineView } from './SlotMachineView';
import { ThemedFortuneModal } from '../Modals/ThemedFortuneModal';

export const CasinoEventModal: React.FC = () => {
  const { gameState, myPlayerId, spinCasinoEvent, resolveCasinoEvent } = useSocket();

  if (!gameState || !gameState.activeCasinoEvent) {
    return null;
  }

  const event = gameState.activeCasinoEvent;
  const isMyEvent = event.playerId === myPlayerId;
  const player = gameState.players[event.playerId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#062314] via-[#04180d] to-black border-2 border-amber-500/70 shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden flex flex-col items-center">
        {/* Top Gold Header Banner */}
        <div className="w-full py-3 px-5 bg-gradient-to-r from-amber-900/60 via-amber-700/40 to-amber-900/60 border-b border-amber-500/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🎰</span>
            <div>
              <h2 className="text-xs sm:text-sm font-black text-amber-300 font-display tracking-wider uppercase">
                {event.eventType === 'roulette' ? 'Casino Royale • Lucky Roulette' : 'Casino Royale • Quake Slots'}
              </h2>
              <span className="text-[10px] text-amber-400/80 font-mono">
                {isMyEvent ? 'Your turn to bet & spin!' : `Live Casino: Watching ${player?.name || 'Player'}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isMyEvent ? (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-[10px] font-mono text-amber-300 font-bold">
                <Sparkles className="w-3 h-3 text-amber-400" />
                ACTIVE
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] font-mono text-slate-300">
                <Users className="w-3 h-3 text-slate-400" />
                SPECTATING
              </span>
            )}
          </div>
        </div>

        {/* Player Profile Badge */}
        <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/40 border border-amber-500/20 text-xs text-amber-200">
          <span className="text-base">{player?.customization?.avatarIcon || '🎲'}</span>
          <span className="font-bold">{player?.name || 'Player'}</span>
          <span className="text-[10px] text-amber-400/70 font-mono">
            Balance: ${player?.cash ?? 0}
          </span>
        </div>

        {/* Minigame Interactive Body */}
        <div className="w-full flex flex-col items-center">
          {event.eventType === 'roulette' ? (
            <RouletteWheelView
              event={event}
              isMyEvent={isMyEvent}
              onSpin={spinCasinoEvent}
              onResolve={resolveCasinoEvent}
            />
          ) : event.eventType === 'slots' ? (
            <SlotMachineView
              event={event}
              isMyEvent={isMyEvent}
              onSpin={spinCasinoEvent}
              onResolve={resolveCasinoEvent}
            />
          ) : (
            <ThemedFortuneModal event={event} themeId={gameState.themeId} />
          )}
        </div>
      </div>
    </div>
  );
};
