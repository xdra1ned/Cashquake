import type { BoardThemeId, ColorGroup } from '@shared/types';

/**
 * Which programmatic pattern to draw in the board's center arena.
 * These are rendered via CSS/SVG — no image files required.
 * When real board art is available, set `assets.boardCenterArt` to a path
 * and the programmatic pattern will be replaced.
 */
export type CenterPatternId =
  | 'compass'         // World Metropolis — geometric compass rose
  | 'circuit'         // Cyber Neon — circuit board trace lines
  | 'mandala'         // Mystic Fantasy — geometric rune/mandala
  | 'constellation'   // Cosmic Space — star field with constellation lines
  | 'blossom'         // Anime Akiba — petal geometry
  | 'roulette';       // Casino Royale — illuminated roulette wheel & card filigree

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
