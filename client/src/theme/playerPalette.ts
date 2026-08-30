import { COLOR_GROUP_HEX } from '@shared/constants';

export interface PlayerColorDefinition {
  id: string;
  name: string;
  hex: string;
  accentHex: string;
  badgeBg: string;
  badgeText: string;
}

export const PLAYER_IDENTITY_PALETTE: PlayerColorDefinition[] = [
  {
    id: 'fuchsia_orchid',
    name: 'Orchid Neon',
    hex: '#D946EF',
    accentHex: '#F0ABFC',
    badgeBg: 'rgba(217, 70, 239, 0.18)',
    badgeText: '#F5D0FE',
  },
  {
    id: 'electric_violet',
    name: 'Electric Violet',
    hex: '#8B5CF6',
    accentHex: '#C4B5FD',
    badgeBg: 'rgba(139, 92, 246, 0.18)',
    badgeText: '#DDD6FE',
  },
  {
    id: 'cyan_surge',
    name: 'Cyber Cyan',
    hex: '#06B6D4',
    accentHex: '#67E8F9',
    badgeBg: 'rgba(6, 182, 212, 0.18)',
    badgeText: '#CFFAFE',
  },
  {
    id: 'amber_sun',
    name: 'Solar Gold',
    hex: '#F59E0B',
    accentHex: '#FDE68A',
    badgeBg: 'rgba(245, 158, 11, 0.18)',
    badgeText: '#FEF3C7',
  },
  {
    id: 'hyper_indigo',
    name: 'Hyper Indigo',
    hex: '#6366F1',
    accentHex: '#A5B4FC',
    badgeBg: 'rgba(99, 102, 241, 0.18)',
    badgeText: '#E0E7FF',
  },
  {
    id: 'coral_pulse',
    name: 'Coral Pulse',
    hex: '#FB7185',
    accentHex: '#FDA4AF',
    badgeBg: 'rgba(251, 113, 133, 0.18)',
    badgeText: '#FFE4E6',
  },
  {
    id: 'lime_spark',
    name: 'Lime Spark',
    hex: '#84CC16',
    accentHex: '#BEF264',
    badgeBg: 'rgba(132, 204, 22, 0.18)',
    badgeText: '#ECFCCB',
  },
  {
    id: 'teal_matrix',
    name: 'Mint Teal',
    hex: '#14B8A6',
    accentHex: '#5EEAD4',
    badgeBg: 'rgba(20, 184, 166, 0.18)',
    badgeText: '#CCFBF1',
  },
];

/**
 * Returns clean, elegant perimeter ownership styles for a tile.
 * Gives the tile an intentional, restrained player-color frame without harsh neon bloom.
 */
export function getOwnershipOutlineStyle(
  ownerColor?: string,
  isHighlighted: boolean = false,
  isActiveTurn: boolean = false
): { style: React.CSSProperties; className: string } {
  if (!ownerColor) {
    return {
      style: {},
      className: '',
    };
  }

  if (isHighlighted) {
    return {
      style: {
        borderColor: ownerColor,
        boxShadow: `0 0 10px ${ownerColor}60, inset 0 0 0 1.5px ${ownerColor}`,
      },
      className: 'z-30 brightness-110 scale-[1.01]',
    };
  }

  if (isActiveTurn) {
    return {
      style: {
        borderColor: ownerColor,
        boxShadow: `0 0 6px ${ownerColor}40, inset 0 0 0 1.5px ${ownerColor}cc`,
      },
      className: 'z-20',
    };
  }

  return {
    style: {
      borderColor: `${ownerColor}80`,
      boxShadow: `inset 0 0 0 1px ${ownerColor}50`,
    },
    className: '',
  };
}

