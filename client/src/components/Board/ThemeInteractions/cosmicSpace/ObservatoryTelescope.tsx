import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

const OBSERVATION_DISCOVERIES = [
  'JUPITER-CLASS GAS GIANT',
  'ASTEROID FIELD — SECTOR 7',
  'DISTANT NEBULA OBSERVED',
  'COMET TRAJECTORY CONFIRMED',
  'DEEP SPACE SIGNAL — WEAK',
  'PULSAR ROTATION DETECTED',
];

export const ObservatoryTelescope: React.FC = () => {
  const { playTelescopeScanSound } = useAudio();
  const [rotationAngle, setRotationAngle] = useState(-15);
  const [isScanning, setIsScanning] = useState(false);
  const [discovery, setDiscovery] = useState<string | null>(null);

  const handleObserve = () => {
    playTelescopeScanSound();
    setIsScanning(true);
    
    // Rotate telescope to new angle
    const angles = [-35, -20, 0, 20, 35];
    const nextAngle = angles[Math.floor(Math.random() * angles.length)];
    setRotationAngle(nextAngle);

    const nextDiscovery = OBSERVATION_DISCOVERIES[Math.floor(Math.random() * OBSERVATION_DISCOVERIES.length)];
    setDiscovery(nextDiscovery);

    setTimeout(() => {
      setIsScanning(false);
    }, 1200);

    setTimeout(() => {
      setDiscovery(null);
    }, 4500);
  };

  return (
    <div className="relative group cursor-pointer select-none" onClick={handleObserve} title="Orbital Observatory Telescope — Click to swivel and scan deep space">
      {/* Physical Swivel Base & Telescope Turret */}
      <div className="relative w-24 h-20 sm:w-28 sm:h-24 flex items-center justify-center">
        {/* Exterior Swivel Cupola Platform Base */}
        <div className="absolute bottom-1 w-16 h-5 rounded-full bg-slate-900 border border-slate-700 shadow-lg flex items-center justify-center">
          <div className="w-12 h-2 rounded-full bg-slate-800 border border-cyan-500/40" />
          <div className="absolute -bottom-0.5 w-2 h-1 bg-cyan-400 rounded-full animate-ping opacity-60" />
        </div>

        {/* Optical Telescope Barrel with Swivel Rotation */}
        <div
          className="relative flex items-center transition-transform duration-700 ease-out origin-bottom"
          style={{ transform: `rotate(${rotationAngle}deg) translateY(-8px)` }}
        >
          {/* Main Carbon-Titanium Barrel */}
          <div className="relative w-14 sm:w-16 h-5 sm:h-6 rounded-r-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 border border-cyan-400/60 shadow-xl flex items-center justify-between px-1">
            {/* Eyepiece mount */}
            <div className="w-2.5 h-4 bg-slate-950 border border-slate-700 rounded-l" />
            
            {/* Structural Gold Heat-Shield Band */}
            <div className="w-2 h-full bg-amber-500/80 rounded-sm" />

            {/* Front Optical Lens with Glowing Blue Coating */}
            <div className={`w-3.5 h-4.5 rounded-r-full bg-gradient-to-r from-cyan-500 to-blue-300 shadow-lg transition-all ${isScanning ? 'ring-4 ring-cyan-400 animate-pulse' : ''}`}>
              <div className="w-1 h-2 bg-white rounded-full opacity-80 mt-1 ml-0.5" />
            </div>
          </div>

          {/* Optical Scanning Beam Laser when active */}
          {isScanning && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 w-36 h-2 bg-gradient-to-r from-cyan-400 via-sky-300 to-transparent opacity-90 blur-[1px] pointer-events-none animate-pulse" />
          )}
        </div>

        {/* Observation Tag / HUD Discovery Pill */}
        {discovery && (
          <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-950/95 border border-cyan-400/90 text-[9px] font-mono font-black text-cyan-300 shadow-2xl z-50 animate-fade-in pointer-events-none backdrop-blur-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>{discovery}</span>
          </div>
        )}
      </div>

      {/* Diegetic Station Stencil Label */}
      <div className="text-center mt-[-4px]">
        <span className="text-[8px] font-mono font-bold tracking-wider text-slate-400 group-hover:text-cyan-300 transition-colors uppercase">
          🔭 OBS-01 TELESCOPE
        </span>
      </div>
    </div>
  );
};
