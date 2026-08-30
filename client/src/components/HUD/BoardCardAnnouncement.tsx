import { Sparkles, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import { useSocket } from '../../context/SocketContext';
import { getTheme } from '../../theme/themeRegistry';

export const BoardCardAnnouncement: React.FC = () => {
  const { gameState } = useSocket();
  const audio = useAudio();
  const [activeAnnouncement, setActiveAnnouncement] = useState<{
    id: string;
    playerName: string;
    playerColor: string;
    cardTitle: string;
    cardType: 'chance' | 'fortune';
    description: string;
    payout?: number;
  } | null>(null);

  const seenDrawIdsRef = useRef<Set<string>>(new Set());
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastDraw = gameState?.lastCardDrawn;
  const drawId = lastDraw
    ? lastDraw.id || `${lastDraw.drawnByPlayerId}_${lastDraw.card?.id}_${lastDraw.timestamp || ''}`
    : null;

  useEffect(() => {
    if (!lastDraw || !drawId || !lastDraw.card || !gameState) return;

    if (!seenDrawIdsRef.current.has(drawId)) {
      seenDrawIdsRef.current.add(drawId);

      const player = gameState.players[lastDraw.drawnByPlayerId];
      const card = lastDraw.card;
      const effect = card.effect;
      const payout =
        effect?.action === 'gain_cash'
          ? effect.amount
          : effect?.action === 'lose_cash' && effect.amount
          ? -effect.amount
          : undefined;

      const announcement = {
        id: drawId,
        playerName: player ? player.name : 'A Player',
        playerColor: player ? player.customization.color : '#38BDF8',
        cardTitle: card.title,
        cardType: card.type,
        description: card.description,
        payout,
      };

      setActiveAnnouncement(announcement);

      // Play appropriate card audio
      audio.playCardDeal();
      if (payout && payout > 0) {
        setTimeout(() => audio.playSmallWin(), 250);
      } else if (payout && payout < 0) {
        setTimeout(() => audio.playErrorBuzz(), 250);
      } else if (effect?.action === 'go_to_prison') {
        setTimeout(() => audio.playJailClank(), 250);
      } else {
        setTimeout(() => audio.playThemeSpecialEvent(gameState.themeId), 250);
      }

      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }

      // Auto-dismiss after 4.2 seconds
      dismissTimerRef.current = setTimeout(() => {
        setActiveAnnouncement(null);
      }, 4200);
    }
  }, [drawId, gameState?.themeId, audio]);

  if (!activeAnnouncement) return null;

  const theme = getTheme(gameState?.themeId || 'world_tour');
  const isPositive = typeof activeAnnouncement.payout === 'number' && activeAnnouncement.payout > 0;
  const isNegative = typeof activeAnnouncement.payout === 'number' && activeAnnouncement.payout < 0;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 max-w-sm sm:max-w-md w-[92%] animate-fade-in pointer-events-auto select-none">
      <div
        className="rounded-2xl border-2 p-3 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-white transition-all"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          borderColor: isPositive
            ? '#10B981'
            : isNegative
            ? '#F43F5E'
            : theme.colors.uiAccent || '#CA8A04',
          boxShadow: `0 0 20px -3px ${
            isPositive
              ? 'rgba(16, 185, 129, 0.4)'
              : isNegative
              ? 'rgba(244, 63, 94, 0.4)'
              : 'rgba(202, 138, 4, 0.35)'
          }`,
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm shadow-inner"
            style={{
              backgroundColor: `${activeAnnouncement.playerColor}25`,
              borderColor: activeAnnouncement.playerColor,
              borderWidth: '1.5px',
            }}
          >
            {activeAnnouncement.cardType === 'fortune' ? '🍀' : '🎴'}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-mono leading-none">
              <span className="font-black truncate" style={{ color: activeAnnouncement.playerColor }}>
                {activeAnnouncement.playerName}
              </span>
              <span className="text-slate-400">drew</span>
              <span className="uppercase font-bold text-amber-300">
                {activeAnnouncement.cardType}
              </span>
            </div>
            <h5 className="font-display font-black text-xs sm:text-sm text-white truncate mt-0.5">
              {activeAnnouncement.cardTitle}
            </h5>
            <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5 leading-tight">
              {activeAnnouncement.description}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveAnnouncement(null)}
          className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition shrink-0"
          title="Dismiss Announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
