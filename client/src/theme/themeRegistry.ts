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
    tagline: 'Build your skyline. Own the financial district.',
    colors: {
      boardBg: '#090d14',
      boardBorder: '#334155',
      centerBg: '#06090e',
      centerBorder: '#1e293b',
      centerPattern: 'metropolis_skyline',
      centerPatternColor: '#38bdf8',
      uiAccent: '#38bdf8',
      uiAccentAlt: '#e2b144',
      cardAccent: '#0284c7',
      cardArtTint: '#08111e',
      specialBg: '#0b1320',
      turnGlow: '#38bdf8',
    },
    assets: {
      basePath: '/assets/themes/world_tour/',
      boardCenterArt: null,
      boardOverlayArt: null,
      cardArtBasePath: null,
      tileArtBasePath: null,
    },
    colorGroupOverrides: {
      brown: '#92400e',
      light_blue: '#38bdf8',
      pink: '#f43f5e',
      orange: '#f97316',
      red: '#ef4444',
      yellow: '#eab308',
      green: '#10b981',
      dark_blue: '#2563eb',
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
      boardBg: '#090514',
      boardBorder: '#4c1d95',
      centerBg: '#120a24',
      centerBorder: '#581c87',
      centerPattern: 'mandala',
      centerPatternColor: '#c084fc',
      uiAccent: '#c084fc',
      uiAccentAlt: '#fde047',
      cardAccent: '#9333ea',
      cardArtTint: '#120a24',
      specialBg: '#1a1033',
      turnGlow: '#c084fc',
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
    displayName: 'Cosmic Space Expanse',
    tagline: 'Explore the deep cosmos. Build your orbital empire.',
    colors: {
      boardBg: '#020617',
      boardBorder: '#1e293b',
      centerBg: '#020617',
      centerBorder: '#1e3a8a',
      centerPattern: 'constellation',
      centerPatternColor: '#38bdf8',
      uiAccent: '#38bdf8',
      uiAccentAlt: '#f43f5e',
      cardAccent: '#2563eb',
      cardArtTint: '#020617',
      specialBg: '#0b1329',
      turnGlow: '#38bdf8',
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
    displayName: 'Anime Akiba District 🌸',
    tagline: 'Neon arcades. Maid cafés. The ultimate electric wonderland.',
    colors: {
      boardBg: '#120824',
      boardBorder: '#be185d',
      centerBg: '#090414',
      centerBorder: '#6b21a8',
      centerPattern: 'akiba_district',
      centerPatternColor: '#f472b6',
      uiAccent: '#ec4899',
      uiAccentAlt: '#06b6d4',
      cardAccent: '#f43f5e',
      cardArtTint: '#17092b',
      specialBg: '#1f0d36',
      turnGlow: '#f472b6',
    },
    assets: {
      basePath: '/assets/themes/anime_akiba/',
      boardCenterArt: null,
      boardOverlayArt: null,
      cardArtBasePath: null,
      tileArtBasePath: null,
    },
    colorGroupOverrides: {
      brown: '#ec4899',
      light_blue: '#38bdf8',
      pink: '#f472b6',
      orange: '#fb923c',
      red: '#f43f5e',
      yellow: '#fde047',
      green: '#4ade80',
      dark_blue: '#818cf8',
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

  pixel_arcade: {
    id: 'pixel_arcade',
    displayName: 'Pixel Quest 8-Bit',
    tagline: 'Insert coin. Roll the dice. Level up your empire.',
    colors: {
      boardBg: '#080714',
      boardBorder: '#6366f1',
      centerBg: '#05040f',
      centerBorder: '#312e81',
      centerPattern: 'arcade_screen',
      centerPatternColor: '#a855f7',
      uiAccent: '#a855f7',
      uiAccentAlt: '#06b6d4',
      cardAccent: '#8b5cf6',
      cardArtTint: '#130c24',
      specialBg: '#0c0a1a',
      turnGlow: '#c084fc',
    },
    assets: {
      basePath: '/themes/pixel_arcade/',
      boardCenterArt: null,
      boardOverlayArt: null,
      cardArtBasePath: null,
      tileArtBasePath: null,
    },
    colorGroupOverrides: {
      brown: '#854d0e',
      light_blue: '#38bdf8',
      pink: '#f472b6',
      orange: '#fb923c',
      red: '#ef4444',
      yellow: '#facc15',
      green: '#4ade80',
      dark_blue: '#3b82f6',
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
