import {
  AlertOctagon,
  ArrowLeftRight,
  Building,
  CheckCircle2,
  Coins,
  DollarSign,
  HelpCircle,
  Home,
  LogOut,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { COLOR_GROUP_HEX } from '@shared/constants';
import { ColorGroup } from '@shared/types';
import { useSocket } from '../../context/SocketContext';

interface BankruptcyModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenManageModal?: () => void;
  onOpenTradeModal?: () => void;
}

export const BankruptcyModal: React.FC<BankruptcyModalProps> = ({
  isOpen: forceOpen,
  onClose,
  onOpenManageModal,
  onOpenTradeModal,
}) => {
  const { gameState, myPlayerId, declareBankruptcy, sellHouse, mortgageProperty } = useSocket();
  const [confirmSurrender, setConfirmSurrender] = useState(false);

  if (!gameState || !myPlayerId) return null;
  const myPlayer = gameState.players[myPlayerId];
  if (!myPlayer || myPlayer.isBankrupt) return null;

  // Auto-display if in negative debt, or if user opened the bankruptcy/liquidation modal
  const isInDebt = myPlayer.cash < 0;
  const showModal = forceOpen || isInDebt;

  if (!showModal) return null;

  const debtAmount = Math.abs(myPlayer.cash);
  const myProperties = gameState.board.filter((t) => myPlayer.inventory.properties.includes(t.id));

  // Calculate liquidatable value
  let totalBuildingRefund = 0;
  let totalMortgageValue = 0;

  const liquidatableBuildings: { tileId: string; name: string; count: number; refundEach: number }[] = [];
  const mortgagableProperties: { tileId: string; name: string; mortgageValue: number; group?: ColorGroup }[] = [];

  myProperties.forEach((t) => {
    const houseCount = myPlayer.inventory.houses[t.id] || 0;
    if (houseCount > 0 && t.houseCost) {
      const refund = Math.floor(t.houseCost / 2);
      totalBuildingRefund += refund * houseCount;
      liquidatableBuildings.push({
        tileId: t.id,
        name: t.name,
        count: houseCount,
        refundEach: refund,
      });
    }

    const isMortgaged = !!myPlayer.inventory.mortgaged?.[t.id];
    if (!isMortgaged && houseCount === 0 && t.price) {
      const val = Math.floor(t.price / 2);
      totalMortgageValue += val;
      mortgagableProperties.push({
        tileId: t.id,
        name: t.name,
        mortgageValue: val,
        group: t.group as ColorGroup | undefined,
      });
    }
  });

  const totalLiquidity = myPlayer.cash + totalBuildingRefund + totalMortgageValue;
  const canSelfRecover = totalLiquidity >= 0;

  const handleSurrender = () => {
    declareBankruptcy();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-lg max-h-[92vh] rounded-3xl bg-slate-900 border-2 border-rose-500/60 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-950/90 via-slate-900 to-rose-950/70 border-b border-rose-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-inner">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-black text-rose-400 tracking-widest font-display uppercase">
                {isInDebt ? 'DEBT RESOLUTION & LIQUIDATION' : 'FINANCIAL ASSET OVERVIEW'}
              </div>
              <h3 className="font-extrabold text-white text-base sm:text-lg font-display">
                {isInDebt ? `Outstanding Obligation: $${debtAmount}` : 'Surrender & Bankruptcy'}
              </h3>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Balance & Debt Status Callout */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-rose-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display block">
                Current Cash Balance
              </span>
              <span
                className={`font-mono text-2xl sm:text-3xl font-black tabular-nums ${
                  myPlayer.cash < 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                ${myPlayer.cash}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display block">
                Potential Liquidity
              </span>
              <span
                className={`font-mono text-lg font-bold tabular-nums ${
                  totalLiquidity >= 0 ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                ${totalLiquidity} Max
              </span>
            </div>
          </div>

          {/* Guidance Message */}
          {isInDebt && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200/90 leading-relaxed">
              <strong>Rules Obligation:</strong> You must raise at least{' '}
              <strong className="text-white font-mono">${debtAmount}</strong> to return your balance to $0 before
              you can roll dice or end your turn. You can sell buildings, mortgage properties, or negotiate trades with
              players.
            </div>
          )}

          {/* Quick Action: Liquidatable Buildings */}
          {liquidatableBuildings.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-display flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sell Buildings for 50% Refund</span>
                </span>
                <span className="text-[10px] text-amber-300 font-mono">
                  +${totalBuildingRefund} total available
                </span>
              </div>

              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {liquidatableBuildings.map((b) => (
                  <div
                    key={b.tileId}
                    className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{b.name}</span>
                      <span className="text-slate-400 ml-1.5 font-mono text-[11px]">
                        ({b.count === 5 ? 'Hotel' : `${b.count} Houses`})
                      </span>
                    </div>
                    <button
                      onClick={() => sellHouse(b.tileId)}
                      className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold font-mono text-xs transition"
                    >
                      Sell (-1) +${b.refundEach}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Action: Mortgagable Properties */}
          {mortgagableProperties.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-display flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Mortgage Properties for 50% Value</span>
                </span>
                <span className="text-[10px] text-cyan-300 font-mono">
                  +${totalMortgageValue} total available
                </span>
              </div>

              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {mortgagableProperties.map((p) => {
                  const groupCol = p.group ? COLOR_GROUP_HEX[p.group] || '#38BDF8' : '#38BDF8';
                  return (
                    <div
                      key={p.tileId}
                      className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: groupCol }} />
                        <span className="font-bold text-white">{p.name}</span>
                      </div>
                      <button
                        onClick={() => mortgageProperty(p.tileId)}
                        className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold font-mono text-xs transition"
                      >
                        Mortgage +${p.mortgageValue}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Shortcut Buttons for Portfolio & Trading */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {onOpenManageModal && (
              <button
                onClick={() => {
                  if (onClose) onClose();
                  onOpenManageModal();
                }}
                className="py-2.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Building className="w-3.5 h-3.5" />
                <span>Full Portfolio</span>
              </button>
            )}

            {onOpenTradeModal && (
              <button
                onClick={() => {
                  if (onClose) onClose();
                  onOpenTradeModal();
                }}
                className="py-2.5 px-3 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Trade With Players</span>
              </button>
            )}
          </div>

          {/* Bankruptcy Surrender Confirmation Section */}
          <div className="pt-3 border-t border-slate-800">
            {!confirmSurrender ? (
              <button
                onClick={() => setConfirmSurrender(true)}
                className="w-full py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Declare Bankruptcy & Surrender Game</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/60 space-y-3 animate-fade-in">
                <div className="text-xs font-bold text-rose-200 flex items-center gap-2 font-display">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  <span>Confirm Voluntary / Final Bankruptcy</span>
                </div>

                {/* Asset summary pill */}
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-rose-900/60 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Cash</span>
                    <span className="font-mono font-black text-slate-200">${myPlayer.cash}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Deeds</span>
                    <span className="font-mono font-black text-slate-200">{myProperties.length}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Buildings</span>
                    <span className="font-mono font-black text-slate-200">
                      {Object.values(myPlayer.inventory.houses).reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-rose-200/90 leading-relaxed font-sans">
                  <strong>Warning:</strong> Declaring bankruptcy will <strong>permanently remove you from active play</strong>.
                  All your properties and buildings will immediately be returned to the Bank as unowned and become available
                  for other players to purchase according to standard rules. You will transition into Spectator Mode for the
                  remainder of the match.
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setConfirmSurrender(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSurrender}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs transition shadow-lg btn-tactile font-display"
                  >
                    Confirm Bankruptcy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
