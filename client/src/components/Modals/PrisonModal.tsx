import { Dices, DollarSign, Lock, Ticket, X } from 'lucide-react';
import React from 'react';
import { useSocket } from '../../context/SocketContext';

export const PrisonModal: React.FC = () => {
  const { gameState, myPlayerId, payBail, usePrisonCard, rollDice } = useSocket();

  if (!gameState) return null;

  const currentP = gameState.players[gameState.turn.currentPlayerId];
  const isMyTurn = currentP?.id === myPlayerId;
  const isInPrison = currentP?.inPrison;

  if (!isMyTurn || !isInPrison || gameState.turn.hasRolled) return null;

  const bailCost = gameState.rules.prisonBailAmount;
  const hasCard = currentP.inventory.getOutOfJailCards > 0;
  const canAffordBail = currentP.cash >= bailCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-rose-500/60 shadow-2xl p-6 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center shadow-inner text-rose-400">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-black text-white font-display">YOU ARE IN DETENTION</h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Turn {currentP.prisonTurns + 1} of {gameState.rules.prisonTurnsMax} served. Choose how to resolve:
          </p>
        </div>

        <div className="w-full space-y-2.5 pt-2 font-sans">
          {/* Roll for Doubles */}
          <button
            onClick={() => rollDice()}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-pink-500/20 transition flex items-center justify-center gap-2 btn-tactile font-display"
          >
            <Dices className="w-4 h-4" />
            <span>Roll for Doubles (Free Release)</span>
          </button>

          {/* Pay Bail */}
          <button
            disabled={!canAffordBail}
            onClick={() => payBail()}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-40 text-emerald-300 font-bold text-xs transition flex items-center justify-center gap-2 btn-tactile font-mono"
          >
            <DollarSign className="w-4 h-4" />
            <span>Pay Bail (${bailCost})</span>
          </button>

          {/* Use Pass */}
          {hasCard && (
            <button
              onClick={() => usePrisonCard()}
              className="w-full py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition flex items-center justify-center gap-2 btn-tactile"
            >
              <Ticket className="w-4 h-4" />
              <span>Use Get Out of Jail Pass</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

