import { Building2, Check, Gavel, Lock } from 'lucide-react';
import React from 'react';
import { useSocket } from '../../context/SocketContext';

interface PropertyActionModalProps {
  onOpenManageModal?: () => void;
}

export const PropertyActionModal: React.FC<PropertyActionModalProps> = ({ onOpenManageModal }) => {
  const {
    gameState,
    myPlayerId,
    buyProperty,
    passProperty,
    isPawnStepping,
    turnPresentationPhase,
  } = useSocket();

  if (!gameState) return null;

  const currentP = gameState.players[gameState.turn.currentPlayerId];
  const isMyTurn = currentP?.id === myPlayerId;
  const isPendingBuy = gameState.turn.pendingAction === 'buy_property';

  // Strictly enforce sequential presentation pacing before opening action modals
  if (
    !isMyTurn ||
    !isPendingBuy ||
    isPawnStepping ||
    turnPresentationPhase !== 'ACTION'
  ) {
    return null;
  }

  const tile = gameState.board[currentP.position];
  if (!tile || !tile.price) return null;

  const canAfford = currentP.cash >= tile.price;
  const hasOtherProperties = currentP.inventory.properties.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        {/* Deed Top Header */}
        <div
          className="h-16 w-full flex items-center justify-center font-black text-base sm:text-lg text-white uppercase tracking-wider text-center px-4 shadow-md font-display"
          style={{ backgroundColor: tile.color || '#3B82F6' }}
        >
          {tile.name}
        </div>

        {/* Deed Content */}
        <div className="p-6 flex flex-col gap-4">
          <div className="text-center">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider font-display">
              PURCHASE PRICE
            </div>
            <div className="font-mono text-3xl font-black text-emerald-400 mt-0.5 tabular-nums">
              ${tile.price}
            </div>
          </div>

          {/* Rent Breakdown */}
          {tile.rent && (
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs font-mono text-slate-300">
              <div className="flex justify-between font-bold text-white">
                <span>Base Rent:</span>
                <span className="text-emerald-400 tabular-nums">${tile.rent[0]}</span>
              </div>
              <div className="flex justify-between">
                <span>With 1 House:</span>
                <span className="tabular-nums">${tile.rent[1]}</span>
              </div>
              <div className="flex justify-between">
                <span>With 2 Houses:</span>
                <span className="tabular-nums">${tile.rent[2]}</span>
              </div>
              <div className="flex justify-between">
                <span>With 3 Houses:</span>
                <span className="tabular-nums">${tile.rent[3]}</span>
              </div>
              <div className="flex justify-between">
                <span>With 4 Houses:</span>
                <span className="tabular-nums">${tile.rent[4]}</span>
              </div>
              <div className="flex justify-between font-black text-amber-300">
                <span>With Hotel:</span>
                <span className="tabular-nums">${tile.rent[5]}</span>
              </div>
            </div>
          )}

          {/* Wallet check */}
          <div className="text-xs text-slate-400 text-center font-sans">
            Your Wallet:{' '}
            <span className="font-mono font-bold text-white tabular-nums">
              ${currentP.cash}
            </span>
          </div>

          {/* Mortgage Assets Shortcut if cash is low and player owns other properties */}
          {hasOtherProperties && onOpenManageModal && (
            <button
              onClick={onOpenManageModal}
              className="w-full py-2.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Mortgage Assets to Raise Cash</span>
            </button>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => buyProperty()}
              disabled={!canAfford}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-1.5 btn-tactile font-mono"
            >
              <Check className="w-4 h-4" />
              <span>BUY (${tile.price})</span>
            </button>

            <button
              onClick={() => passProperty()}
              className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs transition flex items-center justify-center gap-1.5 btn-tactile"
            >
              <Gavel className="w-4 h-4 text-amber-400" />
              <span>PASS {gameState.rules.allowAuctions ? '/ AUCTION' : ''}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

