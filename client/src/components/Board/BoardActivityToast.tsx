import { X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { GameLog, Player } from '@shared/types';
import { useSocket } from '../../context/SocketContext';

export const BoardActivityToast: React.FC = () => {
  const { gameState } = useSocket();
  const [activeToast, setActiveToast] = useState<{
    id: string;
    message: string;
    type: GameLog['type'];
    playerId?: string;
    player?: Player;
  } | null>(null);

  const seenLogIdsRef = useRef<Set<string>>(new Set());
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const latestLog = gameState?.logs?.[0];

  useEffect(() => {
    if (!latestLog || !gameState) return;

    // Filter for high-impact match events
    const isQualifyingType =
      latestLog.type === 'buy' ||
      latestLog.type === 'auction' ||
      latestLog.type === 'bankrupt' ||
      latestLog.type === 'alliance' ||
      (latestLog.type === 'trade' && latestLog.message.includes('accepted')) ||
      (latestLog.type === 'rent' && (latestLog.message.includes('JACKPOT') || latestLog.message.includes('passed GO') || latestLog.message.includes('EXACT GO'))) ||
      latestLog.type === 'chaos' ||
      latestLog.type === 'win';

    if (!isQualifyingType) return;

    if (!seenLogIdsRef.current.has(latestLog.id)) {
      seenLogIdsRef.current.add(latestLog.id);

      const player = latestLog.playerId ? gameState.players[latestLog.playerId] : undefined;

      setActiveToast({
        id: latestLog.id,
        message: latestLog.message,
        type: latestLog.type,
        playerId: latestLog.playerId,
        player,
      });

      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }

      // Auto-dismiss after 4.0 seconds
      dismissTimerRef.current = setTimeout(() => {
        setActiveToast(null);
      }, 4000);
    }
  }, [latestLog?.id, latestLog?.message, gameState]);

  if (!activeToast) return null;

  return (
    <div className="w-full flex items-center justify-center my-1 z-20 pointer-events-none animate-fade-in">
      <div className="pointer-events-auto px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md flex items-center gap-2 max-w-sm sm:max-w-md text-xs text-slate-200 transition-all hover:border-slate-700">
        {/* Leading Action Indicator */}
        <span className="shrink-0 text-sm">
          {activeToast.type === 'buy'
            ? '🏡'
            : activeToast.type === 'auction'
            ? '🔨'
            : activeToast.type === 'bankrupt'
            ? '💀'
            : activeToast.type === 'alliance'
            ? '🤝'
            : activeToast.type === 'trade'
            ? '✅'
            : activeToast.type === 'chaos'
            ? '🌋'
            : activeToast.type === 'win'
            ? '👑'
            : '✨'}
        </span>

        {/* Formatted Message */}
        <span className="font-medium truncate text-[11px] sm:text-xs text-slate-200">
          {activeToast.message}
        </span>

        {/* Dismiss Button */}
        <button
          onClick={() => setActiveToast(null)}
          className="ml-1 p-0.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition shrink-0"
          title="Dismiss Toast"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
