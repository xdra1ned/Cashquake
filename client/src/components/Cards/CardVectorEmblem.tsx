import React, { useEffect, useState } from 'react';
import { DrawnCard } from '@shared/types';

interface CardVectorEmblemProps {
  card: DrawnCard;
  className?: string;
}

export const CardVectorEmblem: React.FC<CardVectorEmblemProps> = ({ card, className = 'w-16 h-16' }) => {
  const [customArt, setCustomArt] = useState<string | null>(null);

  useEffect(() => {
    // Check if real user asset exists at /assets/cards/{id}.svg
    const testPath = `/assets/cards/${card.id}.svg`;
    const img = new Image();
    img.onload = () => setCustomArt(testPath);
    img.onerror = () => setCustomArt(null);
    img.src = testPath;
  }, [card.id]);

  if (customArt) {
    return <img src={customArt} alt={card.title} className={`object-contain ${className}`} />;
  }

  const isChance = card.type === 'chance';
  const action = card.effect.action;

  // Render thematic vector emblem based on action type
  switch (action) {
    case 'gain_cash':
    case 'special_blessing':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="#14532D" stroke="#22C55E" strokeWidth="2.5" />
          {/* Stacked Gold Coins / Bill Vault */}
          <ellipse cx="32" cy="40" rx="16" ry="6" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
          <ellipse cx="32" cy="34" rx="16" ry="6" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          <ellipse cx="32" cy="28" rx="16" ry="6" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
          <path d="M 28 20 L 32 14 L 36 20 Z" fill="#22C55E" />
          <text x="32" y="32" fill="#713F12" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">$</text>
        </svg>
      );

    case 'lose_cash':
    case 'pay_per_building':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="#450A0A" stroke="#EF4444" strokeWidth="2.5" />
          {/* Warning Gavel / Tax writ */}
          <rect x="20" y="24" width="24" height="12" rx="3" fill="#B91C1C" stroke="#FCA5A5" strokeWidth="1.5" />
          <rect x="30" y="36" width="4" height="16" rx="2" fill="#FCA5A5" />
          <line x1="24" y1="30" x2="40" y2="30" stroke="#FEE2E2" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'move_to':
    case 'move_relative':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="#0C4A6E" stroke="#38BDF8" strokeWidth="2.5" />
          {/* Kinetic Warp Arrow & Compass Grid */}
          <circle cx="32" cy="32" r="18" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />
          <polygon points="32,16 44,40 32,34 20,40" fill="#38BDF8" stroke="#0369A1" strokeWidth="1.5" />
          <circle cx="32" cy="32" r="2.5" fill="#FFFFFF" />
        </svg>
      );

    case 'go_to_prison':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="48" height="48" rx="8" fill="#1E293B" stroke="#94A3B8" strokeWidth="2.5" />
          {/* Prison Iron Bars */}
          <line x1="20" y1="8" x2="20" y2="56" stroke="#94A3B8" strokeWidth="2.5" />
          <line x1="32" y1="8" x2="32" y2="56" stroke="#94A3B8" strokeWidth="2.5" />
          <line x1="44" y1="8" x2="44" y2="56" stroke="#94A3B8" strokeWidth="2.5" />
          <circle cx="32" cy="32" r="7" fill="#EF4444" stroke="#7F1D1D" strokeWidth="2" />
        </svg>
      );

    case 'get_out_of_prison':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="16" width="48" height="32" rx="6" fill="#78350F" stroke="#F59E0B" strokeWidth="2" />
          {/* VIP Pass Golden Ticket */}
          <circle cx="8" cy="32" r="4" fill="#0F172A" />
          <circle cx="56" cy="32" r="4" fill="#0F172A" />
          <line x1="20" y1="24" x2="44" y2="24" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
          <text x="32" y="38" fill="#FEF3C7" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">FREE PASS</text>
        </svg>
      );

    case 'all_pay_player':
    case 'player_pay_all':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="#4C1D95" stroke="#A855F7" strokeWidth="2.5" />
          {/* Multi-Player Gift / Exchange Icon */}
          <polygon points="32,16 42,26 36,26 36,40 28,40 28,26 22,26" fill="#C084FC" stroke="#7E22CE" strokeWidth="1.5" />
          <circle cx="32" cy="48" r="3" fill="#FDE047" />
        </svg>
      );

    case 'chaos_trigger':
    default:
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill={isChance ? '#500724' : '#451A03'} stroke={isChance ? '#F43F5E' : '#D97706'} strokeWidth="2.5" />
          <polygon points="32,12 40,26 54,28 44,38 46,52 32,44 18,52 20,38 10,28 24,26" fill={isChance ? '#FB7185' : '#FBBF24'} />
          <circle cx="32" cy="32" r="4" fill="#FFFFFF" />
        </svg>
      );
  }
};
