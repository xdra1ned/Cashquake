import React, { useState, useEffect } from 'react';
import { useAudio } from '../../../../context/AudioContext';

interface CyberSectorReport {
  id: string;
  category: string;
  title: string;
  desc: string;
  metric: string;
  status: 'ONLINE' | 'ACTIVE' | 'OPTIMAL' | 'SECURE';
  nodes: { x: number; y: number; label: string }[];
}

const CYBER_REPORTS: CyberSectorReport[] = [
  {
    id: 'mainframe',
    category: 'CITY MAINFRAME',
    title: 'NEURAL CORE INTEGRATION',
    desc: 'Metropolitan AI neural core operating at 99.98% synchronization. Real-time traffic routing and grid load auto-balancing active.',
    metric: '99.98% SYNC',
    status: 'ONLINE',
    nodes: [
      { x: 15, y: 20, label: 'CORE-01' },
      { x: 40, y: 10, label: 'HUB-A' },
      { x: 65, y: 22, label: 'RELAY' },
      { x: 85, y: 12, label: 'GATEWAY' },
    ],
  },
  {
    id: 'security',
    category: 'CYBER SECURITY',
    title: 'QUANTUM ENCRYPTION SHIELD',
    desc: 'Municipal firewall integrity optimal. 256-qubit lattice encryption active across all corporate finance nodes and property registries.',
    metric: '256-Q SHIELD',
    status: 'SECURE',
    nodes: [
      { x: 15, y: 15, label: 'FW-01' },
      { x: 38, y: 25, label: 'QUANTUM' },
      { x: 60, y: 12, label: 'CIPHER' },
      { x: 85, y: 18, label: 'SHIELD' },
    ],
  },
  {
    id: 'transit',
    category: 'AUTONOMOUS TRANSIT',
    title: 'MAGLEV GRID TELEMETRY',
    desc: 'Autonomous elevated monorail network and sky-transit pods operating on automated collision avoidance with zero network latency.',
    metric: '0.4MS LATENCY',
    status: 'OPTIMAL',
    nodes: [
      { x: 15, y: 22, label: 'RAIL-A' },
      { x: 42, y: 14, label: 'MAGLEV' },
      { x: 68, y: 24, label: 'POD-7' },
      { x: 85, y: 10, label: 'DEPOT' },
    ],
  },
  {
    id: 'energy',
    category: 'QUANTUM ENERGY',
    title: 'FUSION PLASMA GRID',
    desc: 'Sub-city fusion reactors delivering 4.2 Terawatts to metropolitan skyline, commercial arcologies, and public illumination matrices.',
    metric: '4.2 TW CAPACITY',
    status: 'ACTIVE',
    nodes: [
      { x: 15, y: 12, label: 'FUSION-1' },
      { x: 35, y: 24, label: 'REACTOR' },
      { x: 62, y: 10, label: 'PLASMA' },
      { x: 85, y: 22, label: 'GRID-09' },
    ],
  },
];

