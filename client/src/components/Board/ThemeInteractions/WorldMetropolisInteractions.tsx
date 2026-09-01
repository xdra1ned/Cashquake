import React from 'react';
import { CityFinancialTerminal } from './worldMetropolis/CityFinancialTerminal';
import { DigitalBillboard } from './worldMetropolis/DigitalBillboard';
import { TrafficSignal } from './worldMetropolis/TrafficSignal';
import { MetroStation } from './worldMetropolis/MetroStation';
import { RooftopHelipad } from './worldMetropolis/RooftopHelipad';

export const WorldMetropolisInteractions: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 z-20 pointer-events-auto bg-slate-950/40 p-1.5 rounded-2xl border border-slate-700/40 backdrop-blur-xs shadow-lg">
      <CityFinancialTerminal />
      <DigitalBillboard />
      <TrafficSignal />
      <MetroStation />
      <RooftopHelipad />
    </div>
  );
};
