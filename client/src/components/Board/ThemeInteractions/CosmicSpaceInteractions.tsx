import React from 'react';
import { ObservatoryTelescope } from './cosmicSpace/ObservatoryTelescope';
import { SatelliteDish } from './cosmicSpace/SatelliteDish';
import { DockingBay } from './cosmicSpace/DockingBay';
import { AstronautExplorer } from './cosmicSpace/AstronautExplorer';
import { PlanetariumHologram } from './cosmicSpace/PlanetariumHologram';
import { AsteroidScanner } from './cosmicSpace/AsteroidScanner';

export const CosmicSpaceInteractions: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20">
      {/* 1. UPPER-LEFT VOID: Tethered Spacewalk Astronaut Explorer (Clear of Theme Title) */}
      <div className="absolute top-11 left-3 sm:left-6 pointer-events-auto z-30">
        <AstronautExplorer />
      </div>

      {/* 2. UPPER-RIGHT FLANK: High-Gain Satellite Communications Relay (Clear of Planet & Vacation Space) */}
      <div className="absolute top-11 right-5 sm:right-7 pointer-events-auto z-30">
        <SatelliteDish />
      </div>

      {/* 3. LEFT CUPOLA TURRET: Orbital Astronomical Observatory Telescope */}
      <div className="absolute top-[28%] left-2 sm:left-4 pointer-events-auto z-25">
        <ObservatoryTelescope />
      </div>

      {/* 4. RIGHT DOCKING ARM: Spacecraft Docking Bay 07 with Shuttle */}
      <div className="absolute top-[32%] right-2 sm:right-4 pointer-events-auto z-25">
        <DockingBay />
      </div>

      {/* 5. LOWER-LEFT CONSOLE: Holographic Star Chart Astrolabe Projector */}
      <div className="absolute bottom-3 left-2 sm:left-5 pointer-events-auto z-25">
        <PlanetariumHologram />
      </div>

      {/* 6. LOWER-RIGHT RADAR: Perimeter Deep-Space Asteroid Scanner */}
      <div className="absolute bottom-3 right-2 sm:right-5 pointer-events-auto z-25">
        <AsteroidScanner />
      </div>
    </div>
  );
};
