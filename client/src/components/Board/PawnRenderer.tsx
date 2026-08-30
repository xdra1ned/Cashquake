import React from 'react';
import { Player } from '@shared/types';
import { getTrailEffect } from '../../theme/cosmeticsRegistry';
import { useSocket } from '../../context/SocketContext';
import { AvatarSilhouette } from '../Avatars/AvatarSilhouette';

interface PawnRendererProps {
  playersOnTile: Player[];
  activePlayerId?: string;
}

export const PawnRenderer: React.FC<PawnRendererProps> = ({ playersOnTile, activePlayerId }) => {
  const { isPawnStepping, activeMovingPlayerId, inspectedPlayerId } = useSocket();
  if (!playersOnTile || playersOnTile.length === 0) return null;

  const count = playersOnTile.length;
  const isMulti = count > 1;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 p-0.5">
      <div
        className={`flex flex-wrap items-center justify-center gap-0.5 max-w-full max-h-full ${
          count > 2 ? 'grid grid-cols-2' : ''
        }`}
      >
        {playersOnTile.map((player) => {
          const isActive = player.id === activePlayerId;
          const isInspected = inspectedPlayerId === player.id;
          const isDimmed = !!(inspectedPlayerId && inspectedPlayerId !== player.id);
          const isMovingPawn = player.id === activeMovingPlayerId && isPawnStepping;
          const trail = getTrailEffect(player.customization.trailEffect);

          return (
            <div
              key={player.id}
              className={`relative flex items-center justify-center transition-all duration-200 ${
                isInspected
                  ? 'scale-125 z-50 -translate-y-1 opacity-100'
                  : isDimmed
                  ? 'scale-90 opacity-30 filter saturate-50 z-10'
                  : isMovingPawn
                  ? '-translate-y-2 scale-110 z-40 opacity-100'
                  : isActive
                  ? 'scale-105 z-30 opacity-100'
                  : 'scale-95 z-20 opacity-100'
              }`}
              title={`${player.name} (${player.customization.title || 'Landlord'}) · $${player.cash}`}
            >
              {/* Inspected Player Name Tag */}
              {isInspected && (
                <div
                  className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-lg bg-slate-950/95 border text-[9px] font-black font-display whitespace-nowrap shadow-2xl z-50 pointer-events-none flex items-center gap-1.5 animate-fade-in"
                  style={{ borderColor: player.customization.color || '#38BDF8', color: '#ffffff' }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: player.customization.color || '#38BDF8' }}
                  />
                  <span>{player.name}</span>
                </div>
              )}

              {/* Equipped Movement Trail Effect */}
              {isMovingPawn && trail.particleType !== 'none' && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none z-50">
                  <span
                    className="text-xs filter drop-shadow-md select-none opacity-90"
                    style={{ color: trail.particleColor }}
                  >
                    {trail.particleSvg}
                  </span>
                </div>
              )}

              {/* Pawn Base Token */}
              <div
                className={`rounded-xl flex items-center justify-center shadow-md transition-all ${
                  isMulti && !isInspected ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-6 h-6 sm:w-7 sm:h-7'
                } ${
                  isInspected
                    ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-950 bg-slate-900 border-2'
                    : isActive
                    ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-950 bg-slate-900 border-2 border-amber-400'
                    : 'bg-slate-900/95 border-2'
                }`}
                style={{
                  borderColor: isInspected
                    ? player.customization.color || '#ffffff'
                    : isActive
                    ? '#fbbf24'
                    : `${player.customization.color}cc`,
                  boxShadow: isInspected
                    ? `0 0 16px ${player.customization.color || '#38BDF8'}, 0 0 4px #ffffff, 0 4px 12px rgba(0,0,0,0.8)`
                    : isMovingPawn
                    ? `0 0 14px ${player.customization.color}cc, 0 4px 8px rgba(0,0,0,0.6)`
                    : isActive
                    ? `0 0 10px ${player.customization.color}90`
                    : `0 2px 4px rgba(0,0,0,0.4)`,
                }}
              >
                <AvatarSilhouette
                  avatarId={player.customization.avatarId || player.customization.avatarIcon}
                  color={player.customization.color}
                  size={isMulti && !isInspected ? 13 : 16}
                  showBorder={true}
                />
              </div>

              {/* Turn Indicator Crown */}
              {isActive && !isInspected && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 flex items-center justify-center pointer-events-none">
                  <svg viewBox="0 0 16 16" className="w-full h-full" fill="none">
                    <polygon
                      points="2,12 3,5 6,8 8,3 10,8 13,5 14,12"
                      fill="#FBBF24"
                      stroke="#0F172A"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
