import { ArrowLeftRight, Check, DollarSign, Eye, Handshake, Shield, Sparkles, X } from 'lucide-react';
import React, { useState } from 'react';
import { COLOR_GROUP_HEX } from '@shared/constants';
import { BoardTile, Player, TradeOffer } from '@shared/types';
import { useSocket } from '../../context/SocketContext';
import { AvatarSilhouette } from '../Avatars/AvatarSilhouette';

interface TradingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TradingModal: React.FC<TradingModalProps> = ({ isOpen, onClose }) => {
  const { gameState, myPlayerId, proposeTrade, respondTrade } = useSocket();

  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [offeredCash, setOfferedCash] = useState<number>(0);
  const [offeredProperties, setOfferedProperties] = useState<string[]>([]);
  const [offeredCards, setOfferedCards] = useState<number>(0);

  const [requestedCash, setRequestedCash] = useState<number>(0);
  const [requestedProperties, setRequestedProperties] = useState<string[]>([]);
  const [requestedCards, setRequestedCards] = useState<number>(0);

  if (!isOpen || !gameState || !myPlayerId) return null;

  const myPlayer = gameState.players[myPlayerId];
  if (!myPlayer) return null;

  const otherPlayers = Object.values(gameState.players).filter(
    (p) => p.id !== myPlayerId && !p.isBankrupt
  );

  const targetPlayer = selectedTargetId
    ? gameState.players[selectedTargetId]
    : otherPlayers[0];

  const activeTrade = gameState.activeTrade;
  const isTradeForMe = activeTrade && activeTrade.toPlayerId === myPlayerId;
  const isTradeFromMe = activeTrade && activeTrade.fromPlayerId === myPlayerId;
  const isSpectatingTrade =
    activeTrade &&
    !isTradeForMe &&
    !isTradeFromMe &&
    (gameState.rules.spectateTrades || myPlayer.isSpectator);

  const getTile = (id: string): BoardTile | undefined => {
    return gameState.board.find((t) => t.id === id);
  };

  const handleToggleOfferedProp = (propId: string) => {
    setOfferedProperties((prev) =>
      prev.includes(propId) ? prev.filter((id) => id !== propId) : [...prev, propId]
    );
  };

  const handleToggleRequestedProp = (propId: string) => {
    setRequestedProperties((prev) =>
      prev.includes(propId) ? prev.filter((id) => id !== propId) : [...prev, propId]
    );
  };

  const handlePropose = async () => {
    if (!targetPlayer) return;
    try {
      await proposeTrade({
        toPlayerId: targetPlayer.id,
        offeredCash,
        offeredProperties,
        offeredCards,
        requestedCash,
        requestedProperties,
        requestedCards,
      });
      onClose();
    } catch (e) {}
  };

