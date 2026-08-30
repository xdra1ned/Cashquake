import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { ThemedCardFrame } from '../Cards/ThemedCardFrame';

export const CardDrawModal: React.FC = () => {
  const { gameState, myPlayerId, turnPresentationPhase, isPawnStepping } = useSocket();
  const [visibleCard, setVisibleCard] = useState<any | null>(null);
  const dismissedDrawIdsRef = useRef<Set<string>>(new Set());

  const currentDraw = gameState?.lastCardDrawn;
  const drawId =
    currentDraw?.id ||
    (currentDraw ? `${currentDraw.drawnByPlayerId}_${currentDraw.card?.id}_${currentDraw.timestamp || ''}` : null);

  useEffect(() => {
    if (
      currentDraw &&
      drawId &&
      !dismissedDrawIdsRef.current.has(drawId) &&
      !isPawnStepping &&
      (turnPresentationPhase === 'ACTION' || turnPresentationPhase === 'ARRIVED')
    ) {
      // Only pop up the full modal for the specific player who drew the card
      if (currentDraw.drawnByPlayerId === myPlayerId) {
        setVisibleCard(currentDraw);
      } else {
        setVisibleCard(null);
      }
    }
  }, [drawId, turnPresentationPhase, isPawnStepping, myPlayerId]);

  const handleClose = () => {
    if (drawId) {
      dismissedDrawIdsRef.current.add(drawId);
    }
    setVisibleCard(null);
  };

  if (
    !visibleCard ||
    !visibleCard.card ||
    isPawnStepping ||
    visibleCard.drawnByPlayerId !== myPlayerId
  ) {
    return null;
  }

  const { card, drawnByPlayerId } = visibleCard;
  const player = gameState?.players[drawnByPlayerId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in pointer-events-auto">
      <ThemedCardFrame card={card} player={player} onClose={handleClose} />
    </div>
  );
};
