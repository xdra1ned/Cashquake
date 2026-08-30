import React from 'react';
import type { BoardThemeId, TileType } from '@shared/types';

interface SpecialTileGlyphProps {
  type: TileType;
  themeId: BoardThemeId;
  color?: string;
  className?: string;
}

export const SpecialTileGlyph: React.FC<SpecialTileGlyphProps> = ({
  type,
  themeId,
  color = '#CA8A04',
  className = 'w-6 h-6',
}) => {
  // START / GO SPACE
  if (type === 'start') {
    if (themeId === 'casino_royale') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#062314" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="16" cy="16" r="10" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M 11 16 L 21 16 M 16 11 L 21 16 L 16 21" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="16" cy="16" r="2" fill="#FFFFFF" />
        </svg>
      );
    }
    if (themeId === 'cosmic_space') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#030712" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="9" stroke="#0284C7" strokeWidth="1" strokeDasharray="2 3" />
          <polygon points="16,7 20,15 16,13 12,15" fill="#38BDF8" />
          <circle cx="16" cy="22" r="2.5" fill="#F43F5E" />
        </svg>
      );
    }
    if (themeId === 'cyber_neon') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="24" height="24" rx="4" fill="#020617" stroke="#22D3EE" strokeWidth="1.5" />
          <path d="M 10 16 L 22 16 M 16 10 L 22 16 L 16 22" stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="8" cy="8" r="1.5" fill="#EC4899" />
          <circle cx="24" cy="24" r="1.5" fill="#22D3EE" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#0B132B" stroke={color} strokeWidth="2" />
        <path d="M 10 16 L 22 16 M 17 11 L 22 16 L 17 21" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="16" r="1.5" fill="#FFFFFF" />
      </svg>
    );
  }

  // PRISON / DETENTION
  if (type === 'prison') {
    if (themeId === 'casino_royale') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="6" width="22" height="20" rx="3" fill="#1C1917" stroke="#D97706" strokeWidth="1.5" />
          <line x1="10" y1="6" x2="10" y2="26" stroke="#F59E0B" strokeWidth="1.5" />
          <line x1="16" y1="6" x2="16" y2="26" stroke="#F59E0B" strokeWidth="1.5" />
          <line x1="22" y1="6" x2="22" y2="26" stroke="#F59E0B" strokeWidth="1.5" />
          <line x1="5" y1="16" x2="27" y2="16" stroke="#D97706" strokeWidth="1.5" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="6" width="22" height="20" rx="3" fill="#0F172A" stroke={color} strokeWidth="1.5" />
        <line x1="10" y1="6" x2="10" y2="26" stroke={color} strokeWidth="1.5" strokeOpacity="0.8" />
        <line x1="16" y1="6" x2="16" y2="26" stroke={color} strokeWidth="1.5" strokeOpacity="0.8" />
        <line x1="22" y1="6" x2="22" y2="26" stroke={color} strokeWidth="1.5" strokeOpacity="0.8" />
        <line x1="5" y1="16" x2="27" y2="16" stroke={color} strokeWidth="1.5" strokeOpacity="0.8" />
      </svg>
    );
  }

  // VACATION / CASH POT / FREE PARKING
  if (type === 'vacation') {
    if (themeId === 'casino_royale') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#062314" stroke="#F59E0B" strokeWidth="2" />
          <path d="M 9 20 L 11 12 L 16 16 L 21 12 L 23 20 Z" fill="#78350F" stroke="#FBBF24" strokeWidth="1.5" />
          <circle cx="11" cy="10" r="1.5" fill="#FEF08A" />
          <circle cx="16" cy="14" r="1.5" fill="#FEF08A" />
          <circle cx="21" cy="10" r="1.5" fill="#FEF08A" />
        </svg>
      );
    }
    if (themeId === 'world_tour') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#0C4A6E" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Resort Palm & Umbrella */}
          <circle cx="16" cy="10" r="2.5" fill="#FDE047" />
          <path d="M 16 13 Q 13 17, 10 22 M 16 13 Q 19 17, 22 22 M 16 13 L 16 23" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 8 23 L 24 23" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#172554" stroke={color} strokeWidth="1.5" />
        <circle cx="16" cy="11" r="3" fill={color} />
        <path d="M 16 14 Q 14 18, 11 23 M 16 14 Q 18 18, 21 23 M 16 14 L 16 24" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M 8 24 L 24 24" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // GO TO PRISON / LOCKDOWN
  if (type === 'go_to_prison') {
    if (themeId === 'casino_royale') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="24" height="24" rx="6" fill="#450A0A" stroke="#EF4444" strokeWidth="1.5" />
          <path d="M 10 20 C 10 14, 22 14, 22 20 Z" fill="#DC2626" stroke="#F87171" strokeWidth="1.5" />
          <line x1="16" y1="8" x2="16" y2="12" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" />
          <line x1="9" y1="10" x2="11" y2="12" stroke="#FCA5A5" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="23" y1="10" x2="21" y2="12" stroke="#FCA5A5" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="8" y="20" width="16" height="4" rx="1" fill="#7F1D1D" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="24" height="24" rx="6" fill="#450A0A" stroke="#EF4444" strokeWidth="1.5" />
        <path d="M 16 8 L 22 11 V 17 C 22 21, 16 24, 16 24 C 16 24, 10 17, 10 11 Z" fill="#7F1D1D" stroke="#F87171" strokeWidth="1.5" />
        <circle cx="16" cy="15" r="2" fill="#FEE2E2" />
        <line x1="16" y1="17" x2="16" y2="19" stroke="#FEE2E2" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // TAX / SURCHARGE SPACES
  if (type === 'tax') {
    if (themeId === 'casino_royale') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="13" fill="#1C1917" stroke="#D97706" strokeWidth="1.5" />
          <ellipse cx="16" cy="11" rx="8" ry="3" fill="#78350F" stroke="#FBBF24" strokeWidth="1" />
          <ellipse cx="16" cy="15" rx="8" ry="3" fill="#92400E" stroke="#F59E0B" strokeWidth="1" />
          <ellipse cx="16" cy="19" rx="8" ry="3" fill="#B45309" stroke="#FDE047" strokeWidth="1" />
          <text x="16" y="20" fill="#FEF08A" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">$</text>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="13" fill="#1C1917" stroke="#F59E0B" strokeWidth="1.5" />
        <path d="M 12 12 C 12 9, 20 9, 20 12 C 20 15, 23 18, 23 21 C 23 24, 9 24, 9 21 C 9 18, 12 15, 12 12 Z" fill="#78350F" stroke="#FBBF24" strokeWidth="1.5" />
        <text x="16" y="20" fill="#FEF08A" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">$</text>
      </svg>
    );
  }

  // CHANCE CARD SPACE
  if (type === 'chance') {
    if (themeId === 'casino_royale') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="13" fill="#062314" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="8" stroke="#DC2626" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="16" cy="16" r="3" fill="#FBBF24" />
          <circle cx="12" cy="11" r="1.5" fill="#FFFFFF" />
        </svg>
      );
    }
    if (themeId === 'world_tour') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="22" height="22" rx="4" fill="#0C4A6E" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Compass Rose / Airplane */}
          <path d="M 16 8 L 22 22 L 16 18 L 10 22 Z" fill="#0284C7" stroke="#BAE6FD" strokeWidth="1" />
        </svg>
      );
    }
    if (themeId === 'cosmic_space') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="13" fill="#030712" stroke="#A855F7" strokeWidth="1.5" />
          {/* Meteor / Comet */}
          <circle cx="19" cy="13" r="3.5" fill="#EC4899" />
          <path d="M 16 15 L 8 23 M 18 17 L 11 24" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    }
    if (themeId === 'mystic_fantasy') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="16,5 26,16 16,27 6,16" fill="#2E1065" stroke="#C084FC" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="4" fill="#9333EA" stroke="#F3E8FF" strokeWidth="1" />
        </svg>
      );
    }
    if (themeId === 'cyber_neon') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="22" height="22" rx="3" fill="#020617" stroke="#00F0FF" strokeWidth="1.5" />
          <text x="16" y="21" fill="#00F0FF" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">//?</text>
        </svg>
      );
    }
    if (themeId === 'anime_akiba') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="13" fill="#831843" stroke="#F472B6" strokeWidth="1.5" />
          <circle cx="16" cy="13" r="3" fill="#FDE047" />
          <text x="16" y="23" fill="#FCE7F3" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">★</text>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="4" width="22" height="24" rx="4" fill="#500724" stroke="#F43F5E" strokeWidth="1.5" />
        <text x="16" y="21" fill="#FFE4E6" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">?</text>
      </svg>
    );
  }

  // FORTUNE CARD SPACE
  if (type === 'fortune') {
    if (themeId === 'casino_royale') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="6" width="24" height="20" rx="3" fill="#1C1917" stroke="#F59E0B" strokeWidth="1.5" />
          <rect x="7" y="10" width="18" height="10" rx="2" fill="#04180D" stroke="#D97706" strokeWidth="1" />
          <text x="16" y="18" fill="#FDE047" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">777</text>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="4" width="22" height="24" rx="4" fill="#451A03" stroke="#D97706" strokeWidth="1.5" />
        <polygon points="16,8 22,16 16,24 10,16" fill="#78350F" stroke="#FBBF24" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="2" fill="#FEF3C7" />
      </svg>
    );
  }

  // RAILROAD / TRANSIT SPACES
  if (type === 'railroad') {
    if (themeId === 'world_tour') {
      // Flight Departure Gate
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="6" width="22" height="20" rx="3" fill="#0C4A6E" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Airplane Silhouette */}
          <path d="M 16 9 L 18 14 L 24 16 L 18 17 L 17 21 L 19 23 L 16 22 L 13 23 L 15 21 L 14 17 L 8 16 L 14 14 Z" fill="#BAE6FD" />
        </svg>
      );
    }
    if (themeId === 'cosmic_space') {
      // Warp Launchpad
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="13" fill="#030712" stroke="#38BDF8" strokeWidth="1.5" />
          <path d="M 16 6 L 20 16 L 16 14 L 12 16 Z" fill="#38BDF8" />
          <path d="M 14 17 L 16 24 L 18 17 Z" fill="#F43F5E" />
        </svg>
      );
    }
    if (themeId === 'mystic_fantasy') {
      // Arcane Portal
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="13" fill="#2E1065" stroke="#C084FC" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="8" stroke="#E9D5FF" strokeWidth="1" strokeDasharray="3 2" />
          <polygon points="16,11 19,16 16,21 13,16" fill="#A855F7" />
        </svg>
      );
    }
    if (themeId === 'cyber_neon') {
      // Cyber Hyperloop Conduit
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="6" width="22" height="20" rx="3" fill="#020617" stroke="#00F0FF" strokeWidth="1.5" />
          <line x1="8" y1="16" x2="24" y2="16" stroke="#00F0FF" strokeWidth="2" strokeDasharray="4 2" />
          <polygon points="21,13 25,16 21,19" fill="#22D3EE" />
        </svg>
      );
    }
    if (themeId === 'anime_akiba') {
      // Monorail Express
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="8" width="20" height="16" rx="4" fill="#831843" stroke="#F472B6" strokeWidth="1.5" />
          <rect x="9" y="11" width="5" height="5" rx="1" fill="#FCE7F3" />
          <rect x="18" y="11" width="5" height="5" rx="1" fill="#FCE7F3" />
          <circle cx="11" cy="20" r="1.5" fill="#F472B6" />
          <circle cx="21" cy="20" r="1.5" fill="#F472B6" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="20" height="20" rx="3" fill="#0F172A" stroke={themeId === 'casino_royale' ? '#F59E0B' : '#94A3B8'} strokeWidth="1.5" />
        <line x1="8" y1="12" x2="24" y2="12" stroke={themeId === 'casino_royale' ? '#FEF08A' : '#CBD5E1'} strokeWidth="1.5" />
        <line x1="8" y1="20" x2="24" y2="20" stroke={themeId === 'casino_royale' ? '#FEF08A' : '#CBD5E1'} strokeWidth="1.5" />
        <line x1="11" y1="9" x2="11" y2="23" stroke={themeId === 'casino_royale' ? '#F59E0B' : '#94A3B8'} strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="9" x2="16" y2="23" stroke={themeId === 'casino_royale' ? '#F59E0B' : '#94A3B8'} strokeWidth="2" strokeLinecap="round" />
        <line x1="21" y1="9" x2="21" y2="23" stroke={themeId === 'casino_royale' ? '#F59E0B' : '#94A3B8'} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // UTILITY / POWER / WATER
  if (type === 'utility') {
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="13" fill={themeId === 'casino_royale' ? '#062314' : '#1E1B4B'} stroke={themeId === 'casino_royale' ? '#F59E0B' : '#818CF8'} strokeWidth="1.5" />
        <polygon points="17,7 10,16 15,16 13,25 22,14 17,14" fill={themeId === 'casino_royale' ? '#FDE047' : '#A5B4FC'} stroke={themeId === 'casino_royale' ? '#D97706' : '#6366F1'} strokeWidth="1" />
      </svg>
    );
  }

  return null;
};