export const NeuralCityTerminal: React.FC = () => {
  const audio = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleOpenTerminal = () => {
    audio.playCyberTerminalSound();
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

  const report = CYBER_REPORTS[activeTab];

  return (
    <>
      {/* Interactive Neural Kiosk Button */}
      <button
        type="button"
        onClick={handleOpenTerminal}
        className="group relative flex flex-col items-center p-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/50 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-200 cursor-pointer backdrop-blur-md"
        title="NEURAL CITY TERMINAL — Click to inspect live megacity neural network telemetry"
      >
        {/* Terminal Screen Glass */}
        <div className="w-12 h-9 sm:w-14 sm:h-10 rounded-lg bg-[#020612] border border-cyan-400/60 p-1 flex flex-col justify-between relative overflow-hidden group-hover:border-cyan-300">
          {/* Scanline overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/10 via-transparent to-black/50 pointer-events-none" />

          {/* Top Ticker Header */}
          <div className="flex items-center justify-between z-10">
            <span className="text-[6.5px] sm:text-[7px] font-mono font-black text-cyan-300 tracking-wider">
              SYS:2099
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
          </div>

          {/* Mini Real-Time SVG Neural Circuit */}
          <svg viewBox="0 0 40 16" className="w-full h-4 z-10" fill="none">
            <path
              d="M 4 12 L 14 6 L 26 10 L 36 4"
              stroke="#00F0FF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="4" cy="12" r="1.5" fill="#F43F5E" />
            <circle cx="14" cy="6" r="1.5" fill="#00F0FF" />
            <circle cx="26" cy="10" r="1.5" fill="#A855F7" />
            <circle cx="36" cy="4" r="2" fill="#FDE047" />
          </svg>

          {/* Bottom Live Value */}
          <div className="text-[6px] sm:text-[6.5px] font-mono text-cyan-300 font-bold flex items-center justify-between z-10 leading-none">
            <span>99.98%</span>
            <span className="text-purple-400 text-[5.5px]">SYNC</span>
          </div>
        </div>

        {/* Steel Kiosk Stand */}
        <div className="w-3 h-1.5 bg-slate-800 rounded-b-sm border-t border-slate-700 mt-0.5" />
        <div className="w-6 h-1 bg-slate-900 rounded-full border border-cyan-500/40 shadow-sm" />

        {/* Floating Discover Indicator */}
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping pointer-events-none" />
      </button>

      {/* Full Self-Contained Modal Overlay (Above all Board Layers & Fully Responsive) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-slate-950/98 border-2 border-cyan-400 shadow-2xl shadow-cyan-500/30 p-4 sm:p-6 text-slate-100 flex flex-col gap-3 sm:gap-4 animate-in zoom-in-95 duration-150 pointer-events-auto max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-cyan-900/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
                <div>
                  <h3 className="text-sm sm:text-base font-mono font-black text-cyan-300 tracking-wider uppercase leading-none">
                    NEURAL CITY TERMINAL 2099
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    METROPOLITAN DIGITAL INFRASTRUCTURE • LIVE SYSTEM DIAGNOSTICS
                  </div>
                </div>
              </div>

              {/* Prominent Dismiss Button */}
              <button
                type="button"
                onClick={handleClose}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 border border-cyan-500/50 hover:border-cyan-400 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                title="Close Terminal (Esc)"
              >
                <span className="text-sm leading-none">✕</span>
                <span>Close</span>
              </button>
            </div>

            {/* Sector Tab Navigation */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {CYBER_REPORTS.map((sec, idx) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    audio.playBillboardPulseSound();
                    setActiveTab(idx);
                  }}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    activeTab === idx
                      ? 'bg-cyan-950/70 border-cyan-400 shadow-md shadow-cyan-500/25 text-cyan-200'
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
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-[9px] font-black">
                    {report.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {report.desc}
              </p>

              {/* Dynamic SVG Neural Topology Map */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-1">
                  <span>NEURAL TOPOLOGY MAPPING</span>
                  <span className="text-cyan-400 font-bold">{report.metric}</span>
                </div>
                <svg viewBox="0 0 100 32" className="w-full h-14 rounded-lg bg-slate-950/90 border border-cyan-900/50 p-1" fill="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="16" x2="100" y2="16" stroke="#00F0FF" strokeWidth="0.5" strokeOpacity="0.2" />
                  <line x1="50" y1="0" x2="50" y2="32" stroke="#00F0FF" strokeWidth="0.5" strokeOpacity="0.2" />

                  {/* Interconnected Network Path */}
                  <path
                    d={`M ${report.nodes.map((n) => `${n.x} ${n.y}`).join(' L ')}`}
                    stroke="#00F0FF"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Nodes */}
                  {report.nodes.map((node, i) => (
                    <g key={i}>
                      <circle cx={node.x} cy={node.y} r="3" fill="#030712" stroke="#A855F7" strokeWidth="1.5" />
                      <circle cx={node.x} cy={node.y} r="1.5" fill="#00F0FF" />
                      <text
                        x={node.x}
                        y={node.y > 16 ? node.y - 4 : node.y + 7}
                        fill="#A855F7"
                        fontSize="4"
                        fontFamily="var(--font-mono)"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {node.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Cosmetic Informational Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-1 text-[9px] font-mono text-slate-500 pt-1 border-t border-slate-900">
              <span>*Atmospheric megacity neural telemetry. Purely cosmetic.</span>
              <span className="text-cyan-400 font-bold">NODE ID: CQ-NEURAL-2099</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