  // Render incoming / ongoing trade review breakdown
  const renderActiveTradeBreakdown = (trade: TradeOffer) => {
    const fromPlayer = gameState.players[trade.fromPlayerId];
    const toPlayer = gameState.players[trade.toPlayerId];

    return (
      <div className="space-y-4 font-sans">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-pink-950/60 border border-pink-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AvatarSilhouette
              avatarId={fromPlayer?.customization.avatarId || fromPlayer?.customization.avatarIcon}
              color={fromPlayer?.customization.color}
              size={24}
            />
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                {isTradeForMe ? 'Trade Proposal Received' : isTradeFromMe ? 'Your Outgoing Proposal' : 'Live Match Trade'}
              </span>
              <div className="text-sm font-black text-white font-display">
                <span style={{ color: fromPlayer?.customization.color }}>{fromPlayer?.name}</span>
                <span className="text-slate-400 font-normal mx-2">⇄</span>
                <span style={{ color: toPlayer?.customization.color }}>{toPlayer?.name}</span>
              </div>
            </div>
          </div>

          {isSpectatingTrade && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold font-mono">
              <Eye className="w-3.5 h-3.5" />
              <span>Spectating</span>
            </div>
          )}
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Side 1: What FromPlayer Gives */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 font-display">
                {isTradeForMe ? '🎁 They Give You' : `🎁 ${fromPlayer?.name} Gives`}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                +${trade.offeredCash}
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] text-slate-400 font-bold uppercase">Properties Offered:</div>
              {trade.offeredProperties.length === 0 ? (
                <div className="text-xs text-slate-500 italic">No properties included in offer.</div>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {trade.offeredProperties.map((pId) => {
                    const tile = getTile(pId);
                    const groupColor = tile?.group ? COLOR_GROUP_HEX[tile.group] || '#3B82F6' : '#3B82F6';
                    return (
                      <div
                        key={pId}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: groupColor }} />
                          <span className="font-bold text-white">{tile?.name}</span>
                        </div>
                        <span className="font-mono text-[11px] text-emerald-400 font-bold">${tile?.price}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {trade.offeredCards > 0 && (
                <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold">
                  🎫 {trade.offeredCards}x Get Out of Jail Free Card
                </div>
              )}
            </div>
          </div>

          {/* Side 2: What ToPlayer Gives */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-rose-500/40 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-rose-400 font-display">
                {isTradeForMe ? '📤 You Give Them' : `📤 ${toPlayer?.name} Gives`}
              </span>
              <span className="text-xs font-mono font-bold text-rose-400">
                -${trade.requestedCash}
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] text-slate-400 font-bold uppercase">Properties Requested:</div>
              {trade.requestedProperties.length === 0 ? (
                <div className="text-xs text-slate-500 italic">No properties requested.</div>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {trade.requestedProperties.map((pId) => {
                    const tile = getTile(pId);
                    const groupColor = tile?.group ? COLOR_GROUP_HEX[tile.group] || '#3B82F6' : '#3B82F6';
                    return (
                      <div
                        key={pId}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: groupColor }} />
                          <span className="font-bold text-white">{tile?.name}</span>
                        </div>
                        <span className="font-mono text-[11px] text-rose-400 font-bold">${tile?.price}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {trade.requestedCards > 0 && (
                <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold">
                  🎫 {trade.requestedCards}x Get Out of Jail Free Card
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        {isTradeForMe && (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                respondTrade(trade.id, 'accept');
                onClose();
              }}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/30 transition btn-tactile font-display"
            >
              Accept This Trade Offer
            </button>
            <button
              onClick={() => {
                respondTrade(trade.id, 'decline');
                onClose();
              }}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-white font-bold text-xs transition"
            >
              Decline Offer
            </button>
          </div>
        )}

        {isTradeFromMe && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">Waiting for {toPlayer?.name} to respond...</span>
            <button
              onClick={() => {
                respondTrade(trade.id, 'decline');
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-xs transition"
            >
              Cancel Trade Offer
            </button>
          </div>
        )}

        {isSpectatingTrade && (
          <div className="text-center p-3 rounded-xl bg-slate-800/40 text-xs text-slate-400 font-sans">
            You are spectating this ongoing trade negotiation in read-only mode.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 shadow-inner">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white font-display">
                {activeTrade ? 'Active Trade Negotiation' : 'Trading Floor'}
              </h2>
              <p className="text-xs text-slate-400">
                {activeTrade
                  ? 'Review property deeds and cash terms'
                  : 'Negotiate property and cash swaps with other tycoons'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTrade ? (
            renderActiveTradeBreakdown(activeTrade)
          ) : (
            <>
              {/* Target Player Picker */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
                  Trade Partner:
                </label>
                <select
                  value={targetPlayer?.id || ''}
                  onChange={(e) => setSelectedTargetId(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-xs focus:outline-none focus:border-pink-500 font-sans"
                >
                  {otherPlayers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.cash})
                    </option>
                  ))}
                </select>
              </div>

              {/* Two-Sided Trade Arena */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* YOUR OFFER */}
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex flex-col gap-3">
                  <div className="font-bold text-sm text-pink-400 flex items-center justify-between font-display">
                    <span>YOU OFFER ({myPlayer.name})</span>
                    <span className="font-mono text-xs text-slate-400">Cash: ${myPlayer.cash}</span>
                  </div>

                  {/* Cash Slider */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Cash to Give:</span>
                      <span className="font-mono font-bold text-emerald-400">${offeredCash}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={myPlayer.cash}
                      step="25"
                      value={offeredCash}
                      onChange={(e) => setOfferedCash(Number(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </div>

                  {/* Property Selectors */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 font-display">
                      Your Properties ({myPlayer.inventory.properties.length}):
                    </label>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {myPlayer.inventory.properties.length === 0 ? (
                        <div className="text-xs text-slate-500 italic">No properties owned yet.</div>
                      ) : (
                        myPlayer.inventory.properties.map((pId) => {
                          const tile = getTile(pId);
                          const selected = offeredProperties.includes(pId);
                          const groupCol = tile?.group ? COLOR_GROUP_HEX[tile.group] || '#3B82F6' : '#3B82F6';
                          return (
                            <div
                              key={pId}
                              onClick={() => handleToggleOfferedProp(pId)}
                              className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${
                                selected
                                  ? 'bg-pink-500/20 border-pink-500 text-white'
                                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: groupCol }} />
                                <span className="font-bold">{tile?.name}</span>
                              </div>
                              <span className="font-mono text-[11px] text-slate-400">${tile?.price}</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* THEIR OFFER */}
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex flex-col gap-3">
                  <div className="font-bold text-sm text-cyan-400 flex items-center justify-between font-display">
                    <span>YOU RECEIVE ({targetPlayer?.name || 'Partner'})</span>
                    <span className="font-mono text-xs text-slate-400">Cash: ${targetPlayer?.cash || 0}</span>
                  </div>

                  {/* Cash Slider */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Cash to Receive:</span>
                      <span className="font-mono font-bold text-emerald-400">${requestedCash}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={targetPlayer?.cash || 0}
                      step="25"
                      value={requestedCash}
                      onChange={(e) => setRequestedCash(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  {/* Property Selectors */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 font-display">
                      Their Properties ({targetPlayer?.inventory.properties.length || 0}):
                    </label>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {!targetPlayer || targetPlayer.inventory.properties.length === 0 ? (
                        <div className="text-xs text-slate-500 italic">No properties owned by partner.</div>
                      ) : (
                        targetPlayer.inventory.properties.map((pId) => {
                          const tile = getTile(pId);
                          const selected = requestedProperties.includes(pId);
                          const groupCol = tile?.group ? COLOR_GROUP_HEX[tile.group] || '#3B82F6' : '#3B82F6';
                          return (
                            <div
                              key={pId}
                              onClick={() => handleToggleRequestedProp(pId)}
                              className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${
                                selected
                                  ? 'bg-cyan-500/20 border-cyan-500 text-white'
                                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: groupCol }} />
                                <span className="font-bold">{tile?.name}</span>
                              </div>
                              <span className="font-mono text-[11px] text-slate-400">${tile?.price}</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Propose Button Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end">
                <button
                  onClick={handlePropose}
                  disabled={
                    !targetPlayer ||
                    (offeredProperties.length === 0 &&
                      offeredCash === 0 &&
                      requestedProperties.length === 0 &&
                      requestedCash === 0)
                  }
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 disabled:opacity-40 text-white font-bold text-sm shadow-lg shadow-pink-500/25 transition btn-tactile font-display"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>Send Trade Proposal</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
