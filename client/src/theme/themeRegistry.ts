import type { BoardThemeId } from '@shared/types';
import type { ThemeDefinition } from './ThemeDefinition';

// ---------------------------------------------------------------------------
// Theme Definitions
// ---------------------------------------------------------------------------
// Each theme specifies its own color palette, asset slot paths, and optional
// color group overrides. Programmatic center patterns are used until real
// board artwork is placed at the specified asset paths.
// ---------------------------------------------------------------------------

const THEMES: Record<BoardThemeId, ThemeDefinition> = {
  world_tour: {
    id: 'world_tour',
    displayName: 'World Metropolis',
    tagline: 'From Cairo to Tokyo — every city has a price.',
    colors: {
      boardBg: '#111009',
      boardBorder: '#6b5a3e',
      centerBg: '#0e0d08',
      centerBorder: '#3d3422',
      centerPattern: 'compass',
      centerPatternColor: '#6b5a3e',
      uiAccent: '#ca8a04',
      uiAccentAlt: '#92400e',
      cardAccent: '#b45309',
      cardArtTint: '#1c1408',
      specialBg: '#1a1508',
      turnGlow: '#fbbf24',
    },
    assets: {
      basePath: '/assets/themes/world_tour/',
      boardCenterArt: null, // → place at /assets/themes/world_tour/board-center.svg
      boardOverlayArt: null,
      cardArtBasePath: null, // → place at /assets/themes/world_tour/cards/
      tileArtBasePath: null, // → place at /assets/themes/world_tour/tiles/
    },
  },

  cyber_neon: {
    id: 'cyber_neon',
    displayName: 'Cyber Neon 2099',
    tagline: 'Own the grid. Hack the rent.',
    colors: {
      boardBg: '#030712',
      boardBorder: '#0e7490',
      centerBg: '#020a14',
      centerBorder: '#164e63',
      centerPattern: 'circuit',
      centerPatternColor: '#0e7490',
      uiAccent: '#22d3ee',
      uiAccentAlt: '#d946ef',
      cardAccent: '#06b6d4',
      cardArtTint: '#021018',
      specialBg: '#041018',
      turnGlow: '#22d3ee',
    },
    assets: {
      basePath: '/assets/themes/cyber_neon/',
      boardCenterArt: null,
      boardOverlayArt: null,
      cardArtBasePath: null,
      tileArtBasePath: null,
    },
    colorGroupOverrides: {
      brown: '#7c3aed',
      light_blue: '#22d3ee',
      pink: '#e879f9',
      orange: '#f97316',
      red: '#ef4444',
      yellow: '#eab308',
      green: '#4ade80',
      dark_blue: '#60a5fa',
    },
  },

  mystic_fantasy: {
    id: 'mystic_fantasy',
    displayName: 'Mystic Fantasy Realm',
    tagline: 'Claim the enchanted lands. Pay with gold.',
    colors: {
      boardBg: '#060d08',
      boardBorder: '#3d6b3e',
      centerBg: '#050c07',
      centerBorder: '#1e4020',
      centerPattern: 'mandala',
      centerPatternColor: '#4ade80',
      uiAccent: '#4ade80',
      uiAccentAlt: '#fbbf24',
      cardAccent: '#16a34a',
      cardArtTint: '#071209',
      specialBg: '#0a1a0c',
      turnGlow: '#4ade80',
    },
    assets: {
      basePath: '/assets/themes/mystic_fantasy/',
      boardCenterArt: null,
      boardOverlayArt: null,
      cardArtBasePath: null,
      tileArtBasePath: null,
    },
    colorGroupOverrides: {
      brown: '#92400e',
      light_blue: '#5eead4',
      pink: '#f472b6',
      orange: '#fb923c',
      red: '#dc2626',
      yellow: '#ca8a04',
      green: '#15803d',
      dark_blue: '#1d4ed8',
    },
  },

  cosmic_space: {
    id: 'cosmic_space',
    displayName: 'Cosmic Space Colony',
    tagline: 'Colonize the void. Tax the cosmos.',
    colors: {
      boardBg: '#020617',
      boardBorder: '#334155',
      centerBg: '#010514',
      centerBorder: '#1e293b',
      centerPattern: 'constellation',
      centerPatternColor: '#475569',
      uiAccent: '#94a3b8',
      uiAccentAlt: '#a855f7',
      cardAccent: '#6366f1',
      cardArtTint: '#050216',
      specialBg: '#060a1a',
      turnGlow: '#c4b5fd',
    },
    assets: {
      basePath: '/assets/themes/cosmic_space/',
      boardCenterArt: null,
      boardOverlayArt: null,
      cardArtBasePath: null,
      tileArtBasePath: null,
    },
    colorGroupOverrides: {
      brown: '#7c3aed',
      light_blue: '#7dd3fc',
      pink: '#f0abfc',
      orange: '#fb923c',
      red: '#f87171',
      yellow: '#fde68a',
      green: '#86efac',
      dark_blue: '#818cf8',
    },
  },

  anime_akiba: {
    id: 'anime_akiba',
    displayName: 'Akiba District', // Provisional name — treat as placeholder
    tagline: 'Buy the block. Own the district.',
    colors: {
      boardBg: '#110b18',
      boardBorder: '#7c3f7a',
      centerBg: '#0d0914',
      centerBorder: '#4a2048',
      centerPattern: 'blossom',
      centerPatternColor: '#ec4899',
      uiAccent: '#ec4899',
      uiAccentAlt: '#818cf8',
      cardAccent: '#db2777',
      cardArtTint: '#14091a',
      specialBg: '#1a0d22',
      turnGlow: '#f472b6',
    },
    assets: {
      basePath: '/assets/themes/anime_akiba/',
      boardCenterArt: null,
      boardOverlayArt: null,
      cardArtBasePath: null,
      tileArtBasePath: null,
    },
  },

  casino_royale: {
    id: 'casino_royale',
    displayName: 'Casino Royale',
    tagline: 'Spin the wheel. Roll the dice. Break the bank.',
    colors: {
      boardBg: '#062314',
      boardBorder: '#d97706',
      centerBg: '#04180d',
      centerBorder: '#78350f',
      centerPattern: 'roulette',
      centerPatternColor: '#fbbf24',
      uiAccent: '#f59e0b',
      uiAccentAlt: '#e11d48',
      cardAccent: '#d97706',
      cardArtTint: '#082618',
      specialBg: '#092a19',
      turnGlow: '#fde047',
    },
    assets: {
      basePath: '/assets/themes/casino_royale/',
      boardCenterArt: null,
      boardOverlayArt: null,
      cardArtBasePath: null,
      tileArtBasePath: null,
    },
    colorGroupOverrides: {
      brown: '#78350f',
      light_blue: '#38bdf8',
      pink: '#f43f5e',
      orange: '#f97316',
      red: '#dc2626',
      yellow: '#eab308',
      green: '#10b981',
      dark_blue: '#2563eb',
    },
  },
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getTheme(themeId: BoardThemeId): ThemeDefinition {
  return THEMES[themeId] ?? THEMES.world_tour;
}

export function getAllThemes(): ThemeDefinition[] {
  return Object.values(THEMES);
}

export { THEMES };
