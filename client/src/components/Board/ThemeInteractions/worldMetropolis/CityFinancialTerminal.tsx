import React, { useState, useEffect } from 'react';
import { useAudio } from '../../../../context/AudioContext';

interface SectorReport {
  id: string;
  category: string;
  title: string;
  desc: string;
  metric: string;
  sentiment: 'BULLISH' | 'EXPANDING' | 'STABLE' | 'OPTIMAL';
  points: string;
}

const SECTOR_REPORTS: SectorReport[] = [
  {
    id: 'realty',
    category: 'REAL ESTATE INDEX',
    title: 'PRIME METROPOLITAN HOUSING SURGE',
    desc: 'High-rise residential and luxury penthouse developments across Central District are experiencing unprecedented acquisition demand.',
    metric: '+4.8% VALUATION',
    sentiment: 'BULLISH',
    points: '0,28 10,22 20,24 30,14 40,16 50,8 60,10 70,4 80,6',
  },
  {
    id: 'commercial',
    category: 'COMMERCIAL SECTOR',
    title: 'FINANCIAL DISTRICT OFFICE ABSORPTION',
    desc: 'Grade-A corporate towers and banking headquarters are operating at 97.2% capacity with strong long-term institutional tenancy.',
    metric: '97.2% OCCUPANCY',
    sentiment: 'EXPANDING',
    points: '0,24 10,20 20,18 30,22 40,14 50,12 60,8 70,10 80,4',
  },
  {
    id: 'transit',
    category: 'MUNICIPAL TRANSIT',
    title: 'METROLINE NETWORK EXPANSION',
    desc: 'Intercity high-speed rail and underground lines recorded 2.4M daily passenger transfers. All 4 major transit hubs running on schedule.',
    metric: '99.4% ON-TIME',
    sentiment: 'OPTIMAL',
    points: '0,20 10,18 20,16 30,16 40,12 50,14 60,10 70,8 80,6',
  },
  {
    id: 'treasury',
    category: 'MUNICIPAL TREASURY',
    title: 'CITY REVENUE & CAPITAL RESERVES',
    desc: 'Municipal liquidity reserves and infrastructure funding exceed annual benchmarks. Tax revenue allocation operating at AAA credit rating.',
    metric: '$1.4B SURPLUS',
    sentiment: 'STABLE',
    points: '0,26 10,24 20,20 30,18 40,20 50,14 60,12 70,8 80,4',
  },
];

export const CityFinancialTerminal: React.FC = () => {
  const audio = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleOpenTerminal = () => {
    audio.playCityTerminalSound();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Keyboard Escape listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const report = SECTOR_REPORTS[activeTab];

  return (
    <>
      {/* Interactive Kiosk Unit Button */}
      <button
        type="button"
        onClick={handleOpenTerminal}
        className="group relative flex flex-col items-center p-1.5 rounded-xl bg-slate-950/80 border border-slate-700/70 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-200 cursor-pointer backdrop-blur-md"
        title="CITY MARKET TERMINAL — Click to inspect live financial market telemetry"
      >
        {/* Terminal Screen Glass */}
        <div className="w-12 h-9 sm:w-14 sm:h-10 rounded-lg bg-[#040810] border border-cyan-500/40 p-1 flex flex-col justify-between relative overflow-hidden group-hover:border-cyan-400">
          {/* Scanline overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-black/40 pointer-events-none" />

          {/* Top Ticker Header */}
          <div className="flex items-center justify-between z-10">
            <span className="text-[6.5px] sm:text-[7px] font-mono font-black text-cyan-300 tracking-wider">
              CQ:MKT
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Mini Real-Time SVG Chart */}
          <svg viewBox="0 0 40 16" className="w-full h-4 z-10" fill="none">
            <polyline
              points="0,14 8,11 16,13 24,7 32,9 40,3"
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="0,14 8,11 16,13 24,7 32,9 40,3 40,16 0,16"
              fill="#38BDF8"
              fillOpacity="0.2"
            />
          </svg>

          {/* Bottom Live Value */}
          <div className="text-[6px] sm:text-[6.5px] font-mono text-emerald-300 font-bold flex items-center justify-between z-10 leading-none">
            <span>▲ +4.8%</span>
            <span className="text-slate-400 text-[5.5px]">LIVE</span>
          </div>
        </div>

        {/* Steel Kiosk Stand */}
        <div className="w-3 h-1.5 bg-slate-700 rounded-b-sm border-t border-slate-600 mt-0.5" />
        <div className="w-6 h-1 bg-slate-800 rounded-full border border-slate-700 shadow-sm" />

        {/* Floating Discover Indicator */}
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400/80 animate-ping pointer-events-none" />
      </button>

      {/* Full Self-Contained Modal Overlay (Above all Board Layers & Fully Responsive) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-slate-950/98 border-2 border-cyan-400 shadow-2xl shadow-cyan-500/25 p-4 sm:p-6 text-slate-100 flex flex-col gap-3 sm:gap-4 animate-in zoom-in-95 duration-150 pointer-events-auto max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
                <div>
                  <h3 className="text-sm sm:text-base font-mono font-black text-cyan-300 tracking-wider uppercase leading-none">
                    CITY FINANCIAL MARKET TERMINAL
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    METROPOLITAN REAL ESTATE & CAPITAL EXCHANGE • LIVE TELEMETRY
                  </div>
                </div>
              </div>

              {/* Prominent Dismiss Button */}
              <button
                type="button"
                onClick={handleClose}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                title="Close Terminal (Esc)"
              >
                <span className="text-sm leading-none">✕</span>
                <span>Close</span>
              </button>
            </div>

            {/* Sector Tab Navigation */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {SECTOR_REPORTS.map((sec, idx) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    audio.playBillboardClick();
                    setActiveTab(idx);
                  }}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    activeTab === idx
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/20 text-cyan-200'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="text-[8px] font-mono uppercase font-bold tracking-wider truncate">
                    {sec.category}
                  </span>
                  <span className="text-[10px] font-black text-slate-200 mt-1 font-mono">
                    {sec.metric}
                  </span>
                </button>
              ))}
            </div>

            {/* Detailed Sector Readout */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                    {report.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-amber-300 font-display mt-0.5">
                    {report.title}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[9px] font-black">
                    {report.sentiment}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {report.desc}
              </p>

              {/* Dynamic SVG Telemetry Curve */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-1">
                  <span>METRO INDEX 24H TREND</span>
                  <span className="text-emerald-400 font-bold">{report.metric}</span>
                </div>
                <svg viewBox="0 0 80 32" className="w-full h-12 rounded-lg bg-slate-950/80 border border-slate-800/80 p-1" fill="none">
                  <polyline
                    points={report.points}
                    stroke="#38BDF8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points={`${report.points} 80,32 0,32`}
                    fill="#38BDF8"
                    fillOpacity="0.15"
                  />
                </svg>
              </div>
            </div>

            {/* Cosmetic Informational Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-1 text-[9px] font-mono text-slate-500 pt-1 border-t border-slate-900">
              <span>*Atmospheric city market telemetry. Purely cosmetic.</span>
              <span className="text-cyan-400 font-bold">TERMINAL ID: CQ-METRO-01</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
