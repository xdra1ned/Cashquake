import { Building2, Crown, Lock, Skull, WifiOff } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { calculateNetWorth } from '@shared/gameLogic';
import { useSocket } from '../../context/SocketContext';
import { AvatarSilhouette } from '../Avatars/AvatarSilhouette';
import { getTheme } from '../../theme/themeRegistry';

interface PlayerHUDProps {
  layout?: 'horizontal' | 'vertical';
}

export const PlayerHUD: React.FC<PlayerHUDProps> = ({ layout = 'horizontal' }) => {
  const { gameState, myPlayerId, inspectedPlayerId, setInspectedPlayerId } = useSocket();
  const [now, setNow] = useState(Date.now());

  const [cashDeltas, setCashDeltas] = useState<Record<string, { delta: number; id: number; expiresAt: number }>>({});
  const prevCashRef = useRef<Record<string, number>>({});
  const deltaTimersRef = useRef<Record<string, any>>({});

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(timer);
      Object.values(deltaTimersRef.current).forEach((t) => clearTimeout(t));
      deltaTimersRef.current = {};
    };
  }, []);

  // Track cash changes across all players with independent per-player timers
  useEffect(() => {
    if (!gameState) return;

    Object.values(gameState.players).forEach((p) => {
      const prev = prevCashRef.current[p.id];
      if (prev !== undefined && prev !== p.cash) {
        const delta = p.cash - prev;
        if (delta !== 0) {
          const uniqueId = Date.now() + Math.random();
          const expiresAt = Date.now() + 3000;

          // Clear any existing timer for this specific player
          if (deltaTimersRef.current[p.id]) {
            clearTimeout(deltaTimersRef.current[p.id]);
          }

          // Set active delta
          setCashDeltas((curr) => ({
            ...curr,
            [p.id]: { delta, id: uniqueId, expiresAt },
          }));

          // Independent timer that will NOT be prematurely cancelled by unrelated re-renders
          deltaTimersRef.current[p.id] = setTimeout(() => {
            setCashDeltas((curr) => {
              const updated = { ...curr };
              if (updated[p.id]?.id === uniqueId) {
                delete updated[p.id];
              }
              return updated;
            });
            delete deltaTimersRef.current[p.id];
          }, 3000);
        }
      }
      prevCashRef.current[p.id] = p.cash;
    });
  }, [gameState]);

  if (!gameState) return null;

  const theme = getTheme(gameState.themeId || 'world_tour');
  const players = gameState.playerOrder.map((id) => gameState.players[id]).filter(Boolean);
  const isVertical = layout === 'vertical';

  const formatGraceTime = (deadline: number) => {
    const diff = Math.max(0, Math.ceil((deadline - now) / 1000));
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={
        isVertical
          ? 'w-full flex flex-col gap-2'
          : 'w-full max-w-6xl flex items-center gap-2 overflow-x-auto py-1 px-1 scrollbar-none'
      }
    >
      {players.map((player) => {
        const isCurrentTurn = gameState.turn.currentPlayerId === player.id;
        const isMe = player.id === myPlayerId;
        const isInspected = inspectedPlayerId === player.id;
        const isDimmed = !!(inspectedPlayerId && inspectedPlayerId !== player.id);
        const isDisconnected = !player.isConnected && !player.isBankrupt;
        const isAlliedWithMe =
          !!gameState.rules.alliancesEnabled &&
          !isMe &&
          (gameState.activeAlliances || []).some(
            (a) => a.memberIds.includes(myPlayerId || '') && a.memberIds.includes(player.id)
          );
        const netWorth = calculateNetWorth(player, gameState.board);
        const deltaInfo = cashDeltas[player.id];

        return (
          <div
            key={player.id}
            onMouseEnter={() => setInspectedPlayerId(player.id)}
            onMouseLeave={() => setInspectedPlayerId(null)}
            style={{
              backgroundColor: isCurrentTurn ? theme.colors.surfaceElevated : theme.colors.surfacePrimary,
              borderColor: isCurrentTurn ? theme.colors.turnGlow : theme.colors.panelBorder,
            }}
            className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-200 flex items-center gap-3 cursor-pointer ${
              isVertical ? 'w-full' : 'shrink-0 min-w-[160px] sm:min-w-[185px]'
            } ${
              player.isBankrupt
                ? 'opacity-40'
                : isInspected
                ? 'shadow-xl ring-2 ring-white scale-[1.02] z-10 opacity-100'
                : isDimmed
                ? 'opacity-40 filter saturate-75'
                : isCurrentTurn
                ? 'shadow-md ring-1 opacity-100'
                : 'hover:opacity-100'
            }`}
          >
            {/* Silhouette Avatar Container */}
            <div className="relative shrink-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner border-2 transition-transform"
                style={{
                  backgroundColor: `${player.customization.color}20`,
                  borderColor: player.customization.color,
                }}
              >
                <AvatarSilhouette
                  avatarId={player.customization.avatarId || player.customization.avatarIcon}
                  color={player.customization.color}
                  size={22}
                  showBorder={true}
                />
              </div>

              {/* Host Crown */}
              {player.isHost && (
                <div
                  className="absolute -top-1.5 -right-1 w-4 h-4 rounded-full bg-amber-500/30 border border-amber-400 flex items-center justify-center shadow-sm z-10"
                  title="Lobby Host"
                >
                  <Crown className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                </div>
              )}

              {/* Status Badges: Bankrupt Skull / Prison / Disconnected */}
              {player.isBankrupt ? (
                <div
                  className={`absolute ${player.isHost ? '-bottom-1 -right-1.5' : '-top-1.5 -right-1.5'} w-4 h-4 rounded-full bg-red-950 border border-red-500 flex items-center justify-center`}
                  title="Bankrupt"
                >
                  <Skull className="w-2.5 h-2.5 text-red-400" />
                </div>
              ) : isDisconnected ? (
                <div
                  className={`absolute ${player.isHost ? '-bottom-1 -right-1.5' : '-top-1.5 -right-1.5'} w-4 h-4 rounded-full bg-amber-950 border border-amber-500 flex items-center justify-center animate-pulse`}
                  title="Disconnected"
                >
                  <WifiOff className="w-2.5 h-2.5 text-amber-400" />
                </div>
              ) : player.inPrison ? (
                <div
                  className={`absolute ${player.isHost ? '-bottom-1 -right-1.5' : '-top-1.5 -right-1.5'} w-4 h-4 rounded-full bg-rose-950 border border-rose-500 flex items-center justify-center`}
                  title="In Prison"
                >
                  <Lock className="w-2.5 h-2.5 text-rose-400" />
                </div>
              ) : null}
            </div>

            {/* Player Info & Numeric Stats */}
            <div className="flex-1 min-w-0">
              {/* Header row: Player Name (truncate) and Anchored Badges (+$/-$ & YOU & ALLIED) */}
              <div className="flex items-center justify-between gap-1.5 min-w-0">
                <span
                  className="font-bold text-xs truncate font-display min-w-0 flex-1"
                  style={{ color: theme.colors.textPrimary }}
                >
                  {player.name}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  {isAlliedWithMe && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-lg bg-pink-500/20 text-pink-300 font-bold border border-pink-500/40 shrink-0 flex items-center gap-0.5">
                      <span>🤝</span>
                      <span className="hidden sm:inline">ALLIED</span>
                    </span>
                  )}
                  {deltaInfo && (
                    <span
                      className={`text-[10px] sm:text-[11px] font-mono font-black px-1.5 py-0.2 rounded-lg shadow-sm border animate-fade-in ${
                        deltaInfo.delta > 0
                          ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/60 shadow-emerald-500/10'
                          : 'bg-rose-500/25 text-rose-300 border-rose-500/60 shadow-rose-500/10'
                      }`}
                    >
                      {deltaInfo.delta > 0 ? `+$${deltaInfo.delta}` : `-$${Math.abs(deltaInfo.delta)}`}
                    </span>
                  )}
                  {player.isBankrupt && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-lg bg-rose-950/80 text-rose-300 font-bold border border-rose-500/40 shrink-0 flex items-center gap-0.5">
                      <Skull className="w-2.5 h-2.5 text-rose-400" />
                      <span>BANKRUPT</span>
                    </span>
                  )}
                  {isMe && (
                    <span
                      className="text-[9px] px-1.5 py-0.2 rounded-lg font-bold border shrink-0"
                      style={{
                        backgroundColor: theme.colors.badgeBg,
                        borderColor: theme.colors.badgeBorder,
                        color: theme.colors.badgeText,
                      }}
                    >
                      YOU
                    </span>
                  )}
                </div>
              </div>

              {/* Disconnected Grace Timer or Player Title or Bankrupt */}
              {player.isBankrupt ? (
                <div className="text-[10px] text-rose-400 font-mono truncate leading-none mt-0.5">
                  Eliminated • Spectating
                </div>
              ) : isDisconnected && player.reconnectDeadline ? (
                <div className="text-[10px] text-amber-300 font-mono font-bold truncate leading-none mt-0.5 animate-pulse">
                  ⚠️ Reconnect {formatGraceTime(player.reconnectDeadline)}
                </div>
              ) : (
                <div
                  className="text-[10px] font-mono truncate leading-none mt-0.5"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {player.customization.title || 'Landlord'}
                </div>
              )}

              {/* Cash in JetBrains Mono or Bankrupt Summary */}
              {!player.isBankrupt ? (
                <>
                  <div
                    className="font-mono font-black text-xs sm:text-sm tabular-nums mt-0.5"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    ${player.cash}
                  </div>

                  {/* Properties count & Net worth */}
                  <div
                    className="text-[10px] font-mono flex items-center gap-1.5 leading-none mt-0.5"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    <span className="flex items-center gap-0.5">
                      <Building2 className="w-2.5 h-2.5 text-cyan-500 inline" />
                      {player.inventory.properties.length}
                    </span>
                    <span>•</span>
                    <span className="truncate tabular-nums">NW: ${netWorth}</span>
                  </div>
                </>
              ) : (
                <div className="font-mono text-[11px] text-slate-500 tabular-nums mt-0.5">
                  Assets returned to bank
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
