import React, { useState } from 'react';
import { useAudio } from '../../../../context/AudioContext';

const COMM_MESSAGES = [
  'DEEP SPACE RELAY CONNECTED',
  'SIGNAL RECEIVED — SECTOR 04',
  'INTERPLANETARY COMM: ACTIVE',
  'TELEMETRY SYNC // OK',
  'BEACON PING: 4.2 AU',
];

export const SatelliteDish: React.FC = () => {
  const { playSatelliteRelaySound } = useAudio();
  const [dishAngle, setDishAngle] = useState(25);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [commStatus, setCommStatus] = useState<string | null>(null);

  const handleTransmit = () => {
    playSatelliteRelaySound();
    setIsTransmitting(true);

    const angles = [-20, 0, 25, 45];
    const nextAngle = angles[Math.floor(Math.random() * angles.length)];
    setDishAngle(nextAngle);

    const nextMsg = COMM_MESSAGES[Math.floor(Math.random() * COMM_MESSAGES.length)];
    setCommStatus(nextMsg);

    setTimeout(() => {
      setIsTransmitting(false);
    }, 1000);

    setTimeout(() => {
      setCommStatus(null);
    }, 4000);
  };

  return (
    <div className="relative group cursor-pointer select-none" onClick={handleTransmit} title="High-Gain Satellite Relay — Click to rotate and beam telemetry">
      <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center">
        {/* Exterior Boom Truss Base */}
        <div className="absolute bottom-1 w-8 h-5 border-l-2 border-r-2 border-slate-700 flex flex-col justify-between items-center opacity-80">
          <div className="w-6 h-0.5 bg-slate-600" />
          <div className="w-4 h-0.5 bg-slate-600" />
        </div>

        {/* Rotatable Parabolic Dish Assembly */}
        <div
          className="relative transition-transform duration-600 ease-out origin-center"
          style={{ transform: `rotate(${dishAngle}deg)` }}
        >
          {/* Parabolic Carbon Dish Bowl */}
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border-2 border-slate-600 shadow-xl flex items-center justify-center overflow-hidden">
            {/* Grid Pattern inside Dish */}
            <div className="w-7 h-7 rounded-full border border-sky-400/30 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full border border-sky-400/40" />
            </div>

            {/* Central Feed Horn Subreflector */}
            <div className="absolute w-1.5 h-4 bg-gradient-to-t from-slate-900 to-sky-400 rounded-sm shadow-md" />
            <div className={`absolute -top-0.5 w-1.5 h-1.5 rounded-full bg-sky-300 ${isTransmitting ? 'ring-4 ring-sky-400 animate-ping' : ''}`} />
          </div>

          {/* Radiating Transmission Waves when transmitting */}
          {isTransmitting && (
            <>
              <div className="absolute -inset-2 rounded-full border border-sky-400/80 animate-ping pointer-events-none" />
              <div className="absolute -inset-4 rounded-full border border-cyan-300/40 animate-pulse pointer-events-none" />
            </>
          )}
        </div>
      </div>

      {/* Station Stencil */}
      <div className="text-center mt-[-2px]">
        <span className="text-[8px] font-mono font-bold tracking-wider text-slate-400 group-hover:text-sky-300 transition-colors uppercase">
          🛰️ COMMS RELAY
        </span>
      </div>

      {/* Transmission Status Pill (Anchored below, 100% visible and unclipped) */}
      {commStatus && (
        <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-950/95 border border-sky-400/90 text-[9px] font-mono font-bold text-sky-300 shadow-2xl z-50 animate-fade-in pointer-events-none backdrop-blur-md">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 mr-1 animate-pulse" />
          <span>{commStatus}</span>
        </div>
      )}
    </div>
  );
};
