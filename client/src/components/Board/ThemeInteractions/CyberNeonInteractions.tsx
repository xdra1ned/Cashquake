import React from 'react';
import { NeuralAccessTerminal } from './cyberNeon/NeuralAccessTerminal';
import { FloatingNetworkNode } from './cyberNeon/FloatingNetworkNode';
import { PatrolSurveillanceDrone } from './cyberNeon/PatrolSurveillanceDrone';
import { FirewallSecurityGate } from './cyberNeon/FirewallSecurityGate';
import { StreetDataPort } from './cyberNeon/StreetDataPort';

export const CyberNeonInteractions: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none">
      {/* ========================================================================= */}
      {/* 1. UPPER AIRSPACE ZONE: Hovering Patrol Drone                             */}
      {/* ========================================================================= */}
      <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 pointer-events-auto">
        <PatrolSurveillanceDrone />
      </div>

      {/* ========================================================================= */}
      {/* 2. LEFT BUILDING FLANK: Wall-Mounted Neural Access Terminal               */}
      {/* ========================================================================= */}
      <div className="absolute left-2 sm:left-4 top-16 sm:top-20 pointer-events-auto">
        <NeuralAccessTerminal />
      </div>

      {/* ========================================================================= */}
      {/* 3. RIGHT SKYLINE FLANK: Suspended Floating Data Conduit Node              */}
      {/* ========================================================================= */}
      <div className="absolute right-2 sm:right-4 top-16 sm:top-20 pointer-events-auto">
        <FloatingNetworkNode />
      </div>

      {/* ========================================================================= */}
      {/* 4. LOWER ROADWAY FLANKS: Ground Firewall Gate & Street Data Port          */}
      {/* ========================================================================= */}
      <div className="absolute left-2 sm:left-4 bottom-3 sm:bottom-4 pointer-events-auto">
        <FirewallSecurityGate />
      </div>

      <div className="absolute right-2 sm:right-4 bottom-3 sm:bottom-4 pointer-events-auto">
        <StreetDataPort />
      </div>
    </div>
  );
};
