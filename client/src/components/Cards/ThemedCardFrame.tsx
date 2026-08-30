import { Sparkles, X } from 'lucide-react';
import React from 'react';
import { DrawnCard, Player } from '@shared/types';
import { useSocket } from '../../context/SocketContext';
import { CardVectorEmblem } from './CardVectorEmblem';

interface ThemedCardFrameProps {
  card: DrawnCard;
  player?: Player;
  onClose: () => void;
}

export const ThemedCardFrame: React.FC<ThemedCardFrameProps> = ({ card, player, onClose }) => {
  const { gameState } = useSocket();
  const isChance = card.type === 'chance';
  const themeId = gameState?.themeId || 'world_tour';

  const getThemeHeader = () => {
    switch (themeId) {
      case 'world_tour':
        return isChance ? '✈️ WORLD TOUR // PASSPORT' : '🌍 GLOBAL DESTINATION';
      case 'cosmic_space':
        return isChance ? '☄️ DEEP SPACE // ANOMALY' : '🌌 COSMIC TELEMETRY';
      case 'mystic_fantasy':
        return isChance ? '✨ ARCANE PROPHECY' : '🔮 ORACLE OF RUNES';
      case 'cyber_neon':
        return isChance ? '⚡ SYSTEM // DECRYPT' : '🤖 QUANTUM PROTOCOL';
      case 'anime_akiba':
        return isChance ? '🎮 AKIBA LUCKY GACHA' : '🌸 ELECTRIC DRAW';
      case 'casino_royale':
        return isChance ? '🎰 ROYALE CASINO DECK' : '🎲 HIGH ROLLER FORTUNE';
      default:
        return isChance ? 'QUAKE CHANCE' : 'QUAKE FORTUNE';
    }
  };

  return (
    <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl overflow-hidden flex flex-col animate-fade-in">
      {/* Outer Card Top Header */}
      <div
        className={`px-6 py-4 flex items-center justify-between text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md ${
          isChance
            ? 'bg-gradient-to-r from-rose-700 via-pink-600 to-rose-600 border-b-2 border-pink-400/40'
            : 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 border-b-2 border-yellow-400/40'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="font-display font-black tracking-wider text-[11px] sm:text-xs">
            {getThemeHeader()}
          </span>
        </div>

        {player && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/40 text-white/90">
            {player.name}
          </span>
        )}
      </div>

      {/* Card Body with Artwork Slot */}
      <div className="p-6 flex flex-col items-center text-center gap-3.5">
        {/* Dedicated Artwork Window (Asset Slot) */}
        <div
          className={`w-full h-36 rounded-2xl border-2 flex items-center justify-center relative overflow-hidden shadow-inner ${
            isChance
              ? 'bg-rose-950/40 border-rose-500/30'
              : 'bg-amber-950/40 border-amber-500/30'
          }`}
        >
          {/* Subtle background grid pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />
          <CardVectorEmblem card={card} className="w-20 h-20 drop-shadow-md z-10" />
        </div>

        {/* Card Title */}
        <h3 className="text-base sm:text-lg font-black text-white leading-snug font-display">
          {card.title.replace(/[^a-zA-Z0-9 ’'!,.-]/g, '')}
        </h3>

        {/* Card Description */}
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 w-full text-left">
          {card.description}
        </p>

        {/* Flavor text if any */}
        {card.flavorText && (
          <div className="text-[11px] text-pink-300 font-semibold italic flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-pink-400 shrink-0" />
            <span>{card.flavorText}</span>
          </div>
        )}

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="w-full mt-1 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-white font-bold text-xs transition btn-tactile border border-slate-700 shadow-md"
        >
          Acknowledge & Continue
        </button>
      </div>
    </div>
  );
};
