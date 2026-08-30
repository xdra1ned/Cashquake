import { Building, Building2, ChevronRight, DollarSign, Home, Lock, Plus, ShieldAlert, Sparkles, Trash2, Unlock, X } from 'lucide-react';
import React, { useState } from 'react';
import {
  canBuildHouse,
  canMortgage,
  canSellHouse,
  canSellProperty,
  canUnmortgage,
  ownsFullSet,
} from '@shared/gameLogic';
import { BoardTile } from '@shared/types';
import { useSocket } from '../../context/SocketContext';

interface ManagePropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManagePropertiesModal: React.FC<ManagePropertiesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    gameState,
    myPlayerId,
    buildHouse,
    sellHouse,
    mortgageProperty,
    unmortgageProperty,
    sellProperty,
  } = useSocket();

  const [confirmSellId, setConfirmSellId] = useState<string | null>(null);

  if (!isOpen || !gameState || !myPlayerId) return null;

  const myPlayer = gameState.players[myPlayerId];
  if (!myPlayer) return null;

  const ownedTiles: BoardTile[] = myPlayer.inventory.properties
    .map((id) => gameState.board.find((t) => t.id === id)!)
    .filter(Boolean);

  // Group tiles by color group
  const groupedTiles: Record<string, BoardTile[]> = {};
  for (const t of ownedTiles) {
    const grp = t.group || 'other';
    if (!groupedTiles[grp]) groupedTiles[grp] = [];
    groupedTiles[grp].push(t);
  }

  const handleSellProperty = async (tileId: string) => {
    try {
      await sellProperty(tileId);
      setConfirmSellId(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Property Portfolio</h2>
              <p className="text-xs text-slate-400">Construct buildings, manage mortgages, and liquidate assets</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="font-mono text-xs text-emerald-400 font-bold px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              Wallet: ${myPlayer.cash}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {ownedTiles.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Building className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-semibold">You do not own any properties yet.</p>
              <p className="text-xs text-slate-600 mt-1">
                Roll the dice and land on unowned tiles to start building your empire!
              </p>
            </div>
          ) : (
            Object.entries(groupedTiles).map(([group, tiles]) => {
              const hasMonopoly =
                group !== 'other' &&
                group !== 'railroad' &&
                group !== 'utility' &&
                ownsFullSet(myPlayer, group as any, gameState.board);

              return (
                <div
                  key={group}
                  className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: tiles[0]?.color || '#64748B' }}
                      />
                      <span className="font-bold text-sm text-white capitalize">{group} Set</span>
                    </div>

                    {hasMonopoly && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Monopoly Active (Double Rent)
                      </span>
                    )}
                  </div>

                  {/* Properties list */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {tiles.map((tile) => {
                      const houseCount = myPlayer.inventory.houses[tile.id] || 0;
                      const isMortgaged = myPlayer.inventory.mortgaged[tile.id] || false;

                      const buildCheck = canBuildHouse(myPlayer, tile.id, gameState.board, gameState.rules);
                      const sellCheck = canSellHouse(myPlayer, tile.id, gameState.board, gameState.rules);
                      const mortgageCheck = canMortgage(myPlayer, tile.id, gameState.board);
                      const unmortgageCheck = canUnmortgage(myPlayer, tile.id, gameState.board, gameState.rules);
                      const sellPropCheck = canSellProperty(myPlayer, tile.id, gameState.board);
                      const isConfirmingThis = confirmSellId === tile.id;

                      return (
                        <div
                          key={tile.id}
                          className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
                        >
                          <div>
                            <div className="flex items-center gap-2 font-bold text-white text-sm">
                              <span>{tile.name}</span>
                              {isMortgaged && (
                                <span className="px-1.5 py-0.5 rounded-lg bg-rose-950 border border-rose-500 text-rose-300 text-[10px] uppercase font-bold">
                                  Mortgaged
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                              <span>Value: ${tile.price}</span>
                              <span>•</span>
                              <span>
                                Buildings:{' '}
                                {houseCount === 5 ? (
                                  <span className="text-amber-300 font-bold">🏨 Hotel</span>
                                ) : houseCount > 0 ? (
                                  <span className="text-emerald-400 font-bold">
                                    {houseCount} 🏠 House{houseCount > 1 ? 's' : ''}
                                  </span>
                                ) : (
                                  '0'
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {/* Build House */}
                            {tile.houseCost && (
                              <button
                                disabled={!buildCheck.canBuild}
                                onClick={() => buildHouse(tile.id)}
                                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white font-bold text-xs flex items-center gap-1 transition shadow-sm btn-tactile"
                                title={buildCheck.reason || `Build House for $${tile.houseCost}`}
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Build (${tile.houseCost})</span>
                              </button>
                            )}

                            {/* Sell House / Building (Visible when houses exist) */}
                            {houseCount > 0 && (
                              <button
                                disabled={!sellCheck.canSell}
                                onClick={() => sellHouse(tile.id)}
                                className="px-3 py-2 rounded-xl bg-amber-600/90 hover:bg-amber-600 disabled:opacity-30 text-white font-bold text-xs transition shadow-sm btn-tactile"
                                title={sellCheck.reason || `Sell Building for +$${sellCheck.refund}`}
                              >
                                <span>Sell House (+${sellCheck.refund})</span>
                              </button>
                            )}

                            {/* Mortgage / Unmortgage */}
                            {!isMortgaged ? (
                              <button
                                disabled={!mortgageCheck.canMortgage}
                                onClick={() => mortgageProperty(tile.id)}
                                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-amber-300 font-bold text-xs transition border border-slate-700 btn-tactile"
                                title={mortgageCheck.reason || `Mortgage for +$${tile.mortgageValue}`}
                              >
                                <Lock className="w-3 h-3 inline mr-1" />
                                <span>Mortgage (+${tile.mortgageValue})</span>
                              </button>
                            ) : (
                              <button
                                disabled={!unmortgageCheck.canUnmortgage}
                                onClick={() => unmortgageProperty(tile.id)}
                                className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white font-bold text-xs transition shadow-sm btn-tactile"
                                title={unmortgageCheck.reason || `Unmortgage for -$${unmortgageCheck.cost}`}
                              >
                                <Unlock className="w-3 h-3 inline mr-1" />
                                <span>Unmortgage (-${unmortgageCheck.cost})</span>
                              </button>
                            )}

                            {/* Individual Sell Property Button */}
                            {isConfirmingThis ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleSellProperty(tile.id)}
                                  className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition shadow-md animate-pulse"
                                >
                                  Confirm (+${sellPropCheck.value})
                                </button>
                                <button
                                  onClick={() => setConfirmSellId(null)}
                                  className="px-2.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                disabled={!sellPropCheck.canSell}
                                onClick={() => setConfirmSellId(tile.id)}
                                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:border-rose-500/50 disabled:opacity-30 text-rose-300 border border-slate-700 font-bold text-xs transition btn-tactile"
                                title={sellPropCheck.reason || `Sell ${tile.name} back to the bank for +$${sellPropCheck.value}`}
                              >
                                <Trash2 className="w-3 h-3 inline mr-1 text-rose-400" />
                                <span>Sell Property (+${sellPropCheck.value})</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
