import React from 'react';
import { AnimeBillboard } from './animeAkiba/AnimeBillboard';
import { GachaponMachine } from './animeAkiba/GachaponMachine';
import { ArcadeCabinet } from './animeAkiba/ArcadeCabinet';
import { MaidCafe } from './animeAkiba/MaidCafe';
import { AnimeVendingMachine } from './animeAkiba/AnimeVendingMachine';
import { TrainPlatform } from './animeAkiba/TrainPlatform';
import { MascotCharacter } from './animeAkiba/MascotCharacter';

export const AnimeAkibaInteractions: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20">
      {/* 1. UPPER-LEFT ROOFTOP: Giant Animated Anime Billboard (Positioned cleanly below Round Number UI) */}
      <div className="absolute top-16 sm:top-18 left-2 sm:left-4 pointer-events-auto z-30">
        <AnimeBillboard />
      </div>

      {/* 2. UPPER-RIGHT VIADUCT: Yamanote Rail Train Station Platform (Positioned cleanly clear of Vacation Pot and Vacation Tile) */}
      <div className="absolute top-16 sm:top-18 right-2 sm:right-4 pointer-events-auto z-30">
        <TrainPlatform />
      </div>

      {/* 3. MID-LEFT STOREFRONT: Japanese Candy Cab Arcade Machine */}
      <div className="absolute top-[38%] left-2 sm:left-4 pointer-events-auto z-25">
        <ArcadeCabinet />
      </div>

      {/* 4. MID-RIGHT STOREFRONT: Moonlight Maid Café Facade */}
      <div className="absolute top-[38%] right-2 sm:right-4 pointer-events-auto z-25">
        <MaidCafe />
      </div>

      {/* 5. LOWER-LEFT SIDEWALK: Double-Decker Capsule Toy Gachapon Machine */}
      <div className="absolute bottom-3 left-2 sm:left-5 pointer-events-auto z-25">
        <GachaponMachine />
      </div>

      {/* 6. LOWER-RIGHT SIDEWALK: Japanese Drink Vending Machine */}
      <div className="absolute bottom-3 right-2 sm:right-5 pointer-events-auto z-25">
        <AnimeVendingMachine />
      </div>

      {/* 7. STREET LEVEL AMBIENT MASCOT: Kira-chan the Chibi District Mascot */}
      <div className="absolute bottom-2 left-[36%] sm:left-[38%] pointer-events-auto z-25">
        <MascotCharacter />
      </div>
    </div>
  );
};
