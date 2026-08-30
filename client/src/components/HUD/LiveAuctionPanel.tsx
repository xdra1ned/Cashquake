import { Clock, Crown, DollarSign, Gavel, UserCheck, X } from 'lucide-react';
import React, { useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { AvatarSilhouette } from '../Avatars/AvatarSilhouette';

export const LiveAuctionPanel: React.FC = () => {
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

  const totalDuration = gameState.rules.auctionCountdown || 15;
  const progressPercent = Math.max(0, Math.min(100, (auction.timeLeftSeconds / totalDuration) * 100));

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

  return (
    <div className="w-full rounded-2xl bg-slate-900/95 border-2 border-amber-500/50 shadow-2xl overflow-hidden animate-fade-in relative z-30">
      {/* Auction Header Banner */}
      <div className="p-3 bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-950 border-b border-amber-500/30 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Gavel className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-[10px] font-black text-amber-400 uppercase tracking-wider font-display">
              LIVE PROPERTY AUCTION
            </div>
            <div className="text-xs text-white font-extrabold truncate max-w-[140px] mt-0.5">
              {tile?.name || 'Property'}
            </div>
          </div>
        </div>

        {/* Live Authoritative Timer Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950 border border-amber-500/40 font-mono font-black text-amber-300 text-xs tabular-nums shrink-0 shadow-inner">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>{auction.timeLeftSeconds}s</span>
        </div>
      </div>

      {/* Main Floor Area */}
      <div className="p-3 flex flex-col gap-2.5 font-sans">
        {/* Highest Bid Showcase */}
        <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">
            Current Highest Bid
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-black text-amber-400 mt-0.5 tabular-nums">
            ${auction.currentBid}
          </div>

          <div className="mt-1 text-xs text-slate-300 flex items-center justify-center">
            {highestBidder ? (
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 py-0.5 rounded-xl border border-slate-800 text-[11px]">
                <span className="text-slate-400">Leader:</span>
                <AvatarSilhouette
                  avatarId={
                    highestBidder.customization.avatarId || highestBidder.customization.avatarIcon
                  }
                  color={highestBidder.customization.color}
                  size={14}
                />
                <span className="font-bold truncate max-w-[90px]" style={{ color: highestBidder.customization.color }}>
                  {highestBidder.name}
                </span>
              </div>
            ) : (
              <span className="text-[10px] text-slate-500">Starting bid $10</span>
            )}
          </div>
        </div>

        {/* Player Bid Controls */}
        {isInAuction && myPlayer && !myPlayer.isBankrupt ? (
          <div className="space-y-2">
            <div className="text-[10px] text-slate-400 flex items-center justify-between font-mono px-0.5">
              <span>
                Your Cash: <strong className="text-emerald-400">${myPlayer.cash}</strong>
              </span>
              {isHighestBidder && (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Crown className="w-3 h-3 fill-emerald-400" />
                  <span>You're Winning!</span>
                </span>
              )}
            </div>

            {/* Quick Bid Buttons */}
            <div className="grid grid-cols-3 gap-1.5">
              {[10, 25, 50].map((inc) => {
                const nextAmount = auction.currentBid + inc;
                const canAfford = myPlayer.cash >= nextAmount;

                return (
                  <button
                    key={inc}
                    disabled={!canAfford || isHighestBidder}
                    onClick={() => handleQuickBid(inc)}
                    className="py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-30 border border-amber-500/40 text-amber-300 text-xs font-mono font-black transition active:scale-95 btn-tactile"
                  >
                    +${inc}
                  </button>
                );
              })}
            </div>

            {/* Custom Bid + Pass */}
            <div className="flex items-center gap-1.5">
              <form onSubmit={handleCustomBid} className="flex-1 flex items-center gap-1">
                <input
                  type="number"
                  value={customBid}
                  onChange={(e) => setCustomBid(e.target.value)}
                  placeholder={`>${auction.currentBid}`}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={!customBid || parseInt(customBid) <= auction.currentBid || myPlayer.cash < parseInt(customBid) || isHighestBidder}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 font-bold text-xs transition btn-tactile shrink-0"
                >
                  Bid
                </button>
              </form>

              <button
                onClick={() => passAuction()}
                disabled={isHighestBidder}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/60 text-slate-400 hover:text-rose-300 text-xs font-bold transition btn-tactile shrink-0"
              >
                Pass
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-2 rounded-xl bg-slate-950/60 text-[11px] text-slate-400 italic">
            {isHighestBidder ? 'You are leading this auction!' : 'Viewing active auction as spectator'}
          </div>
        )}

        {/* Synchronized Live Countdown Progress Bar */}
        <div className="mt-1 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 px-0.5">
            <span>Auction timer</span>
            <span className="font-bold text-amber-400">{auction.timeLeftSeconds}s</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                progressPercent > 50
                  ? 'bg-gradient-to-r from-emerald-400 to-amber-400'
                  : progressPercent > 20
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                  : 'bg-gradient-to-r from-orange-500 to-rose-500 animate-pulse'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
