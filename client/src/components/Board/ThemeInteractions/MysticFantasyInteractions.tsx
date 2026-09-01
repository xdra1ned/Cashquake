import React from 'react';
import { CelestialGrimoire } from './mysticFantasy/CelestialGrimoire';
import { WitchCauldron } from './mysticFantasy/WitchCauldron';
import { FairyGrove } from './mysticFantasy/FairyGrove';
import { CrystalOracle } from './mysticFantasy/CrystalOracle';
import { ElementalRuneStone } from './mysticFantasy/ElementalRuneStone';
import { ManaFountain } from './mysticFantasy/ManaFountain';
import { ForestWisp } from './mysticFantasy/ForestWisp';

export const MysticFantasyInteractions: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none">
      {/* ========================================================================= */}
      {/* 1. UPPER AIRSPACE: Floating Winged Fairy & Perched Dragon Familiar       */}
      {/* ========================================================================= */}
      <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 pointer-events-auto">
        <ForestWisp />
      </div>

      {/* ========================================================================= */}
      {/* 2. UPPER-LEFT GROVE: Wizard NPC & Celestial Spellbook Lectern             */}
      {/* ========================================================================= */}
      <div className="absolute left-2 sm:left-4 top-14 sm:top-18 pointer-events-auto">
        <CelestialGrimoire />
      </div>

      {/* ========================================================================= */}
      {/* 3. MID-LEFT WORKSTATION: Witch NPC & Bubbling Potion Cauldron            */}
      {/* ========================================================================= */}
      <div className="absolute left-2 sm:left-4 top-36 sm:top-40 pointer-events-auto">
        <WitchCauldron />
      </div>

      {/* ========================================================================= */}
      {/* 4. UPPER-RIGHT GROVE: Winged Fairies & Giant Blooming Magic Blossom       */}
      {/* ========================================================================= */}
      <div className="absolute right-2 sm:right-4 top-14 sm:top-18 pointer-events-auto">
        <FairyGrove />
      </div>

      {/* ========================================================================= */}
      {/* 5. MID-RIGHT SHRINE: Fortune-Teller's Crystal Oracle                      */}
      {/* ========================================================================= */}
      <div className="absolute right-2 sm:right-4 top-36 sm:top-40 pointer-events-auto">
        <CrystalOracle />
      </div>

      {/* ========================================================================= */}
      {/* 6. LOWER FOREST FLOOR: Mossy Elemental Monolith & Forest Spring Pool      */}
      {/* ========================================================================= */}
      <div className="absolute left-2 sm:left-4 bottom-3 sm:bottom-4 pointer-events-auto">
        <ElementalRuneStone />
      </div>

      <div className="absolute right-2 sm:right-4 bottom-3 sm:bottom-4 pointer-events-auto">
        <ManaFountain />
      </div>
    </div>
  );
};
