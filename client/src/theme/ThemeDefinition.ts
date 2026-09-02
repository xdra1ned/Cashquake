import type { BoardThemeId, ColorGroup } from '@shared/types';

/**
 * Which programmatic pattern to draw in the board's center arena.
 * These are rendered via CSS/SVG — no image files required.
 * When real board art is available, set `assets.boardCenterArt` to a path
 * and the programmatic pattern will be replaced.
 */
export type CenterPatternId =
  | 'compass'             // Legacy compass rose
  | 'metropolis_skyline'  // World Metropolis — Central City Plaza, Cashquake Tower & Skyline
  | 'circuit'             // Cyber Neon — circuit board trace lines
  | 'mandala'             // Mystic Fantasy — geometric rune/mandala
  | 'constellation'       // Cosmic Space — star field with constellation lines
  | 'blossom'             // Anime Akiba — petal geometry
  | 'akiba_district'      // Anime Akiba — dense anime streetscape, elevated Yamanote rail & neon storefronts
  | 'roulette'            // Casino Royale — illuminated roulette wheel & card filigree
  | 'arcade_screen'       // Pixel Quest — retro arcade screen, pixel starfield & coin banner
  | 'aero_eco';           // Frutiger Aero — concentric aqua glass rings, eco droplet & cloud motif

export interface ThemeColorPalette {
  /** Board outer background (behind tiles) */
  boardBg: string;
  /** Board outer border */
  boardBorder: string;
  /** Center arena background */
  centerBg: string;
  /** Center arena border */
  centerBorder: string;
  /** Decorative center pattern variant */
  centerPattern: CenterPatternId;
  /** Center pattern stroke/fill color */
  centerPatternColor: string;
  /** Primary UI accent (buttons, highlights, active states) */
  uiAccent: string;
  /** Secondary UI accent */
  uiAccentAlt: string;
  /** Card frame primary color */
  cardAccent: string;
  /** Card frame secondary / artwork area tint */
  cardArtTint: string;
  /** Special space (prison, vacation, etc.) background tint */
  specialBg: string;
  /** Turn indicator glow color */
  turnGlow: string;

  // --- Phase 2 Full-Page Semantic Design Tokens ---
  /** Application page background CSS gradient or solid color */
  pageBgGradient: string;
  /** Primary UI panel surface (Standings, Chat, Activity Log, HUD) */
  surfacePrimary: string;
  /** Elevated UI surface (Cards, Modals, Dropdowns) */
  surfaceElevated: string;
  /** Muted UI sub-surface / section header */
  surfaceMuted: string;
  /** Panel border CSS color */
  panelBorder: string;
  /** Primary text color (high-contrast body text) */
  textPrimary: string;
  /** Secondary text color (metadata, timestamps) */
  textSecondary: string;
  /** Text accent highlight color */
  textAccent: string;
  /** Primary action button background */
  btnPrimaryBg: string;
  /** Primary action button hover state background */
  btnPrimaryHover: string;
  /** Primary action button text color */
  btnPrimaryText: string;
  /** Primary action button border color */
  btnPrimaryBorder: string;
  /** Secondary button background */
  btnSecondaryBg: string;
  /** Secondary button hover background */
  btnSecondaryHover: string;
  /** Secondary button text color */
  btnSecondaryText: string;
  /** Secondary button border color */
  btnSecondaryBorder: string;
  /** Status badge background */
  badgeBg: string;
  /** Status badge border */
  badgeBorder: string;
  /** Status badge text color */
  badgeText: string;
  /** Visual atmosphere type for Layer 1 Page Environment */
  atmosphericId: 'stars_nebula' | 'cyber_grid' | 'velvet_lounge' | 'arcade_crt' | 'city_skyline' | 'mystic_runes' | 'neon_akiba' | 'aero_eco';
}

/**
 * Asset slot paths for this theme.
 *
 * Files should be placed at the specified paths by the creator.
 * When a path is `null`, the game renders a programmatic placeholder.
 *
 * All paths are relative to `client/public/`.
 * Example: `/assets/themes/world_tour/board-center.svg`
 */
export interface ThemeAssetPaths {
  /** Base directory for this theme */
  basePath: string;
  /**
   * Board center artwork (SVG or image).
   * null → renders programmatic `centerPattern` instead.
   */
  boardCenterArt: string | null;
  /**
   * Full board overlay artwork (tiled pattern or full board art).
   * null → no board overlay.
   */
  boardOverlayArt: string | null;
  /**
   * Card artwork base path. Cards look for:
   *   `{cardArtBasePath}/chance_{id}.svg` or `fortune_{id}.svg`
   * null → renders geometric card placeholder.
   */
  cardArtBasePath: string | null;
  /**
   * Tile art base path. Tiles look for:
   *   `{tileArtBasePath}/tile_{index}.svg`
   * null → renders styled tile placeholder.
   */
  tileArtBasePath: string | null;
}

export interface ThemeDefinition {
  id: BoardThemeId;
  displayName: string;
  tagline: string;
  colors: ThemeColorPalette;
  assets: ThemeAssetPaths;
  /**
   * Per-theme overrides for color group hex codes.
   * If not specified, uses global COLOR_GROUP_HEX from constants.
   */
  colorGroupOverrides?: Partial<Record<ColorGroup, string>>;
}
