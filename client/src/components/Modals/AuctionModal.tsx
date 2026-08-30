import { Clock, Crown, DollarSign, Eye, Gavel, Shield, User, UserCheck, X } from 'lucide-react';
import React, { useState } from 'react';
import { COLOR_GROUP_HEX } from '@shared/constants';
import { useSocket } from '../../context/SocketContext';
import { AvatarSilhouette } from '../Avatars/AvatarSilhouette';

export const AuctionModal: React.FC = () => {
  const { gameState, myPlayerId, placeBid, passAuction } = useSocket();
  const [customBid, setCustomBid] = useState('');

  if (!gameState || gameState.phase !== 'auction' || !gameState.activeAuction) {
    return null;
  }

  const auction = gameState.activeAuction;
  const tile = gameState.board.find((t) => t.id === auction.propertyId);
  const highestBidder = auction.highestBidderId ? gameState.players[auction.highestBidderId] : null;
  const myPlayer = myPlayerId ? gameState.players[myPlayerId] : null;
  const isHighestBidder = auction.highestBidderId === myPlayerId;
  const isInAuction = myPlayerId ? auction.activePlayerIds.includes(myPlayerId) : false;
  const canParticipate = myPlayer && !myPlayer.isBankrupt && !myPlayer.isSpectator;

  const groupColor = tile?.group ? COLOR_GROUP_HEX[tile.group] || '#F59E0B' : '#F59E0B';

  const handleQuickBid = (increment: number) => {
    const nextBid = auction.currentBid + increment;
    placeBid(nextBid);
  };

  const handleCustomBid = (e: React.FormEvent) => {
    e.preventDefault();
    const bid = parseInt(customBid);
    if (!isNaN(bid) && bid > auction.currentBid) {
      placeBid(bid);
      setCustomBid('');
    }
  };

  const allPlayers = Object.values(gameState.players).filter((p) => !p.isBankrupt && !p.isSpectator);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-xl max-h-[92vh] rounded-3xl bg-slate-900 border-2 border-amber-500/60 shadow-2xl overflow-hidden flex flex-col">
        {/* Top Auction Banner */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/70 border-b border-amber-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-inner">
              <Gavel className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-black text-amber-400 tracking-widest font-display uppercase">
                LIVE PROPERTY AUCTION
              </div>
              <h3 className="font-extrabold text-white text-base sm:text-lg font-display truncate max-w-[240px]">
                {tile?.name || 'Property Deed'}
              </h3>
            </div>
          </div>

          {/* Authoritative Countdown Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-amber-500/40 font-mono font-black text-amber-300 text-sm tabular-nums shadow-inner">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{auction.timeLeftSeconds}s</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Top Row: Property Deed Preview & Highest Bid Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            {/* Property Deed Mini Card */}
            <div className="sm:col-span-5 rounded-2xl bg-slate-950/90 border border-slate-800 overflow-hidden flex flex-col">
              <div
                className="h-10 px-3 flex items-center justify-center font-black text-xs text-white uppercase tracking-wider text-center shadow-sm font-display"
                style={{ backgroundColor: groupColor }}
              >
                {tile?.name}
              </div>
              <div className="p-3 flex flex-col justify-between flex-1 text-xs">
                <div className="space-y-1 font-mono text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base Cost:</span>
                    <span className="font-bold text-white">${tile?.price || 0}</span>
                  </div>
                  {tile?.rent && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Base Rent:</span>
                        <span className="text-emerald-400 font-bold">${tile.rent[0]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Hotel Rent:</span>
                        <span className="text-amber-400 font-bold">${tile.rent[5]}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-2 text-[10px] text-amber-300/80 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 text-center font-bold">
                  Bidding open to all players
                </div>
              </div>
            </div>

            {/* Current Highest Bid Showcase */}
            <div className="sm:col-span-7 p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 flex flex-col items-center justify-center text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">
                Current Highest Bid
              </div>
              <div className="font-mono text-3xl sm:text-4xl font-black text-amber-400 mt-0.5 tabular-nums drop-shadow-sm">
                ${auction.currentBid}
              </div>

              <div className="mt-2.5 text-xs text-slate-300 flex items-center justify-center">
                {highestBidder ? (
                  <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-800 text-xs">
                    <span className="text-slate-400 text-[11px]">Leader:</span>
                    <AvatarSilhouette
                      avatarId={highestBidder.customization.avatarId || highestBidder.customization.avatarIcon}
                      color={highestBidder.customization.color}
                      size={16}
                    />
                    <span className="font-bold truncate max-w-[120px]" style={{ color: highestBidder.customization.color }}>
                      {highestBidder.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-500 text-[11px]">Starting bid $10 (No bids yet)</span>
                )}
              </div>
            </div>
          </div>

          {/* Participating Players Roster with Exact Cash Balances */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-pink-400" />
                <span>Participating Players & Balances</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {auction.activePlayerIds.length} Active in Bidding
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {allPlayers.map((p) => {
                const isActive = auction.activePlayerIds.includes(p.id);
                const isLeader = auction.highestBidderId === p.id;
                const isMe = p.id === myPlayerId;

                return (
                  <div
                    key={p.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                      isLeader
                        ? 'bg-amber-950/40 border-amber-500/60 shadow-sm'
                        : isActive
                        ? 'bg-slate-800/60 border-slate-700'
                        : 'bg-slate-900/40 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${p.customization.color}25`,
                          borderColor: p.customization.color,
                        }}
                      >
                        <AvatarSilhouette
                          avatarId={p.customization.avatarId || p.customization.avatarIcon}
                          color={p.customization.color}
                          size={16}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                          <span>{p.name}</span>
                          {isMe && <span className="text-[9px] text-pink-400 font-normal">(You)</span>}
                        </div>
                        <div className="text-[11px] font-mono text-emerald-400 font-bold tabular-nums">
                          ${p.cash}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isLeader ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-black uppercase">
                          Highest Bid
                        </span>
                      ) : isActive ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[9px] font-bold">
                          Passed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bidding Controls Section */}
          {isInAuction && myPlayer && !myPlayer.isBankrupt ? (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 font-sans">
              <div className="text-xs text-slate-400 flex items-center justify-between font-mono">
                <span>
                  Your Cash: <strong className="text-emerald-400">${myPlayer.cash}</strong>
                </span>
                {isHighestBidder ? (
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 fill-amber-400" />
                    <span>You hold the highest bid!</span>
                  </span>
                ) : (
                  <span className="text-slate-400">
                    Min next bid: <strong className="text-white">${auction.currentBid + 1}</strong>
                  </span>
                )}
              </div>

              {/* Quick Bid Increment Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map((inc) => {
                  const nextAmount = auction.currentBid + inc;
                  const canAfford = myPlayer.cash >= nextAmount;
                  return (
                    <button
                      key={inc}
                      disabled={!canAfford || isHighestBidder}
                      onClick={() => handleQuickBid(inc)}
                      className="py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-30 text-slate-950 font-black text-xs shadow-md transition transform active:scale-95 flex flex-col items-center justify-center btn-tactile font-mono"
                    >
                      <span className="font-bold">+{inc}</span>
                      <span className="text-[10px] opacity-80 tabular-nums">(${nextAmount})</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Bid Input and Pass Controls */}
              <div className="flex items-center gap-2">
                <form onSubmit={handleCustomBid} className="flex-1 flex items-center gap-2">
                  <input
                    type="number"
                    placeholder={`Min $${auction.currentBid + 1}`}
                    value={customBid}
                    onChange={(e) => setCustomBid(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={!customBid || parseInt(customBid) <= auction.currentBid || (myPlayer.cash < parseInt(customBid)) || isHighestBidder}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white font-bold text-xs transition btn-tactile font-display"
                  >
                    Place Bid
                  </button>
                </form>

                <button
                  onClick={passAuction}
                  disabled={isHighestBidder}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-rose-300 hover:text-white font-bold text-xs transition btn-tactile whitespace-nowrap"
                >
                  Pass / Drop Out
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center text-xs text-slate-400 font-sans flex items-center justify-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>
                {!canParticipate
                  ? 'You are spectating this match.'
                  : !isInAuction
                  ? 'You have dropped out of this auction. Spectating remaining bids.'
                  : 'Waiting for active bidders...'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


