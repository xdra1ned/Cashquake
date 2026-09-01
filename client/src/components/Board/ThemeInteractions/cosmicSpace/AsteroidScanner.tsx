import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

const ASTEROID_READOUTS = [
  'MINERAL: FERROUS-SILICATE',
  'TRAJECTORY: NON-THREATENING',
  'DENSITY: 3.4 g/cm³ // PLATINUM-RICH',
  'MASS: 1.2e8 TONS // STABLE',
  'DEFLECTION ROUTE // CLEAR',
];

export const AsteroidScanner: React.FC = () => {
  const { playAsteroidScanSound } = useAudio();
  const [isScanning, setIsScanning] = useState(false);
  const [readout, setReadout] = useState<string | null>(null);

  const handleScan = () => {
    playAsteroidScanSound();
    setIsScanning(true);

    const nextReadout = ASTEROID_READOUTS[Math.floor(Math.random() * ASTEROID_READOUTS.length)];
    setReadout(nextReadout);

    setTimeout(() => {
      setIsScanning(false);
    }, 1000);

    setTimeout(() => {
      setReadout(null);
    }, 4200);
  };

  return (
    <div className="relative group cursor-pointer select-none" onClick={handleScan} title="Perimeter Asteroid Scanner — Click to sweep radar and analyze mineral content">
      <div className="relative w-22 h-20 sm:w-26 sm:h-22 flex items-center justify-center">
        {/* Physical Scanning Apparatus Chassis */}
        <div className="relative w-16 h-14 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-700 shadow-xl flex items-center justify-center p-1 overflow-hidden">
          {/* Radar Screen Grid Display */}
          <div className="relative w-12 h-12 rounded-full bg-slate-950 border border-emerald-500/40 flex items-center justify-center overflow-hidden">
            {/* Concentric Range Rings */}
            <div className="absolute w-8 h-8 rounded-full border border-emerald-500/30" />
            <div className="absolute w-4 h-4 rounded-full border border-emerald-500/40" />

            {/* Simulated Asteroid Blips */}
            <div className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full bg-emerald-400" />
            <div className="absolute top-4 left-3 w-1.5 h-1 rounded-full bg-slate-400" />

            {/* Radar Conical Sweep Line */}
            <div
              className={`absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-400/20 to-emerald-400/50 rounded-full origin-center ${
                isScanning ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '0.9s' }}
            />
          </div>
        </div>

        {/* Scan Readout Pill */}
        {readout && (
          <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-950/95 border border-emerald-400/90 text-[9px] font-mono font-bold text-emerald-300 shadow-2xl z-50 animate-fade-in pointer-events-none backdrop-blur-md">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping" />
            <span>{readout}</span>
          </div>
        )}
      </div>

      {/* Station Stencil */}
      <div className="text-center mt-[-4px]">
        <span className="text-[8px] font-mono font-bold tracking-wider text-slate-400 group-hover:text-emerald-300 transition-colors uppercase">
          ☄️ ASTEROID SCANNER
        </span>
      </div>
    </div>
  );
};
