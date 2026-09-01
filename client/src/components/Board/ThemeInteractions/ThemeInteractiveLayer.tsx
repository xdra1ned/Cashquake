import React from 'react';
import { BoardThemeId } from '@shared/types';
import { WorldMetropolisInteractions } from './WorldMetropolisInteractions';
import { CyberNeonInteractions } from './CyberNeonInteractions';
import { MysticFantasyInteractions } from './MysticFantasyInteractions';
import { CosmicSpaceInteractions } from './CosmicSpaceInteractions';
import { AnimeAkibaInteractions } from './AnimeAkibaInteractions';

interface ThemeInteractiveLayerProps {
  themeId: BoardThemeId;
}

export const ThemeInteractiveLayer: React.FC<ThemeInteractiveLayerProps> = ({ themeId }) => {
  if (themeId === 'world_tour') {
    return (
      <div className="w-full flex justify-center py-1 z-15">
        <WorldMetropolisInteractions />
      </div>
    );
  }

  if (themeId === 'cyber_neon') {
    return <CyberNeonInteractions />;
  }

  if (themeId === 'mystic_fantasy') {
    return <MysticFantasyInteractions />;
  }

  if (themeId === 'cosmic_space') {
    return <CosmicSpaceInteractions />;
  }

  if (themeId === 'anime_akiba') {
    return <AnimeAkibaInteractions />;
  }

  return null;
};
