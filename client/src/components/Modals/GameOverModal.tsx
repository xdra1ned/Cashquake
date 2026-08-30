import confetti from 'canvas-confetti';
import {
  Award,
  Crown,
  DollarSign,
  Flame,
  Handshake,
  Heart,
  Lock,
  Medal,
  Play,
  RotateCcw,
  ShieldAlert,
  Skull,
  Sparkles,
  Trophy,
  TrendingDown,
  Users,
  Zap,
} from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { calculateNetWorth } from '@shared/gameLogic';
import { Player } from '@shared/types';
import { useSocket } from '../../context/SocketContext';
import { AvatarSilhouette } from '../Avatars/AvatarSilhouette';
import { JasmineEasterEgg } from '../HUD/JasmineEasterEgg';

export const GameOverModal: React.FC = () => {
  const { gameState, myPlayerId, session, earnCoins, updateSession, leaveRoom } = useSocket();
  const rewardedMatchRef = useRef<string | null>(null);

  if (!gameState || gameState.phase !== 'game_over') return null;

  const players = Object.values(gameState.players);
  // Sort players by net worth
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.isBankrupt && !b.isBankrupt) return 1;
    if (!a.isBankrupt && b.isBankrupt) return -1;
    const nwA = calculateNetWorth(a, gameState.board);
    const nwB = calculateNetWorth(b, gameState.board);
    return nwB - nwA;
  });

  const winner = sortedPlayers[0];
  const myPlayer = myPlayerId ? gameState.players[myPlayerId] : null;
  const myRank = sortedPlayers.findIndex((p) => p.id === myPlayerId);
  const myReward = myRank === 0 ? 250 : myRank === 1 ? 100 : myRank === 2 ? 50 : 25;

  useEffect(() => {
    if (gameState?.phase === 'game_over') {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FBBF24', '#EC4899', '#38BDF8', '#10B981', '#A855F7'],
      });

      const matchKey = `${gameState.roomCode}_${gameState.gameStats.startTime || gameState.phase}`;
      if (rewardedMatchRef.current !== matchKey) {
        rewardedMatchRef.current = matchKey;
        if (myPlayer && !myPlayer.isSpectator && !myPlayer.isBot) {
          earnCoins(myReward);
          updateSession({
            stats: {
              ...session.stats,
              matchesPlayed: (session.stats.matchesPlayed || 0) + 1,
              matchesWon: myRank === 0 ? (session.stats.matchesWon || 0) + 1 : (session.stats.matchesWon || 0),
            },
          });
        }
      }
    }
  }, [gameState?.phase]);

  // Calculate Friendship Destruction Awards
  let mostRentCollectedPlayer = players[0];
  let mostRentPaidPlayer = players[0];
  let mostPrisonPlayer = players[0];
  let mostTradesPlayer = players[0];

  for (const p of players) {
    if (p.stats.rentCollected > mostRentCollectedPlayer.stats.rentCollected) mostRentCollectedPlayer = p;
    if (p.stats.rentPaid > mostRentPaidPlayer.stats.rentPaid) mostRentPaidPlayer = p;
    if (p.stats.timesInPrison > mostPrisonPlayer.stats.timesInPrison) mostPrisonPlayer = p;
    if (p.stats.tradesCompleted > mostTradesPlayer.stats.tradesCompleted) mostTradesPlayer = p;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-lg animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl my-auto rounded-2xl bg-slate-900 border-2 border-amber-500/60 shadow-2xl overflow-hidden flex flex-col">
        {/* Victory Top Banner */}
        <div className="px-6 py-7 bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border-b border-slate-800 text-center relative">
          <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-600 border-2 border-amber-300 flex items-center justify-center shadow-xl shadow-amber-500/30">
            <Trophy className="w-8 h-8 text-slate-950" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
            MATCH CONCLUDED!
          </h2>
          <p className="text-sm text-amber-300 font-bold mt-1 font-sans">
            🏆 {winner?.name.toUpperCase()} HAS CONQUERED CASHQUAKE!
          </p>
        </div>

        {/* Podium Standings */}
        <div className="p-6 space-y-6">
          {/* User Earned Reward Banner */}
          {myPlayer && !myPlayer.isSpectator && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border-2 border-amber-400/60 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shrink-0">
                  🪙
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-amber-300 font-bold uppercase tracking-wider font-sans">
                    Match Reward Earned
                  </div>
                  <div className="text-white font-black text-sm sm:text-base font-display truncate">
                    {myRank === 0 ? '🏆 1st Place Champion' : myRank === 1 ? '🥈 2nd Place Finalist' : myRank === 2 ? '🥉 3rd Place Finish' : '🎖️ Match Participant'}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-base sm:text-lg font-mono font-black text-amber-300 tabular-nums">
                  +{myReward} QuakeCoins
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  Balance: 🪙{session.quakeCoins}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sortedPlayers.slice(0, 3).map((player, index) => {
              const netWorth = calculateNetWorth(player, gameState.board);
              const rankReward = index === 0 ? 250 : index === 1 ? 100 : 50;

              return (
                <div
                  key={player.id}
                  className={`p-4 rounded-xl border flex flex-col items-center text-center ${
                    index === 0
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-800/40 border-slate-700/60'
                  }`}
                >
                  <div className="mb-2 flex items-center gap-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-black ${
                      index === 0 ? 'bg-amber-400 text-slate-950' : index === 1 ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-amber-100'
                    }`}>
                      #{index + 1} PLACE
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-amber-300 border border-amber-400/30">
                      🪙 +{rankReward}
                    </span>
                  </div>

                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 border-2 shadow-inner"
                    style={{
                      backgroundColor: `${player.customization.color}25`,
                      borderColor: player.customization.color,
                    }}
                  >
                    <AvatarSilhouette
                      avatarId={player.customization.avatarId || player.customization.avatarIcon}
                      color={player.customization.color}
                      size={28}
                      showBorder={true}
                    />
                  </div>

                  <div className="font-bold text-white text-sm truncate max-w-full font-display">{player.name}</div>
                  <div className="font-mono text-xs font-black text-emerald-400 mt-0.5 tabular-nums">
                    ${netWorth} Net Worth
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    {player.inventory.properties.length} Properties
                  </div>
                </div>
              );
            })}
          </div>

          {/* Match Highlights / Awards */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 font-display">
                <ShieldAlert className="w-4 h-4" />
                <span>Friendship Hazard Level</span>
              </span>
              <span className="font-mono font-black text-rose-400 text-sm">99.4% (Critical)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>Ruthless Slumlord</span>
                </div>
                <div className="font-bold text-white truncate mt-0.5">{mostRentCollectedPlayer?.name}</div>
                <div className="font-mono text-emerald-400 text-[10px] tabular-nums">${mostRentCollectedPlayer?.stats.rentCollected} Collected</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-rose-400" />
                  <span>The Money Pit</span>
                </div>
                <div className="font-bold text-white truncate mt-0.5">{mostRentPaidPlayer?.name}</div>
                <div className="font-mono text-rose-400 text-[10px] tabular-nums">${mostRentPaidPlayer?.stats.rentPaid} Lost in Rent</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span>Frequent Convict</span>
                </div>
                <div className="font-bold text-white truncate mt-0.5">{mostPrisonPlayer?.name}</div>
                <div className="text-slate-300 text-[10px] font-mono">{mostPrisonPlayer?.stats.timesInPrison} Jails Served</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Handshake className="w-3 h-3 text-pink-400" />
                  <span>Master Diplomat</span>
                </div>
                <div className="font-bold text-white truncate mt-0.5">{mostTradesPlayer?.name}</div>
                <div className="text-slate-300 text-[10px] font-mono">{mostTradesPlayer?.stats.tradesCompleted} Trades Made</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <JasmineEasterEgg />

            <button
              onClick={leaveRoom}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-pink-500/20 transition btn-tactile font-display"
            >
              Return to Main Lobby
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
