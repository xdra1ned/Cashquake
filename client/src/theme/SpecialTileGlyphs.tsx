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
    if (themeId === 'world_tour') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#0C1017" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="16" cy="16" r="10" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M 10 16 L 22 16 M 16 10 L 22 16 L 16 22" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="16" cy="16" r="2" fill="#E2B144" />
        </svg>
      );
    }
    if (themeId === 'pixel_arcade') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="24" height="24" fill="#090818" stroke="#10B981" strokeWidth="2" />
          <rect x="8" y="8" width="4" height="16" fill="#FEF08A" />
          <polygon points="12,8 24,14 12,20" fill="#10B981" />
          <rect x="14" y="12" width="4" height="4" fill="#6EE7B7" />
        </svg>
      );
    }
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
          {/* Launch & Arrival Gateway */}
          <circle cx="16" cy="16" r="14" fill="#030712" stroke="#38BDF8" strokeWidth="1.8" />
          <circle cx="16" cy="16" r="9" stroke="#0284C7" strokeWidth="1" strokeDasharray="3 2" />
          <polygon points="16,6 21,15 16,13 11,15" fill="#38BDF8" />
          <line x1="16" y1="13" x2="16" y2="24" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="24" r="2.5" fill="#F43F5E" />
        </svg>
      );
    }
    if (themeId === 'cyber_neon') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* City Network Gateway */}
          <rect x="4" y="4" width="24" height="24" rx="4" fill="#040A18" stroke="#00F0FF" strokeWidth="1.8" />
          <path d="M 8 16 L 24 16 M 16 8 L 24 16 L 16 24" stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8" cy="8" r="1.5" fill="#F43F5E" />
          <circle cx="24" cy="8" r="1.5" fill="#FDE047" />
          <circle cx="8" cy="24" r="1.5" fill="#A855F7" />
        </svg>
      );
    }
    if (themeId === 'mystic_fantasy') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Realm Gate: Ancient Stone Portal with Arcane Star */}
          <circle cx="16" cy="16" r="13" fill="#130B29" stroke="#C084FC" strokeWidth="1.8" />
          <circle cx="16" cy="16" r="9" stroke="#818CF8" strokeWidth="1" strokeDasharray="3 2" />
          <path d="M 10 16 L 22 16 M 16 10 L 22 16 L 16 22" stroke="#FDE047" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="16" cy="16" r="2.5" fill="#FFFFFF" />
        </svg>
      );
    }
    if (themeId === 'anime_akiba') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Akiba Station Main Gate: Modern Neon Torii Arch & Forward Arrow */}
          <circle cx="16" cy="16" r="14" fill="#140624" stroke="#EC4899" strokeWidth="1.8" />
          <path d="M 7 10 L 25 10 M 9 13 L 23 13" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="11" y1="13" x2="11" y2="25" stroke="#F472B6" strokeWidth="1.5" />
          <line x1="21" y1="13" x2="21" y2="25" stroke="#F472B6" strokeWidth="1.5" />
          <path d="M 12 18 L 16 14 L 20 18" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="16" cy="20" r="1.5" fill="#FFFFFF" />
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

  // PRISON / DETENTION / CONTAINMENT
  if (type === 'prison') {
    if (themeId === 'world_tour') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="6" width="22" height="20" rx="3" fill="#0B1320" stroke="#475569" strokeWidth="1.5" />
          {/* Courthouse / Municipal Detention Pillars */}
          <rect x="7" y="6" width="18" height="3" fill="#334155" />
          <line x1="10" y1="9" x2="10" y2="23" stroke="#94A3B8" strokeWidth="2" />
          <line x1="16" y1="9" x2="16" y2="23" stroke="#94A3B8" strokeWidth="2" />
          <line x1="22" y1="9" x2="22" y2="23" stroke="#94A3B8" strokeWidth="2" />
          <rect x="7" y="23" width="18" height="3" fill="#334155" />
        </svg>
      );
    }
    if (themeId === 'pixel_arcade') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="22" height="22" fill="#180B28" stroke="#8B5CF6" strokeWidth="1.5" />
          <line x1="10" y1="5" x2="10" y2="27" stroke="#A78BFA" strokeWidth="2" strokeDasharray="3 2" />
          <line x1="16" y1="5" x2="16" y2="27" stroke="#A78BFA" strokeWidth="2" strokeDasharray="3 2" />
          <line x1="22" y1="5" x2="22" y2="27" stroke="#A78BFA" strokeWidth="2" strokeDasharray="3 2" />
          <rect x="13" y="13" width="6" height="6" fill="#F43F5E" />
        </svg>
      );
    }
    if (themeId === 'cyber_neon') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cyber Detention Containment Facility */}
          <rect x="5" y="5" width="22" height="22" rx="3" fill="#060814" stroke="#A855F7" strokeWidth="1.8" />
          <line x1="10" y1="5" x2="10" y2="27" stroke="#00F0FF" strokeWidth="1.8" />
          <line x1="16" y1="5" x2="16" y2="27" stroke="#F43F5E" strokeWidth="2" />
          <line x1="22" y1="5" x2="22" y2="27" stroke="#00F0FF" strokeWidth="1.8" />
          <rect x="13" y="13" width="6" height="6" rx="1" fill="#F43F5E" />
        </svg>
      );
    }
    if (themeId === 'cosmic_space') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Space Security Detention Module */}
          <rect x="5" y="5" width="22" height="22" rx="3" fill="#030818" stroke="#1E3A8A" strokeWidth="1.8" />
          <line x1="10" y1="5" x2="10" y2="27" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="16" y1="5" x2="16" y2="27" stroke="#F43F5E" strokeWidth="2" />
          <line x1="22" y1="5" x2="22" y2="27" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="3" fill="#F43F5E" />
        </svg>
      );
    }
    if (themeId === 'mystic_fantasy') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Enchanted Dungeon / Runic Cell */}
          <rect x="5" y="5" width="22" height="22" rx="3" fill="#130722" stroke="#A855F7" strokeWidth="1.8" />
          <line x1="10" y1="5" x2="10" y2="27" stroke="#C084FC" strokeWidth="1.8" />
          <line x1="16" y1="5" x2="16" y2="27" stroke="#F43F5E" strokeWidth="2" />
          <line x1="22" y1="5" x2="22" y2="27" stroke="#C084FC" strokeWidth="1.8" />
          <circle cx="16" cy="16" r="3.5" fill="#581C87" stroke="#E9D5FF" strokeWidth="1" />
        </svg>
      );
    }
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
    if (themeId === 'anime_akiba') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Akiba District Police Box (Koban / 交番) */}
          <rect x="5" y="5" width="22" height="22" rx="3" fill="#140624" stroke="#EC4899" strokeWidth="1.8" />
          {/* Red Police Siren Lantern */}
          <circle cx="16" cy="8" r="2.5" fill="#EF4444" stroke="#FCA5A5" strokeWidth="0.8" />
          <rect x="8" y="12" width="16" height="11" rx="1" fill="#090214" stroke="#F472B6" strokeWidth="1" />
          <line x1="12" y1="12" x2="12" y2="23" stroke="#F472B6" strokeWidth="1" />
          <line x1="16" y1="12" x2="16" y2="23" stroke="#F472B6" strokeWidth="1" />
          <line x1="20" y1="12" x2="20" y2="23" stroke="#F472B6" strokeWidth="1" />
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

  // VACATION / CASH POT / FREE PARKING / SAVE POINT
  if (type === 'vacation') {
    if (themeId === 'world_tour') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="22" height="22" rx="4" fill="#0B1320" stroke="#38BDF8" strokeWidth="1.5" />
          {/* City Parking Plaza Icon P */}
          <path d="M 12 23 V 9 H 17 C 19.5 9, 21 10.5, 21 13 C 21 15.5, 19.5 17, 17 17 H 12" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="23" cy="9" r="2" fill="#E2B144" />
        </svg>
      );
    }
    if (themeId === 'pixel_arcade') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="22" height="22" fill="#090818" stroke="#38BDF8" strokeWidth="1.5" />
          {/* 8-Bit Floppy Disk / Save Crystal */}
          <rect x="9" y="8" width="14" height="16" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
          <rect x="12" y="9" width="8" height="5" fill="#38BDF8" fillOpacity="0.6" />
          <rect x="11" y="16" width="10" height="7" fill="#FEF08A" />
          <rect x="13" y="18" width="3" height="4" fill="#0F172A" />
        </svg>
      );
    }
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
    if (themeId === 'cyber_neon') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Neon Lounge / Recharge Station */}
          <rect x="5" y="5" width="22" height="22" rx="4" fill="#030814" stroke="#00F0FF" strokeWidth="1.8" />
          <rect x="9" y="10" width="14" height="12" rx="2" fill="#0A152E" stroke="#00F0FF" strokeWidth="1" />
          <rect x="11" y="12" width="10" height="8" rx="1" fill="#00F0FF" fillOpacity="0.4" />
          <polygon points="17,8 14,15 17,15 15,22 20,14 17,14" fill="#FDE047" />
          <rect x="14" y="6" width="4" height="2" rx="0.5" fill="#00F0FF" />
        </svg>
      );
    }
    if (themeId === 'cosmic_space') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Zero-Gravity Recreation Station */}
          <circle cx="16" cy="16" r="13" fill="#030A1F" stroke="#38BDF8" strokeWidth="1.8" />
          <ellipse cx="16" cy="16" rx="9" ry="4" stroke="#7DD3FC" strokeWidth="1" strokeDasharray="3 2" transform="rotate(-20 16 16)" />
          <circle cx="16" cy="16" r="3.5" fill="#38BDF8" />
          <circle cx="12" cy="10" r="1.5" fill="#F43F5E" />
        </svg>
      );
    }
    if (themeId === 'mystic_fantasy') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sacred Sanctuary: Healing Shrine & Mana Tree */}
          <circle cx="16" cy="16" r="13" fill="#0C1B1E" stroke="#34D399" strokeWidth="1.8" />
          <path d="M 16 7 C 12 11, 10 16, 16 25 C 22 16, 20 11, 16 7 Z" fill="#059669" stroke="#6EE7B7" strokeWidth="1.2" />
          <circle cx="16" cy="14" r="2.5" fill="#FDE047" />
        </svg>
      );
    }
    if (themeId === 'anime_akiba') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Otaku Leisure Plaza / Maid Cafe Garden */}
          <circle cx="16" cy="16" r="14" fill="#150628" stroke="#EC4899" strokeWidth="1.8" />
          {/* Teacup / Parfait Glass */}
          <path d="M 10 14 H 22 V 18 C 22 21, 18 23, 16 23 C 14 23, 10 21, 10 18 Z" fill="#F472B6" fillOpacity="0.4" stroke="#F472B6" strokeWidth="1.2" />
          {/* Teacup Handle */}
          <path d="M 22 15 C 24 15, 25 17, 22 19" stroke="#F472B6" strokeWidth="1.2" fill="none" />
          {/* Floating Cherry Blossom & Sparkle */}
          <circle cx="16" cy="11" r="2" fill="#FDE047" />
          <circle cx="12" cy="9" r="1" fill="#F472B6" />
          <circle cx="20" cy="9" r="1" fill="#F472B6" />
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

  // GO TO PRISON / LOCKDOWN / SECURITY BREACH
  if (type === 'go_to_prison') {
    if (themeId === 'world_tour') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="24" height="24" rx="4" fill="#1E131D" stroke="#EF4444" strokeWidth="1.5" />
          {/* Police Security Shield & Siren */}
          <path d="M 16 7 L 23 10 V 17 C 23 21, 16 25, 16 25 C 16 25, 9 17, 9 17 V 10 Z" fill="#450A0A" stroke="#EF4444" strokeWidth="1.5" />
          <circle cx="16" cy="14" r="2.5" fill="#F87171" />
          <line x1="16" y1="18" x2="16" y2="21" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    }
    if (themeId === 'pixel_arcade') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="24" height="24" fill="#3B0712" stroke="#EF4444" strokeWidth="1.5" />
          {/* 8-Bit Pixel Skull */}
          <rect x="10" y="8" width="12" height="10" fill="#FCA5A5" />
          <rect x="12" y="11" width="2" height="3" fill="#450A0A" />
          <rect x="18" y="11" width="2" height="3" fill="#450A0A" />
          <rect x="12" y="18" width="8" height="4" fill="#FCA5A5" />
          <rect x="14" y="19" width="1" height="3" fill="#450A0A" />
          <rect x="17" y="19" width="1" height="3" fill="#450A0A" />
        </svg>
      );
    }
    if (themeId === 'cyber_neon') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Security Lockdown Red Barrier */}
          <rect x="4" y="4" width="24" height="24" rx="4" fill="#1C060E" stroke="#F43F5E" strokeWidth="1.8" />
          <polygon points="16,7 24,23 8,23" fill="#4C0519" stroke="#F43F5E" strokeWidth="1.5" />
          <text x="16" y="20" fill="#FFE4E6" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">!</text>
          <line x1="6" y1="27" x2="26" y2="27" stroke="#F43F5E" strokeWidth="2" strokeDasharray="3 2" />
        </svg>
      );
    }
    if (themeId === 'cosmic_space') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Detention Transfer Airlock / Emergency Ejection */}
          <rect x="4" y="4" width="24" height="24" rx="4" fill="#1C060E" stroke="#F43F5E" strokeWidth="1.8" />
          <circle cx="16" cy="16" r="8" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 2" />
          <polygon points="16,8 22,20 10,20" fill="#4C0519" stroke="#F43F5E" strokeWidth="1.2" />
          <text x="16" y="19" fill="#FFE4E6" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">!</text>
        </svg>
      );
    }
    if (themeId === 'mystic_fantasy') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Banishment Curse / Dark Void Portal */}
          <circle cx="16" cy="16" r="13" fill="#1F0418" stroke="#F43F5E" strokeWidth="1.8" />
          <path d="M 16 7 L 23 23 L 9 23 Z" fill="#4C0519" stroke="#F43F5E" strokeWidth="1.5" />
          <circle cx="16" cy="17" r="2" fill="#FDE047" />
          <path d="M 11 11 Q 16 16, 21 11" stroke="#C084FC" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      );
    }
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
    if (themeId === 'anime_akiba') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Akiba Police Station Transfer: Flashing Siren & Handcuffs */}
          <rect x="4" y="4" width="24" height="24" rx="4" fill="#200612" stroke="#F43F5E" strokeWidth="1.8" />
          <path d="M 12 18 C 12 15, 15 15, 15 18 C 15 21, 12 21, 12 18 Z M 20 18 C 20 15, 17 15, 17 18 C 17 21, 20 21, 20 18 Z" stroke="#F472B6" strokeWidth="1.5" fill="none" />
          <line x1="15" y1="18" x2="17" y2="18" stroke="#F472B6" strokeWidth="1.5" />
          <polygon points="16,7 19,13 13,13" fill="#EF4444" stroke="#FCA5A5" strokeWidth="0.8" />
          <circle cx="16" cy="11" r="1.5" fill="#FFFFFF" />
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

  // TAX / CORPORATE REVENUE AUTHORITY
  if (type === 'tax') {
    if (themeId === 'world_tour') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="13" fill="#0C1017" stroke="#E2B144" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="10" stroke="#E2B144" strokeWidth="1" strokeDasharray="2 2" />
          <text x="16" y="20" fill="#E2B144" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">$</text>
        </svg>
      );
    }
    if (themeId === 'pixel_arcade') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="22" height="22" fill="#1C1024" stroke="#F59E0B" strokeWidth="1.5" />
          <rect x="10" y="10" width="12" height="12" fill="#D97706" />
          <rect x="12" y="12" width="8" height="8" fill="#FEF08A" />
          <rect x="14" y="14" width="4" height="4" fill="#B45309" />
        </svg>
      );
    }
    if (themeId === 'cyber_neon') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Corporate Revenue Authority Digital Terminal */}
          <rect x="5" y="5" width="22" height="22" rx="3" fill="#040816" stroke="#FDE047" strokeWidth="1.8" />
          <rect x="8" y="8" width="16" height="7" rx="1" fill="#0E1E3C" stroke="#00F0FF" strokeWidth="1" />
          <text x="16" y="14" fill="#00F0FF" fontSize="6.5" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">CREDITS</text>
          <text x="16" y="23" fill="#FDE047" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">-§-</text>
        </svg>
      );
    }
    if (themeId === 'cosmic_space') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Galactic Customs Authority */}
          <circle cx="16" cy="16" r="13" fill="#040816" stroke="#38BDF8" strokeWidth="1.8" />
          <polygon points="16,8 23,12 23,20 16,24 9,20 9,12" fill="#0C1B38" stroke="#38BDF8" strokeWidth="1.2" />
          <text x="16" y="19" fill="#FDE047" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">§</text>
        </svg>
      );
    }
    if (themeId === 'mystic_fantasy') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Royal Tribute: Golden Crown of Eldoria */}
          <circle cx="16" cy="16" r="13" fill="#1A1203" stroke="#F59E0B" strokeWidth="1.8" />
          <path d="M 9 21 L 11 13 L 16 17 L 21 13 L 23 21 Z" fill="#78350F" stroke="#FBBF24" strokeWidth="1.5" />
          <circle cx="11" cy="11" r="1.5" fill="#FEF08A" />
          <circle cx="16" cy="15" r="1.5" fill="#FEF08A" />
          <circle cx="21" cy="11" r="1.5" fill="#FEF08A" />
        </svg>
      );
    }
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
    if (themeId === 'anime_akiba') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Tokyo District Revenue Authority: Gold Japanese Yen Coin (¥) */}
          <circle cx="16" cy="16" r="13" fill="#1B0A26" stroke="#F59E0B" strokeWidth="1.8" />
          <circle cx="16" cy="16" r="10" stroke="#FDE047" strokeWidth="1" strokeDasharray="3 2" />
          <text x="16" y="20" fill="#FDE047" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">¥</text>
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
    if (themeId === 'world_tour') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="6" width="22" height="20" rx="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
          {/* City News Newspaper Headline */}
          <rect x="8" y="9" width="16" height="3" fill="#38BDF8" />
          <line x1="8" y1="15" x2="24" y2="15" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="8" y1="19" x2="18" y2="19" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="8" y1="23" x2="21" y2="23" stroke="#94A3B8" strokeWidth="1.5" />
        </svg>
      );
    }
    if (themeId === 'pixel_arcade') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="22" height="22" fill="#4A044E" stroke="#F43F5E" strokeWidth="1.5" />
          {/* 8-Bit Pixel Question Box */}
          <rect x="9" y="9" width="14" height="14" fill="#D946EF" />
          <rect x="11" y="11" width="10" height="10" fill="#FDF4FF" />
          <rect x="13" y="12" width="6" height="2" fill="#701A75" />
          <rect x="17" y="14" width="2" height="3" fill="#701A75" />
          <rect x="15" y="16" width="2" height="2" fill="#701A75" />
          <rect x="15" y="19" width="2" height="2" fill="#701A75" />
        </svg>
      );
    }
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
    if (themeId === 'cosmic_space') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="13" fill="#030712" stroke="#A855F7" strokeWidth="1.5" />
          <circle cx="19" cy="13" r="3.5" fill="#EC4899" />
          <path d="M 16 15 L 8 23 M 18 17 L 11 24" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    }
    if (themeId === 'mystic_fantasy') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Wheel of Fate: Arcane Rune Wheel */}
          <circle cx="16" cy="16" r="13" fill="#140A28" stroke="#C084FC" strokeWidth="1.8" />
          <circle cx="16" cy="16" r="8" stroke="#818CF8" strokeWidth="1" strokeDasharray="3 2" />
          <polygon points="16,8 19,13 24,16 19,19 16,24 13,19 8,16 13,13" fill="#A855F7" fillOpacity="0.6" stroke="#E9D5FF" strokeWidth="1" />
          <circle cx="16" cy="16" r="2" fill="#FFFFFF" />
        </svg>
      );
    }
    if (themeId === 'cyber_neon') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Probability Engine AI Interface */}
          <rect x="5" y="5" width="22" height="22" rx="3" fill="#040A18" stroke="#00F0FF" strokeWidth="1.8" />
          <circle cx="16" cy="16" r="6" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx="16" cy="16" r="2.5" fill="#00F0FF" />
          <path d="M 16 7 L 16 10 M 16 22 L 16 25 M 7 16 L 10 16 M 22 16 L 25 16" stroke="#00F0FF" strokeWidth="1.5" strokeLinecap="round" />
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

  // FORTUNE / QUANTUM CREDIT VAULT / DRAGON'S HOARD
  if (type === 'fortune') {
    if (themeId === 'world_tour') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="6" width="24" height="20" rx="3" fill="#0F172A" stroke="#E2B144" strokeWidth="1.5" />
          {/* Financial Treasury Vault / Bank Building */}
          <polygon points="16,8 24,13 8,13" fill="#78350F" stroke="#E2B144" strokeWidth="1" />
          <line x1="10" y1="13" x2="10" y2="23" stroke="#E2B144" strokeWidth="1.5" />
          <line x1="14" y1="13" x2="14" y2="23" stroke="#E2B144" strokeWidth="1.5" />
          <line x1="18" y1="13" x2="18" y2="23" stroke="#E2B144" strokeWidth="1.5" />
          <line x1="22" y1="13" x2="22" y2="23" stroke="#E2B144" strokeWidth="1.5" />
          <rect x="7" y="23" width="18" height="2" fill="#E2B144" />
        </svg>
      );
    }
    if (themeId === 'pixel_arcade') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="22" height="22" fill="#1E1B4B" stroke="#818CF8" strokeWidth="1.5" />
          {/* 8-Bit Pixel Treasure Chest */}
          <rect x="8" y="10" width="16" height="12" fill="#78350F" stroke="#F59E0B" strokeWidth="1" />
          <rect x="8" y="10" width="16" height="4" fill="#92400E" />
          <rect x="14" y="13" width="4" height="4" fill="#FEF08A" />
          <rect x="15" y="14" width="2" height="2" fill="#1E293B" />
        </svg>
      );
    }
    if (themeId === 'cyber_neon') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Quantum Credit Vault */}
          <rect x="5" y="5" width="22" height="22" rx="4" fill="#060A18" stroke="#A855F7" strokeWidth="1.8" />
          <polygon points="16,8 24,12 24,20 16,24 8,20 8,12" fill="#1E1236" stroke="#00F0FF" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="3" fill="#FDE047" />
        </svg>
      );
    }
    if (themeId === 'cosmic_space') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cosmic Treasury / Resource Vault */}
          <rect x="5" y="5" width="22" height="22" rx="4" fill="#050C1F" stroke="#38BDF8" strokeWidth="1.8" />
          <polygon points="16,8 24,14 16,24 8,14" fill="#0369A1" stroke="#7DD3FC" strokeWidth="1.2" />
          <circle cx="16" cy="15" r="2.5" fill="#FDE047" />
        </svg>
      );
    }
    if (themeId === 'mystic_fantasy') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Dragon's Hoard Ancient Golden Chest */}
          <rect x="5" y="8" width="22" height="17" rx="3" fill="#1A1005" stroke="#F59E0B" strokeWidth="1.8" />
          <path d="M 5 14 Q 16 11, 27 14" stroke="#FDE047" strokeWidth="1.5" />
          <rect x="14" y="13" width="4" height="5" rx="1" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1" />
          <circle cx="16" cy="15" r="1" fill="#000000" />
        </svg>
      );
    }
    if (themeId === 'casino_royale') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="6" width="24" height="20" rx="3" fill="#1C1917" stroke="#F59E0B" strokeWidth="1.5" />
          <rect x="7" y="10" width="18" height="10" rx="2" fill="#04180D" stroke="#D97706" strokeWidth="1" />
          <text x="16" y="18" fill="#FDE047" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">777</text>
        </svg>
      );
    }
    if (themeId === 'anime_akiba') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Lucky Cat Shrine (Maneki-Neko 招き猫) */}
          <rect x="5" y="5" width="22" height="22" rx="4" fill="#180726" stroke="#EC4899" strokeWidth="1.8" />
          {/* Cat Head */}
          <circle cx="16" cy="16" r="6" fill="#FDF2F8" stroke="#EC4899" strokeWidth="1" />
          {/* Cat Ears */}
          <polygon points="11,12 13,8 15,12" fill="#EC4899" />
          <polygon points="17,12 19,8 21,12" fill="#EC4899" />
          {/* Waving Golden Paw */}
          <circle cx="21" cy="13" r="2" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
          {/* Golden Koban Coin */}
          <ellipse cx="16" cy="18" rx="2.5" ry="3.5" fill="#FDE047" stroke="#D97706" strokeWidth="0.8" />
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

  // RAILROAD / AUTONOMOUS TRANSIT NETWORK
  if (type === 'railroad') {
    if (themeId === 'world_tour') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="22" height="22" rx="4" fill="#0C1017" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Modern Metropolitan Metro Train Facade */}
          <rect x="9" y="7" width="14" height="14" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
          <rect x="11" y="9" width="10" height="4" rx="1" fill="#38BDF8" fillOpacity="0.7" />
          <circle cx="12" cy="17" r="1.5" fill="#FEF08A" />
          <circle cx="20" cy="17" r="1.5" fill="#FEF08A" />
          <line x1="7" y1="24" x2="25" y2="24" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    }
    if (themeId === 'pixel_arcade') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="22" height="22" fill="#030712" stroke="#06B6D4" strokeWidth="1.5" />
          {/* 8-Bit Pixel Warp Portal */}
          <rect x="10" y="8" width="12" height="16" fill="#0E7490" />
          <rect x="12" y="10" width="8" height="12" fill="#22D3EE" />
          <rect x="14" y="12" width="4" height="8" fill="#E0F2FE" />
        </svg>
      );
    }
    if (themeId === 'cyber_neon') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Autonomous Maglev Transit Pod */}
          <rect x="5" y="5" width="22" height="22" rx="4" fill="#040918" stroke="#00F0FF" strokeWidth="1.8" />
          <rect x="8" y="9" width="16" height="10" rx="3" fill="#0C1B38" stroke="#00F0FF" strokeWidth="1" />
          <rect x="10" y="11" width="12" height="3" rx="1" fill="#00F0FF" fillOpacity="0.8" />
          <circle cx="10" cy="16" r="1" fill="#F43F5E" />
          <circle cx="22" cy="16" r="1" fill="#F43F5E" />
          <line x1="6" y1="23" x2="26" y2="23" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    }
    if (themeId === 'mystic_fantasy') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Arcane Winged Transit / Dragon Flightline */}
          <circle cx="16" cy="16" r="13" fill="#0C152B" stroke="#38BDF8" strokeWidth="1.8" />
          <path d="M 7 17 Q 16 8, 25 17 Q 16 13, 7 17 Z" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.2" />
          <polygon points="16,10 19,16 13,16" fill="#FDE047" />
        </svg>
      );
    }
    if (themeId === 'cosmic_space') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="13" fill="#030712" stroke="#38BDF8" strokeWidth="1.5" />
          <path d="M 16 6 L 20 16 L 16 14 L 12 16 Z" fill="#38BDF8" />
          <path d="M 14 17 L 16 24 L 18 17 Z" fill="#F43F5E" />
        </svg>
      );
    }
    if (themeId === 'anime_akiba') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* JR Yamanote Line Akiba Commuter Train */}
          <rect x="6" y="6" width="20" height="20" rx="3" fill="#140624" stroke="#22C55E" strokeWidth="1.8" />
          {/* Train Front Cab */}
          <rect x="9" y="8" width="14" height="14" rx="2" fill="#0F172A" stroke="#22C55E" strokeWidth="1" />
          {/* Windshield */}
          <rect x="11" y="10" width="10" height="5" rx="1" fill="#38BDF8" fillOpacity="0.8" />
          {/* Green Yamanote Stripe */}
          <rect x="9" y="16" width="14" height="2" fill="#22C55E" />
          {/* Dual Headlights */}
          <circle cx="12" cy="19.5" r="1.2" fill="#FEF08A" />
          <circle cx="20" cy="19.5" r="1.2" fill="#FEF08A" />
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

  // UTILITY / QUANTUM ENERGY GRID & WATER COOLING / MANA SPRINGS
  if (type === 'utility') {
    if (themeId === 'world_tour') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="13" fill="#090D14" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Electricity Grid Bolt & Water Wave */}
          <polygon points="17,7 11,15 16,15 14,24 22,14 17,14" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
        </svg>
      );
    }
    if (themeId === 'pixel_arcade') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="22" height="22" fill="#1E1B4B" stroke="#A855F7" strokeWidth="1.5" />
          {/* 8-Bit Pixel Energy Crystal */}
          <polygon points="16,8 22,14 16,24 10,14" fill="#C084FC" stroke="#E9D5FF" strokeWidth="1" />
          <rect x="14" y="12" width="4" height="4" fill="#FFFFFF" />
        </svg>
      );
    }
    if (themeId === 'cyber_neon') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Quantum Fusion Core / Plasma Grid */}
          <circle cx="16" cy="16" r="13" fill="#030918" stroke="#00F0FF" strokeWidth="1.8" />
          <circle cx="16" cy="16" r="7" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx="16" cy="16" r="3" fill="#00F0FF" />
          <line x1="16" y1="4" x2="16" y2="8" stroke="#00F0FF" strokeWidth="1.5" />
          <line x1="16" y1="24" x2="16" y2="28" stroke="#00F0FF" strokeWidth="1.5" />
          <line x1="4" y1="16" x2="8" y2="16" stroke="#00F0FF" strokeWidth="1.5" />
          <line x1="24" y1="16" x2="28" y2="16" stroke="#00F0FF" strokeWidth="1.5" />
        </svg>
      );
    }
    if (themeId === 'cosmic_space') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Solar Fusion Reactor & Life Support Grid */}
          <circle cx="16" cy="16" r="13" fill="#030718" stroke="#38BDF8" strokeWidth="1.8" />
          <circle cx="16" cy="16" r="7" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 2" />
          <polygon points="16,8 20,16 16,14 12,16" fill="#FDE047" />
          <circle cx="16" cy="16" r="2.5" fill="#38BDF8" />
        </svg>
      );
    }
    if (themeId === 'mystic_fantasy') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Mana Springs & Elemental Forge */}
          <circle cx="16" cy="16" r="13" fill="#0A1828" stroke="#38BDF8" strokeWidth="1.8" />
          <polygon points="16,7 23,16 16,25 9,16" fill="#0284C7" stroke="#7DD3FC" strokeWidth="1.2" />
          <circle cx="16" cy="16" r="3" fill="#FDE047" />
        </svg>
      );
    }
    if (themeId === 'anime_akiba') {
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Tokyo Electric & High-Speed Optical Grid */}
          <circle cx="16" cy="16" r="13" fill="#140624" stroke="#F59E0B" strokeWidth="1.8" />
          <polygon points="17,6 10,16 16,16 14,26 23,14 17,14" fill="#FDE047" stroke="#F59E0B" strokeWidth="0.8" />
          <circle cx="24" cy="9" r="1.5" fill="#06B6D4" />
          <circle cx="8" cy="22" r="1.5" fill="#EC4899" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="13" fill={themeId === 'casino_royale' ? '#062314' : '#1E1B4B'} stroke={themeId === 'casino_royale' ? '#F59E0B' : '#818CF8'} strokeWidth="1.5" />
        <polygon points="17,7 10,16 15,16 13,25 22,14 17,14" fill={themeId === 'casino_royale' ? '#FDE047' : '#A5B4FC'} stroke={themeId === 'casino_royale' ? '#D97706' : '#6366F1'} strokeWidth="1" />
      </svg>
    );
  }

  return null;
};
