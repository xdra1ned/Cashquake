import React from 'react';
import { CityFinancialTerminal } from './worldMetropolis/CityFinancialTerminal';
import { DigitalBillboard } from './worldMetropolis/DigitalBillboard';
import { TrafficSignal } from './worldMetropolis/TrafficSignal';
import { MetroStation } from './worldMetropolis/MetroStation';
import { RooftopHelipad } from './worldMetropolis/RooftopHelipad';

export const WorldMetropolisInteractions: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0">
      {/* 1. UPPER-LEFT SKYLINE: Rooftop Helipad */}
      <div className="absolute top-16 sm:top-18 left-2 sm:left-4 pointer-events-none z-10">
        <RooftopHelipad />
      </div>

      {/* 2. UPPER-RIGHT SKYLINE: Digital Billboard */}
      <div className="absolute top-16 sm:top-18 right-2 sm:right-4 pointer-events-none z-10">
        <DigitalBillboard />
      </div>

      {/* 3. MID-LEFT FLANK: City Financial Terminal */}
      <div className="absolute top-[38%] left-2 sm:left-4 pointer-events-none z-10">
        <CityFinancialTerminal />
      </div>

      {/* 4. MID-RIGHT FLANK: Metropolitan Traffic Signal */}
      <div className="absolute top-[38%] right-2 sm:right-4 pointer-events-none z-10">
        <TrafficSignal />
      </div>

      {/* 5. LOWER-LEFT SIDEWALK: Metro Station Entrance */}
      <div className="absolute bottom-3 left-2 sm:left-5 pointer-events-none z-10">
        <MetroStation />
      </div>
    </div>
  );
};
