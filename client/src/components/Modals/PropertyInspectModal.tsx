import {
  Building,
  CheckCircle,
  Coins,
  DollarSign,
  Eye,
  Handshake,
  Home,
  Hotel,
  Info,
  Layers,
  Lock,
  Trash2,
  Unlock,
  User,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { COLOR_GROUP_HEX } from '@shared/constants';
import {
  canBuildHouse,
  canMortgage,
  canSellHouse,
  canSellProperty,
  canUnmortgage,
} from '@shared/gameLogic';
import { BoardTile, Player } from '@shared/types';
import { useSocket } from '../../context/SocketContext';

interface PropertyInspectModalProps {
  tile: BoardTile | null;
  onClose: () => void;
  onOpenTradeModal?: (targetPlayerId?: string) => void;
}

export const PropertyInspectModal: React.FC<PropertyInspectModalProps> = ({
  tile,
  onClose,
  onOpenTradeModal,
}) => {
  const {
    gameState,
    myPlayerId,
    mortgageProperty,
    unmortgageProperty,
    buildHouse,
    sellHouse,
    sellProperty,
  } = useSocket();

  const [confirmSell, setConfirmSell] = useState(false);

  if (!tile) return null;

  const isProperty = tile.type === 'property';
  const isRailroad = tile.type === 'railroad';
  const isUtility = tile.type === 'utility';

  // Find owner if any
  const owner = gameState
    ? Object.values(gameState.players).find(
        (p) => !p.isBankrupt && p.inventory.properties.includes(tile.id)
      )
    : undefined;

  const isMyProperty = owner?.id === myPlayerId;
  const myPlayer = gameState && myPlayerId ? gameState.players[myPlayerId] : undefined;
  const isMortgaged = owner?.inventory.mortgaged[tile.id] || false;
  const houseCount = owner?.inventory.houses[tile.id] || 0;
  const isHotel = houseCount === 5;

  const groupColor = tile.group ? COLOR_GROUP_HEX[tile.group] || '#64748B' : '#64748B';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm sm:max-w-md rounded-2xl bg-slate-900 border-2 border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in"
      >
        {/* Title Deed Header */}
        <div
          className="px-6 py-4 flex items-center justify-between text-white shadow-md relative"
          style={{ backgroundColor: groupColor }}
        >
          <div className="flex-1 min-w-0 pr-4">
            <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-white/80 block">
              {tile.group ? tile.group.replace('_', ' ').toUpperCase() : 'TITLE DEED'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black truncate font-display drop-shadow-sm">
              {tile.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Deed Card Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Ownership Status Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shadow-inner"
                style={{
                  backgroundColor: owner ? `${owner.customization.color}30` : '#33415540',
                  border: `1.5px solid ${owner ? owner.customization.color : '#475569'}`,
                }}
              >
                <User className="w-4 h-4" style={{ color: owner ? owner.customization.color : '#94A3B8' }} />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Ownership
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{owner ? owner.name : 'Unowned / For Sale'}</span>
                  {isMyProperty && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                      You
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Price tag */}
            {tile.price && (
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Value
                </div>
                <div className="font-mono text-base font-black text-emerald-400 tabular-nums">
                  ${tile.price}
                </div>
              </div>
            )}
          </div>

          {/* Status Alert if Mortgaged or Built */}
          {isMortgaged && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-400 shrink-0" />
              <span>Property is currently MORTGAGED (Rent cannot be collected).</span>
            </div>
          )}

          {houseCount > 0 && !isMortgaged && (
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isHotel ? <Hotel className="w-4 h-4 text-amber-400" /> : <Home className="w-4 h-4 text-emerald-400" />}
                <span>Development Level:</span>
              </div>
              <span className="font-mono font-black text-white">
                {isHotel ? '🏨 1 HOTEL' : `🏠 ${houseCount} ${houseCount === 1 ? 'HOUSE' : 'HOUSES'}`}
              </span>
            </div>
          )}

          {/* Full Rent Schedule Table */}
          {tile.rent && isProperty && (
            <div className="rounded-xl bg-slate-950/50 border border-slate-800 overflow-hidden text-xs">
              <div className="px-4 py-2 bg-slate-800/60 font-bold text-slate-300 uppercase text-[10px] tracking-wider border-b border-slate-800 flex justify-between items-center">
                <span>Rent Schedule</span>
                <span className="text-slate-400">Standard Rates</span>
              </div>

              <div className="divide-y divide-slate-800/60 font-mono">
                <div className={`px-4 py-2 flex justify-between items-center ${houseCount === 0 && owner && !isMortgaged ? 'bg-amber-500/10 font-bold text-amber-300' : 'text-slate-300'}`}>
                  <span className="font-sans">Base Rent (Unimproved)</span>
                  <span className="text-emerald-400 tabular-nums">${tile.rent[0]}</span>
                </div>
                <div className={`px-4 py-2 flex justify-between items-center ${houseCount === 1 ? 'bg-amber-500/10 font-bold text-amber-300' : 'text-slate-300'}`}>
                  <span className="font-sans">With 1 House (🏠)</span>
                  <span className="text-emerald-400 tabular-nums">${tile.rent[1]}</span>
                </div>
                <div className={`px-4 py-2 flex justify-between items-center ${houseCount === 2 ? 'bg-amber-500/10 font-bold text-amber-300' : 'text-slate-300'}`}>
                  <span className="font-sans">With 2 Houses (🏠🏠)</span>
                  <span className="text-emerald-400 tabular-nums">${tile.rent[2]}</span>
                </div>
                <div className={`px-4 py-2 flex justify-between items-center ${houseCount === 3 ? 'bg-amber-500/10 font-bold text-amber-300' : 'text-slate-300'}`}>
                  <span className="font-sans">With 3 Houses (🏠🏠🏠)</span>
                  <span className="text-emerald-400 tabular-nums">${tile.rent[3]}</span>
                </div>
                <div className={`px-4 py-2 flex justify-between items-center ${houseCount === 4 ? 'bg-amber-500/10 font-bold text-amber-300' : 'text-slate-300'}`}>
                  <span className="font-sans">With 4 Houses (🏠🏠🏠🏠)</span>
                  <span className="text-emerald-400 tabular-nums">${tile.rent[4]}</span>
                </div>
                <div className={`px-4 py-2.5 flex justify-between items-center ${houseCount === 5 ? 'bg-amber-500/20 font-black text-amber-300' : 'text-amber-300 font-bold'}`}>
                  <span className="font-sans flex items-center gap-1.5">With Hotel (🏨)</span>
                  <span className="tabular-nums text-sm">${tile.rent[5]}</span>
                </div>
              </div>
            </div>
          )}

          {/* Railroad Rent Table */}
          {isRailroad && tile.rent && (
            <div className="rounded-xl bg-slate-950/50 border border-slate-800 overflow-hidden text-xs">
              <div className="px-4 py-2 bg-slate-800/60 font-bold text-slate-300 uppercase text-[10px] tracking-wider border-b border-slate-800">
                Transit Line Rent
              </div>
              <div className="divide-y divide-slate-800/60 font-mono text-slate-300">
                <div className="px-4 py-2 flex justify-between"><span>If 1 Transit Owned:</span><span className="text-emerald-400">${tile.rent[0]}</span></div>
                <div className="px-4 py-2 flex justify-between"><span>If 2 Transits Owned:</span><span className="text-emerald-400">${tile.rent[1]}</span></div>
                <div className="px-4 py-2 flex justify-between"><span>If 3 Transits Owned:</span><span className="text-emerald-400">${tile.rent[2]}</span></div>
                <div className="px-4 py-2 flex justify-between font-bold text-amber-300"><span>If 4 Transits Owned:</span><span>${tile.rent[3]}</span></div>
              </div>
            </div>
          )}

          {/* Utility Rent Table */}
          {isUtility && (
            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-xs space-y-1.5 text-slate-300">
              <div className="font-bold text-white uppercase text-[10px] tracking-wider">Utility Multipliers</div>
              <div className="flex justify-between font-mono"><span>1 Utility Owned:</span><span className="text-emerald-400">4× Dice Roll</span></div>
              <div className="flex justify-between font-mono font-bold text-amber-300"><span>2 Utilities Owned:</span><span>10× Dice Roll</span></div>
            </div>
          )}

          {/* Financial Metrics Footer */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {tile.houseCost && (
              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans font-semibold">House / Hotel Cost</div>
                <div className="text-white font-bold tabular-nums mt-0.5">${tile.houseCost} each</div>
              </div>
            )}
            {tile.mortgageValue && (
              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans font-semibold">Mortgage Value</div>
                <div className="text-amber-400 font-bold tabular-nums mt-0.5">${tile.mortgageValue}</div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col gap-2">
          {isMyProperty ? (
            <div className="w-full flex flex-col gap-2">
              {/* Direct Build House / Build Hotel Button */}
              {isProperty && (
                <button
                  disabled={
                    !myPlayer ||
                    !canBuildHouse(
                      myPlayer,
                      tile.id,
                      gameState?.board || [],
                      gameState?.rules as any,
                      gameState?.turn.currentPlayerId
                    ).canBuild
                  }
                  onClick={async () => {
                    await buildHouse(tile.id);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-35 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition btn-tactile shadow-md font-mono"
                  title={
                    myPlayer
                      ? canBuildHouse(
                          myPlayer,
                          tile.id,
                          gameState?.board || [],
                          gameState?.rules as any,
                          gameState?.turn.currentPlayerId
                        ).reason
                      : undefined
                  }
                >
                  {houseCount === 4 ? (
                    <>
                      <Hotel className="w-3.5 h-3.5 text-amber-300" />
                      <span>
                        Upgrade to Hotel (-${myPlayer ? canBuildHouse(myPlayer, tile.id, gameState?.board || [], gameState?.rules as any, gameState?.turn.currentPlayerId).cost : tile.houseCost || 0})
                      </span>
                    </>
                  ) : (
                    <>
                      <Home className="w-3.5 h-3.5 text-emerald-300" />
                      <span>
                        Build House (-${myPlayer ? canBuildHouse(myPlayer, tile.id, gameState?.board || [], gameState?.rules as any, gameState?.turn.currentPlayerId).cost : tile.houseCost || 0})
                      </span>
                    </>
                  )}
                </button>
              )}

              {/* House Sell Button if houses exist */}
              {houseCount > 0 && (
                <button
                  disabled={
                    !myPlayer ||
                    !canSellHouse(
                      myPlayer,
                      tile.id,
                      gameState?.board || [],
                      gameState?.rules as any,
                      gameState?.turn.currentPlayerId
                    ).canSell
                  }
                  onClick={async () => {
                    await sellHouse(tile.id);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-600/90 hover:bg-amber-600 disabled:opacity-35 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition btn-tactile shadow-md font-mono"
                  title={
                    myPlayer
                      ? canSellHouse(
                          myPlayer,
                          tile.id,
                          gameState?.board || [],
                          gameState?.rules as any,
                          gameState?.turn.currentPlayerId
                        ).reason
                      : undefined
                  }
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>
                    Sell Building (+${myPlayer ? canSellHouse(myPlayer, tile.id, gameState?.board || [], gameState?.rules as any, gameState?.turn.currentPlayerId).refund : 0})
                  </span>
                </button>
              )}

              <div className="w-full flex items-center gap-2">
                {isMortgaged ? (
                  <button
                    disabled={!myPlayer || !canUnmortgage(myPlayer, tile.id, gameState?.board || [], gameState?.rules as any).canUnmortgage}
                    onClick={() => {
                      unmortgageProperty(tile.id);
                      onClose();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition btn-tactile shadow-md"
                    title={myPlayer ? canUnmortgage(myPlayer, tile.id, gameState?.board || [], gameState?.rules as any).reason : undefined}
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>
                      Unmortgage (-${myPlayer ? canUnmortgage(myPlayer, tile.id, gameState?.board || [], gameState?.rules as any).cost : 0})
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      mortgageProperty(tile.id);
                      onClose();
                    }}
                    disabled={!myPlayer || !canMortgage(myPlayer, tile.id, gameState?.board || []).canMortgage}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-30 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition btn-tactile shadow-md"
                    title={myPlayer ? canMortgage(myPlayer, tile.id, gameState?.board || []).reason : undefined}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Mortgage (+${tile.mortgageValue})</span>
                  </button>
                )}

                {/* Individual Sell Property */}
                {confirmSell ? (
                  <div className="flex-1 flex items-center gap-1">
                    <button
                      onClick={async () => {
                        await sellProperty(tile.id);
                        onClose();
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition shadow-md animate-pulse"
                    >
                      Confirm (+${myPlayer ? canSellProperty(myPlayer, tile.id, gameState?.board || []).value : 0})
                    </button>
                    <button
                      onClick={() => setConfirmSell(false)}
                      className="px-2.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={!myPlayer || !canSellProperty(myPlayer, tile.id, gameState?.board || []).canSell}
                    onClick={() => setConfirmSell(true)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/70 hover:border-rose-500/50 border border-slate-700 disabled:opacity-30 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition btn-tactile"
                    title={myPlayer ? canSellProperty(myPlayer, tile.id, gameState?.board || []).reason : undefined}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Sell (+${myPlayer ? canSellProperty(myPlayer, tile.id, gameState?.board || []).value : 0})</span>
                  </button>
                )}
              </div>
            </div>
          ) : owner && onOpenTradeModal ? (
            <button
              onClick={() => {
                onClose();
                onOpenTradeModal(owner.id);
              }}
              className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition btn-tactile shadow-md"
            >
              <Handshake className="w-4 h-4" />
              <span>Propose Trade with {owner.name}</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
