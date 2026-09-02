import React from 'react';
import { BoardThemeId } from '@shared/types';
import { WorldMetropolisInteractions } from './WorldMetropolisInteractions';
import { CyberNeonInteractions } from './CyberNeonInteractions';
import { MysticFantasyInteractions } from './MysticFantasyInteractions';
import { CosmicSpaceInteractions } from './CosmicSpaceInteractions';
import { AnimeAkibaInteractions } from './AnimeAkibaInteractions';
import { FrutigerAeroInteractions } from './FrutigerAeroInteractions';

interface ThemeInteractiveLayerProps {
  themeId: BoardThemeId;
}

/**
 * Center Arena Ambient Decorative Layer.
 * Positioned as an absolute background overlay (z-0) so it never impacts
 * the vertical flex positioning of the central gameplay HUD across all 8 themes.
 */
export const ThemeInteractiveLayer: React.FC<ThemeInteractiveLayerProps> = ({ themeId }) => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {themeId === 'world_tour' && <WorldMetropolisInteractions />}
      {themeId === 'cyber_neon' && <CyberNeonInteractions />}
      {themeId === 'mystic_fantasy' && <MysticFantasyInteractions />}
      {themeId === 'cosmic_space' && <CosmicSpaceInteractions />}
      {themeId === 'anime_akiba' && <AnimeAkibaInteractions />}
      {themeId === 'frutiger_aero' && <FrutigerAeroInteractions />}
    </div>
  );
};
