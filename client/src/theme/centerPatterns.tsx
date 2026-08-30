import React from 'react';
import type { BoardThemeId } from '@shared/types';

interface CenterPatternProps {
  themeId: BoardThemeId;
  accentColor?: string;
  className?: string;
}

export const ThemedCenterMotif: React.FC<CenterPatternProps> = ({
  themeId,
  accentColor = '#CA8A04',
  className = '',
}) => {
  switch (themeId) {
    case 'world_tour':
      // Illustrated Cartographic Compass Rose
      return (
        <svg
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
          className={`w-full h-full pointer-events-none select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Ring & Ticks */}
          <circle cx="200" cy="200" r="170" stroke={accentColor} strokeWidth="2" strokeOpacity="0.3" />
          <circle cx="200" cy="200" r="150" stroke={accentColor} strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.25" />
          <circle cx="200" cy="200" r="120" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.2" />
          <circle cx="200" cy="200" r="70" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.3" />

          {/* Coordinate Crosshairs */}
          <line x1="200" y1="20" x2="200" y2="380" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="20" y1="200" x2="380" y2="200" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="72" y1="72" x2="328" y2="328" stroke={accentColor} strokeWidth="1" strokeOpacity="0.15" />
          <line x1="328" y1="72" x2="72" y2="328" stroke={accentColor} strokeWidth="1" strokeOpacity="0.15" />

          {/* Primary Compass Points (North, South, East, West) */}
          <polygon points="200,40 212,185 200,200 188,185" fill={accentColor} fillOpacity="0.85" />
          <polygon points="200,40 200,200 188,185" fill="#FFFFFF" fillOpacity="0.2" />

          <polygon points="200,360 212,215 200,200 188,215" fill={accentColor} fillOpacity="0.6" />
          <polygon points="200,360 200,200 188,215" fill="#000000" fillOpacity="0.3" />

          <polygon points="360,200 215,212 200,200 215,188" fill={accentColor} fillOpacity="0.75" />
          <polygon points="360,200 200,200 215,188" fill="#FFFFFF" fillOpacity="0.2" />

          <polygon points="40,200 185,212 200,200 185,188" fill={accentColor} fillOpacity="0.6" />
          <polygon points="40,200 200,200 185,188" fill="#000000" fillOpacity="0.3" />

          {/* Secondary 45° Points */}
          <polygon points="313,87 210,190 200,200 190,210" fill={accentColor} fillOpacity="0.4" />
          <polygon points="87,313 190,210 200,200 210,190" fill={accentColor} fillOpacity="0.4" />
          <polygon points="313,313 210,210 200,200 190,190" fill={accentColor} fillOpacity="0.4" />
          <polygon points="87,87 190,190 200,200 210,210" fill={accentColor} fillOpacity="0.4" />

          {/* Center Hub */}
          <circle cx="200" cy="200" r="14" fill="#0E0D08" stroke={accentColor} strokeWidth="2.5" />
          <circle cx="200" cy="200" r="5" fill={accentColor} />

          {/* Cardinal Labels */}
          <text x="200" y="32" fill={accentColor} fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">N</text>
          <text x="200" y="385" fill={accentColor} fontSize="12" fontWeight="800" textAnchor="middle" opacity="0.6" fontFamily="var(--font-display)">S</text>
          <text x="382" y="204" fill={accentColor} fontSize="12" fontWeight="800" textAnchor="middle" opacity="0.6" fontFamily="var(--font-display)">E</text>
          <text x="18" y="204" fill={accentColor} fontSize="12" fontWeight="800" textAnchor="middle" opacity="0.6" fontFamily="var(--font-display)">W</text>
        </svg>
      );

    case 'cyber_neon':
      // Isometric PCB Circuit Matrix & Micro-Core
      return (
        <svg
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
          className={`w-full h-full pointer-events-none select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hexagonal Outer Frame */}
          <polygon
            points="200,30 345,115 345,285 200,370 55,285 55,115"
            stroke={accentColor}
            strokeWidth="2"
            strokeOpacity="0.3"
          />
          <polygon
            points="200,60 320,130 320,270 200,340 80,270 80,130"
            stroke={accentColor}
            strokeWidth="1"
            strokeDasharray="4 4"
            strokeOpacity="0.2"
          />

          {/* Circuit Traces */}
          <path d="M 200 60 L 200 130 M 200 270 L 200 340" stroke={accentColor} strokeWidth="2" strokeOpacity="0.4" />
          <path d="M 80 130 L 140 170 L 140 230 L 80 270" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.35" />
          <path d="M 320 130 L 260 170 L 260 230 L 320 270" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.35" />

          {/* Angled Data Conduits */}
          <path d="M 100 80 L 160 140 L 170 140" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.3" />
          <path d="M 300 80 L 240 140 L 230 140" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.3" />
          <path d="M 100 320 L 160 260 L 170 260" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.3" />
          <path d="M 300 320 L 240 260 L 230 260" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.3" />

          {/* Solder Nodes */}
          <circle cx="100" cy="80" r="4" fill={accentColor} fillOpacity="0.7" />
          <circle cx="300" cy="80" r="4" fill={accentColor} fillOpacity="0.7" />
          <circle cx="100" cy="320" r="4" fill={accentColor} fillOpacity="0.7" />
          <circle cx="300" cy="320" r="4" fill={accentColor} fillOpacity="0.7" />

          {/* Central Neural Node Processor */}
          <rect x="155" y="155" width="90" height="90" rx="14" fill="#030A14" stroke={accentColor} strokeWidth="2.5" />
          <rect x="168" y="168" width="64" height="64" rx="8" fill={accentColor} fillOpacity="0.15" stroke={accentColor} strokeWidth="1.5" />
          <polygon points="200,175 220,200 200,225 180,200" fill={accentColor} fillOpacity="0.8" />
          <circle cx="200" cy="200" r="6" fill="#FFFFFF" />

          {/* Terminal Accents */}
          <text x="200" y="260" fill={accentColor} fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.6">SYS.NODE_2099</text>
        </svg>
      );

    case 'mystic_fantasy':
      // Arcane Rune Mandala & Celestial Rings
      return (
        <svg
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
          className={`w-full h-full pointer-events-none select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Concentric Enchantment Circles */}
          <circle cx="200" cy="200" r="165" stroke={accentColor} strokeWidth="2" strokeOpacity="0.35" />
          <circle cx="200" cy="200" r="145" stroke={accentColor} strokeWidth="1" strokeDasharray="6 3" strokeOpacity="0.3" />
          <circle cx="200" cy="200" r="115" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.25" />
          <circle cx="200" cy="200" r="60" stroke={accentColor} strokeWidth="2" strokeOpacity="0.4" />

          {/* Interlocking Arcane Square / Octagram */}
          <rect x="90" y="90" width="220" height="220" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.25" rx="6" />
          <rect x="90" y="90" width="220" height="220" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.25" rx="6" transform="rotate(45 200 200)" />

          {/* 8-Way Celestial Rune Beams */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const x1 = 200 + 70 * Math.cos(angle);
            const y1 = 200 + 70 * Math.sin(angle);
            const x2 = 200 + 135 * Math.cos(angle);
            const y2 = 200 + 135 * Math.sin(angle);
            const cx = 200 + 155 * Math.cos(angle);
            const cy = 200 + 155 * Math.sin(angle);

            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.4" />
                <circle cx={cx} cy={cy} r="5" fill={accentColor} fillOpacity="0.6" stroke={accentColor} strokeWidth="1" />
              </g>
            );
          })}

          {/* Central Crystal Sigil */}
          <polygon points="200,165 228,185 228,215 200,235 172,215 172,185" fill="#07150A" stroke={accentColor} strokeWidth="2.5" />
          <polygon points="200,175 218,200 200,225 182,200" fill={accentColor} fillOpacity="0.75" />
          <circle cx="200" cy="200" r="4" fill="#FFFFFF" />
        </svg>
      );

    case 'cosmic_space':
      // Constellation Astrolabe & Orbital Trajectories
      return (
        <svg
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
          className={`w-full h-full pointer-events-none select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Orbital Ellipses */}
          <ellipse cx="200" cy="200" rx="160" ry="85" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.3" transform="rotate(-25 200 200)" />
          <ellipse cx="200" cy="200" rx="140" ry="70" stroke={accentColor} strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.25" transform="rotate(35 200 200)" />
          <circle cx="200" cy="200" r="165" stroke={accentColor} strokeWidth="1" strokeOpacity="0.2" />
          <circle cx="200" cy="200" r="110" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.25" />

          {/* Constellation Star Lines */}
          <path d="M 90 120 L 150 90 L 220 110 L 290 80 L 330 140" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M 80 270 L 140 310 L 210 280 L 280 320 L 320 260" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.4" />

          {/* Star Nodes */}
          <circle cx="90" cy="120" r="3.5" fill="#FFFFFF" />
          <circle cx="150" cy="90" r="4" fill={accentColor} />
          <circle cx="220" cy="110" r="3" fill="#FFFFFF" />
          <circle cx="290" cy="80" r="5" fill={accentColor} />
          <circle cx="330" cy="140" r="3.5" fill="#FFFFFF" />

          <circle cx="80" cy="270" r="4" fill={accentColor} />
          <circle cx="140" cy="310" r="3" fill="#FFFFFF" />
          <circle cx="210" cy="280" r="5" fill={accentColor} />
          <circle cx="280" cy="320" r="3.5" fill="#FFFFFF" />
          <circle cx="320" cy="260" r="4" fill={accentColor} />

          {/* Planetary Core */}
          <circle cx="200" cy="200" r="36" fill="#010617" stroke={accentColor} strokeWidth="2.5" />
          <ellipse cx="200" cy="200" rx="55" ry="16" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.7" transform="rotate(-20 200 200)" />
          <circle cx="200" cy="200" r="22" fill={accentColor} fillOpacity="0.3" />
          <circle cx="200" cy="200" r="10" fill={accentColor} fillOpacity="0.9" />
          <circle cx="196" cy="196" r="3" fill="#FFFFFF" />
        </svg>
      );

    case 'casino_royale':
      // Grand Casino Royale: Roulette Wheel, Radiating Diamond Rays & Card Suit Filigree
      return (
        <svg
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
          className={`w-full h-full pointer-events-none select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Polished Gold Roulette Rim with Brass Rivets */}
          <circle cx="200" cy="200" r="172" stroke={accentColor} strokeWidth="2.5" strokeOpacity="0.4" />
          <circle cx="200" cy="200" r="162" stroke={accentColor} strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.3" />
          <circle cx="200" cy="200" r="140" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.25" />
          <circle cx="200" cy="200" r="85" stroke={accentColor} strokeWidth="2" strokeOpacity="0.35" />
          <circle cx="200" cy="200" r="45" stroke={accentColor} strokeWidth="2" strokeOpacity="0.5" />

          {/* 36 Radiating Golden Roulette Spokes */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = (i * 10 * Math.PI) / 180;
            const x1 = 200 + 85 * Math.cos(angle);
            const y1 = 200 + 85 * Math.sin(angle);
            const x2 = 200 + 140 * Math.cos(angle);
            const y2 = 200 + 140 * Math.sin(angle);
            const isRedSector = i % 2 === 0;
            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={accentColor}
                  strokeWidth="1"
                  strokeOpacity="0.25"
                />
                {/* Subtle colored pocket indicator */}
                <circle
                  cx={200 + 150 * Math.cos(angle + 0.087)}
                  cy={200 + 150 * Math.sin(angle + 0.087)}
                  r="3"
                  fill={isRedSector ? '#DC2626' : '#1E293B'}
                  fillOpacity="0.6"
                />
              </g>
            );
          })}

          {/* 8-Point Diamond Star Rays */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const x1 = 200 + 45 * Math.cos(angle);
            const y1 = 200 + 45 * Math.sin(angle);
            const x2 = 200 + 80 * Math.cos(angle);
            const y2 = 200 + 80 * Math.sin(angle);
            return (
              <line
                key={`ray-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={accentColor}
                strokeWidth="2"
                strokeOpacity="0.45"
              />
            );
          })}

          {/* Card Suits in 4 Cardinal Sectors */}
          {/* Spades ♠ (North) */}
          <text x="200" y="60" fill={accentColor} fontSize="20" fontWeight="bold" textAnchor="middle" opacity="0.6">♠</text>
          {/* Hearts ♥ (East) */}
          <text x="340" y="206" fill="#F43F5E" fontSize="20" fontWeight="bold" textAnchor="middle" opacity="0.6">♥</text>
          {/* Clubs ♣ (South) */}
          <text x="200" y="352" fill={accentColor} fontSize="20" fontWeight="bold" textAnchor="middle" opacity="0.6">♣</text>
          {/* Diamonds ♦ (West) */}
          <text x="60" y="206" fill="#F43F5E" fontSize="20" fontWeight="bold" textAnchor="middle" opacity="0.6">♦</text>

          {/* Center Royal Casino Turret Hub */}
          <circle cx="200" cy="200" r="32" fill="#062314" stroke={accentColor} strokeWidth="2.5" />
          <circle cx="200" cy="200" r="26" fill={accentColor} fillOpacity="0.15" stroke={accentColor} strokeWidth="1" strokeDasharray="3 2" />

          {/* Golden Die in Center */}
          <rect x="189" y="189" width="22" height="22" rx="4" fill="#78350F" stroke={accentColor} strokeWidth="1.5" transform="rotate(15 200 200)" />
          <circle cx="200" cy="200" r="2.5" fill="#FEF08A" />
          <circle cx="195" cy="195" r="1.5" fill="#FEF08A" />
          <circle cx="205" cy="205" r="1.5" fill="#FEF08A" />

          <text x="200" y="246" fill={accentColor} fontSize="8" fontFamily="var(--font-mono)" fontWeight="bold" letterSpacing="1.5" textAnchor="middle" opacity="0.7">
            CASINO ROYALE
          </text>
        </svg>
      );

    case 'anime_akiba':
    default:
      // Geometric Sakura Starburst & District Lattice
      return (
        <svg
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
          className={`w-full h-full pointer-events-none select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Radial Action Lines */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 200 + 90 * Math.cos(angle);
            const y1 = 200 + 90 * Math.sin(angle);
            const x2 = 200 + 165 * Math.cos(angle);
            const y2 = 200 + 165 * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={accentColor}
                strokeWidth={i % 2 === 0 ? '2' : '1'}
                strokeOpacity={i % 2 === 0 ? '0.35' : '0.2'}
              />
            );
          })}

          {/* Outer Ring */}
          <circle cx="200" cy="200" r="165" stroke={accentColor} strokeWidth="2" strokeOpacity="0.35" />
          <circle cx="200" cy="200" r="135" stroke={accentColor} strokeWidth="1.5" strokeDasharray="5 5" strokeOpacity="0.25" />

          {/* 5-Petal Geometric Sakura Motif */}
          {Array.from({ length: 5 }).map((_, i) => {
            const rot = i * 72;
            return (
              <g key={i} transform={`rotate(${rot} 200 200)`}>
                <path
                  d="M 200 130 C 180 155, 185 185, 200 200 C 215 185, 220 155, 200 130 Z"
                  fill={accentColor}
                  fillOpacity="0.5"
                  stroke={accentColor}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {/* Center District Emblem */}
          <circle cx="200" cy="200" r="28" fill="#14091A" stroke={accentColor} strokeWidth="2.5" />
          <polygon points="200,182 214,195 200,218 186,195" fill={accentColor} fillOpacity="0.9" />
          <circle cx="200" cy="198" r="4" fill="#FFFFFF" />
        </svg>
      );
  }
};
