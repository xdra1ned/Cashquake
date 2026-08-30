import React from 'react';
import { BoardThemeId, BoardTile, Player } from '@shared/types';
import { useSocket } from '../../context/SocketContext';
import { getOwnershipOutlineStyle } from '../../theme/playerPalette';
import { SpecialTileGlyph } from '../../theme/SpecialTileGlyphs';
import { AvatarSilhouette } from '../Avatars/AvatarSilhouette';
import { PawnRenderer } from './PawnRenderer';

interface TileComponentProps {
  tile: BoardTile;
  themeId?: BoardThemeId;
  owner?: Player;
  playersOnTile: Player[];
  activePlayerId?: string;
  orientation: 'bottom' | 'left' | 'top' | 'right' | 'corner';
  onInspectTile?: (tile: BoardTile) => void;
}

export const TileComponent: React.FC<TileComponentProps> = ({
  tile,
  themeId = 'world_tour',
  owner,
  playersOnTile,
  activePlayerId,
  orientation,
  onInspectTile,
}) => {
  const { gameState, inspectedPlayerId, setInspectedPlayerId } = useSocket();
  const houseCount = owner?.inventory.houses[tile.id] || 0;
  const isMortgaged = owner?.inventory.mortgaged[tile.id] || false;
  const isCorner = orientation === 'corner';
  const isHorizontalLane = orientation === 'bottom' || orientation === 'top';
  const isVerticalLane = orientation === 'left' || orientation === 'right';

  const isAuctioned = gameState?.phase === 'auction' && gameState?.activeAuction?.propertyId === tile.id;
  const hasActiveLandedPlayer = playersOnTile.some((p) => p.id === activePlayerId);
  const hasInspectedPlayer = playersOnTile.some((p) => p.id === inspectedPlayerId);

  const isOwnerInspected = !!(owner && inspectedPlayerId === owner.id);
  const isOwnerActiveTurn = !!(owner && owner.id === activePlayerId);
  const isDimmedByInspection = !!(
    inspectedPlayerId &&
    (!owner || owner.id !== inspectedPlayerId) &&
    !hasInspectedPlayer
  );

  const { style: ownershipStyle, className: ownershipClass } = getOwnershipOutlineStyle(
    owner?.customization.color,
    isOwnerInspected,
    isOwnerActiveTurn
  );

  const isInteractive =
    tile.type === 'property' || tile.type === 'railroad' || tile.type === 'utility';

  return (
    <div
      onClick={() => {
        if (onInspectTile) onInspectTile(tile);
      }}
      onMouseEnter={() => {
        if (owner) {
          setInspectedPlayerId(owner.id);
        }
      }}
      onMouseLeave={() => {
        if (owner && inspectedPlayerId === owner.id) {
          setInspectedPlayerId(null);
        }
      }}
      style={ownershipStyle}
      className={`relative select-none w-full h-full rounded-lg border transition-all duration-200 overflow-hidden flex ${
        isHorizontalLane || isCorner ? 'flex-col justify-between' : 'flex-row items-stretch'
      } ${
        isInteractive ? 'cursor-pointer hover:border-slate-500 active:scale-[0.99]' : 'cursor-default'
      } ${
        isCorner
          ? 'bg-slate-950/95 border-slate-700/80 shadow-md'
          : hasInspectedPlayer
          ? 'bg-slate-800/90 border-white/80 shadow-xl shadow-black/40 z-30'
          : hasActiveLandedPlayer
          ? 'bg-emerald-950/25 border-emerald-500/70 shadow-lg shadow-emerald-500/20 z-20'
          : isAuctioned
          ? 'bg-amber-950/30 border-amber-400 shadow-xl shadow-amber-500/30 z-30'
          : 'bg-slate-900/85 border-slate-800/80 hover:border-slate-700'
      } ${
        hasInspectedPlayer
          ? 'ring-2 ring-white/90'
          : isAuctioned
          ? 'ring-2 ring-amber-400'
          : hasActiveLandedPlayer
          ? 'ring-2 ring-emerald-400'
          : ''
      } ${
        isDimmedByInspection ? 'opacity-35 filter saturate-50 contrast-90' : 'opacity-100'
      } ${ownershipClass}`}
    >
      {/* Dedicated Player Ownership Badge (Separate from Property Color Band) */}
      {owner && !isCorner && (
        <div
          className={`absolute z-20 flex items-center gap-1 px-1 py-0.5 rounded-md border shadow-sm backdrop-blur-xs transition-transform ${
            orientation === 'bottom'
              ? 'bottom-1 right-1'
              : orientation === 'top'
              ? 'top-1 right-1'
              : orientation === 'left'
              ? 'top-1 left-1'
              : 'top-1 right-1'
          }`}
          style={{
            backgroundColor: `${owner.customization.color}22`,
            borderColor: `${owner.customization.color}90`,
            color: owner.customization.color,
          }}
          title={`Owned by ${owner.name}`}
        >
          <div
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: owner.customization.color }}
          />
          <span className="font-mono text-[8px] font-black uppercase tracking-wider truncate max-w-[32px] leading-none">
            {owner.name.substring(0, 3)}
          </span>
        </div>
      )}

      {/* Live Auction Banner on Tile */}
      {isAuctioned && (
        <div className="absolute top-1 left-1 z-30 px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[8px] uppercase tracking-wider flex items-center gap-0.5 shadow-md animate-pulse font-mono">
          <span>🔨</span>
          <span>BID</span>
        </div>
      )}

      {/* Pristine Property Color Band (Always True to Property Group Identity) */}
      {tile.group && tile.color && (
        <div
          className={`shrink-0 flex items-center justify-center font-mono font-bold text-white shadow-sm relative ${
            orientation === 'bottom'
              ? 'order-first h-3.5 sm:h-4 w-full border-b border-black/30'
              : orientation === 'top'
              ? 'order-last h-3.5 sm:h-4 w-full border-t border-black/30'
              : orientation === 'left'
              ? 'order-last h-full w-3 sm:w-3.5 border-l border-black/30'
              : 'order-first h-full w-3 sm:w-3.5 border-r border-black/30'
          }`}
          style={{
            backgroundColor: tile.color,
            backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.15) 100%)',
          }}
        >
          {/* House / Hotel Indicators Embedded Cleanly in Color Band */}
          {houseCount > 0 && (
            <div
              className={`flex items-center gap-0.5 ${
                isVerticalLane ? 'flex-col py-0.5' : 'px-0.5'
              }`}
            >
              {houseCount === 5 ? (
                <span className="text-[8.5px] font-mono font-black text-amber-300 drop-shadow-sm">★H</span>
              ) : (
                Array.from({ length: houseCount }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-sm bg-white border border-slate-900 shadow-sm"
                  />
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Center Tile Information */}
      <div className="flex-1 flex flex-col items-center justify-center p-0.5 sm:p-1 text-center min-w-0 min-h-0 relative">
        {/* Special Tile Vector Glyph */}
        {!tile.group && (
          <div className={`${isCorner ? 'my-0.5' : 'mb-0.5'} flex items-center justify-center`}>
            <SpecialTileGlyph
              type={tile.type}
              themeId={themeId}
              className={isCorner ? 'w-7 h-7 sm:w-9 sm:h-9' : 'w-5 h-5 sm:w-6 sm:h-6'}
            />
          </div>
        )}

        {/* Tile Name - High Legibility Hierarchy */}
        <div
          className={`font-bold leading-tight line-clamp-2 ${
            isCorner
              ? 'text-[10px] sm:text-xs md:text-sm font-black text-amber-300 uppercase tracking-tight font-display'
              : 'text-[9.5px] sm:text-[11px] md:text-xs text-slate-100 font-sans'
          }`}
        >
          {tile.name}
        </div>

        {/* Price / Subtext - Secondary Hierarchy */}
        {tile.price ? (
          <div className="mt-0.5 font-mono text-[9px] sm:text-[10.5px] md:text-[11.5px] text-emerald-400 font-bold tabular-nums">
            ${tile.price}
          </div>
        ) : tile.subText ? (
          <div className="mt-0.5 text-[8.5px] sm:text-[9.5px] text-slate-400 font-medium leading-none">
            {tile.subText}
          </div>
        ) : null}

        {/* Mortgaged Stamp Overlay */}
        {isMortgaged && (
          <div className="absolute inset-0 bg-red-950/80 backdrop-blur-xs flex items-center justify-center rotate-12 border border-red-500/60 text-red-300 font-mono font-black text-[8.5px] sm:text-[10px] uppercase tracking-wider z-20 shadow-md">
            MORTGAGED
          </div>
        )}
      </div>

      {/* Landed Pawns */}
      <PawnRenderer playersOnTile={playersOnTile} activePlayerId={activePlayerId} />
    </div>
  );
};

