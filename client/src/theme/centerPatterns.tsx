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
      // Central City Plaza & Cashquake Tower Metropolitan Skyline
      return (
        <svg
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
          className={`w-full h-full pointer-events-none select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="skyGrad" x1="200" y1="20" x2="200" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0F172A" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0B1320" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06090E" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="towerGrad" x1="200" y1="40" x2="200" y2="220" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#1E293B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0B1320" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="beaconGlow" x1="200" y1="30" x2="200" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="1" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Background Sky Fill */}
          <rect x="20" y="30" width="360" height="240" fill="url(#skyGrad)" rx="16" />

          {/* Distant Background Skyscraper Silhouettes */}
          <rect x="40" y="110" width="28" height="120" fill="#0F172A" stroke="#1E293B" strokeWidth="1" strokeOpacity="0.4" />
          <rect x="74" y="90" width="32" height="140" fill="#0F172A" stroke="#1E293B" strokeWidth="1" strokeOpacity="0.4" />
          <polygon points="90,70 74,90 106,90" fill="#0F172A" stroke="#1E293B" strokeWidth="1" strokeOpacity="0.4" />
          
          <rect x="296" y="95" width="30" height="135" fill="#0F172A" stroke="#1E293B" strokeWidth="1" strokeOpacity="0.4" />
          <rect x="332" y="115" width="28" height="115" fill="#0F172A" stroke="#1E293B" strokeWidth="1" strokeOpacity="0.4" />

          {/* Midground Commercial Towers & Illuminated Windows */}
          <rect x="110" y="110" width="46" height="130" fill="#141E33" stroke="#334155" strokeWidth="1.5" strokeOpacity="0.5" />
          {/* Windows on Tower 1 */}
          {Array.from({ length: 6 }).map((_, r) => (
            <g key={`win-l-${r}`}>
              <rect x="116" y={120 + r * 16} width="6" height="8" rx="1" fill="#38BDF8" fillOpacity={r % 2 === 0 ? '0.7' : '0.2'} />
              <rect x="126" y={120 + r * 16} width="6" height="8" rx="1" fill="#FEF08A" fillOpacity={r % 3 === 0 ? '0.8' : '0.25'} />
              <rect x="136" y={120 + r * 16} width="6" height="8" rx="1" fill="#38BDF8" fillOpacity={(r + 1) % 2 === 0 ? '0.6' : '0.15'} />
            </g>
          ))}

          <rect x="244" y="110" width="46" height="130" fill="#141E33" stroke="#334155" strokeWidth="1.5" strokeOpacity="0.5" />
          {/* Windows on Tower 2 */}
          {Array.from({ length: 6 }).map((_, r) => (
            <g key={`win-r-${r}`}>
              <rect x="252" y={120 + r * 16} width="6" height="8" rx="1" fill="#FEF08A" fillOpacity={r % 2 === 1 ? '0.75' : '0.2'} />
              <rect x="262" y={120 + r * 16} width="6" height="8" rx="1" fill="#38BDF8" fillOpacity={(r + 2) % 3 === 0 ? '0.8' : '0.2'} />
              <rect x="272" y={120 + r * 16} width="6" height="8" rx="1" fill="#38BDF8" fillOpacity={r % 2 === 0 ? '0.65' : '0.15'} />
            </g>
          ))}

          {/* Central Landmark: THE CASHQUAKE TOWER */}
          <g>
            {/* Main Spire Tower Body */}
            <polygon points="172,240 182,75 218,75 228,240" fill="url(#towerGrad)" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.6" />
            <polygon points="186,75 198,42 202,42 214,75" fill="#1E293B" stroke={accentColor} strokeWidth="1.5" strokeOpacity="0.7" />
            {/* Spire Antenna */}
            <line x1="200" y1="42" x2="200" y2="24" stroke={accentColor} strokeWidth="2" strokeOpacity="0.9" />
            {/* Beacon Pulsing Light */}
            <circle cx="200" cy="24" r="5" fill="#F59E0B" className="animate-ping" opacity="0.75" />
            <circle cx="200" cy="24" r="3.5" fill="#F59E0B" />
            <circle cx="200" cy="24" r="1.5" fill="#FFFFFF" />

            {/* Tower Glass Matrix Windows */}
            {Array.from({ length: 9 }).map((_, r) => (
              <g key={`cq-win-${r}`}>
                <line x1="184" y1={86 + r * 15} x2="216" y2={86 + r * 15} stroke={accentColor} strokeWidth="1" strokeOpacity="0.3" />
                <circle cx="194" cy={86 + r * 15 - 5} r="2" fill="#38BDF8" fillOpacity={r % 2 === 0 ? '0.8' : '0.3'} />
                <circle cx="206" cy={86 + r * 15 - 5} r="2" fill="#E2B144" fillOpacity={r % 3 === 0 ? '0.9' : '0.35'} />
              </g>
            ))}

            {/* Glowing Crown Crest */}
            <rect x="184" y="75" width="32" height="6" rx="1" fill="#E2B144" fillOpacity="0.8" />
          </g>

          {/* Foreground Central City Plaza & Radial Roads */}
          <g>
            {/* Outer Circular Boulevard */}
            <circle cx="200" cy="285" r="105" stroke="#334155" strokeWidth="16" strokeOpacity="0.4" />
            <circle cx="200" cy="285" r="105" stroke="#FEF08A" strokeWidth="1.5" strokeDasharray="8 6" strokeOpacity="0.35" />

            {/* Radial Convergence Avenues */}
            <line x1="200" y1="285" x2="60" y2="370" stroke="#334155" strokeWidth="14" strokeOpacity="0.35" />
            <line x1="200" y1="285" x2="60" y2="370" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="6 6" strokeOpacity="0.3" />

            <line x1="200" y1="285" x2="340" y2="370" stroke="#334155" strokeWidth="14" strokeOpacity="0.35" />
            <line x1="200" y1="285" x2="340" y2="370" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="6 6" strokeOpacity="0.3" />

            <line x1="200" y1="285" x2="200" y2="390" stroke="#334155" strokeWidth="14" strokeOpacity="0.35" />
            <line x1="200" y1="285" x2="200" y2="390" stroke="#FEF08A" strokeWidth="1.5" strokeDasharray="6 6" strokeOpacity="0.3" />

            {/* Central Illuminated Financial Plaza Hub */}
            <circle cx="200" cy="285" r="48" fill="#090D14" stroke={accentColor} strokeWidth="2" strokeOpacity="0.7" />
            <circle cx="200" cy="285" r="40" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.4" />
            <circle cx="200" cy="285" r="28" fill="#1E293B" fillOpacity="0.6" stroke="#E2B144" strokeWidth="1.5" strokeOpacity="0.8" />
            
            {/* Animated Traffic Headlight Dashes Moving Along Roads */}
            <circle cx="140" cy="235" r="2.5" fill="#FEF08A" opacity="0.9" />
            <circle cx="260" cy="235" r="2.5" fill="#EF4444" opacity="0.9" />
            <circle cx="110" cy="335" r="2.5" fill="#FEF08A" opacity="0.9" />
            <circle cx="290" cy="335" r="2.5" fill="#EF4444" opacity="0.9" />

            {/* Metropolitan Hub Logo */}
            <polygon points="200,268 212,285 200,302 188,285" fill={accentColor} fillOpacity="0.8" />
            <circle cx="200" cy="285" r="4" fill="#FFFFFF" />

            <text x="200" y="322" fill={accentColor} fontSize="8" fontFamily="var(--font-mono)" fontWeight="bold" letterSpacing="1.2" textAnchor="middle" opacity="0.75">
              METROPOLIS CENTRAL
            </text>
          </g>
        </svg>
      );

    case 'cyber_neon':
      // Cyber City Nexus 2099: Layered Megacity Environment with Clear Spatial Hierarchy
      return (
        <svg
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
          className={`w-full h-full pointer-events-none select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Atmospheric Sky & Neon Gradients */}
            <linearGradient id="cyberSky" x1="200" y1="0" x2="200" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0B1124" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#050811" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#02040A" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#080E20" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="nexusSpine" x1="200" y1="20" x2="200" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#A855F7" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0D1630" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="roadGlow" x1="0" y1="340" x2="400" y2="340" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#A855F7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.4" />
            </linearGradient>

            <pattern id="cyberGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00F0FF" strokeWidth="0.5" strokeOpacity="0.12" />
            </pattern>
          </defs>

          {/* Full-Arena Cyber Environment Background */}
          <rect x="0" y="0" width="400" height="400" fill="url(#cyberSky)" rx="16" />
          <rect x="10" y="10" width="380" height="380" fill="url(#cyberGrid)" rx="12" />

          {/* ========================================================================= */}
          {/* ZONE 1: UPPER SKYLINE & CASHQUAKE NEXUS TOWER (y: 10 to 110)              */}
          {/* ========================================================================= */}
          {/* Distant Skyscrapers */}
          <rect x="25" y="45" width="28" height="75" fill="#080E1E" stroke="#00F0FF" strokeWidth="0.8" strokeOpacity="0.3" />
          <rect x="58" y="30" width="34" height="90" fill="#0A1226" stroke="#A855F7" strokeWidth="0.8" strokeOpacity="0.35" />
          <polygon points="75,18 58,30 92,30" fill="#0A1226" stroke="#A855F7" strokeWidth="0.8" strokeOpacity="0.35" />
          
          <rect x="308" y="30" width="34" height="90" fill="#0A1226" stroke="#A855F7" strokeWidth="0.8" strokeOpacity="0.35" />
          <polygon points="325,18 308,30 342,30" fill="#0A1226" stroke="#A855F7" strokeWidth="0.8" strokeOpacity="0.35" />
          <rect x="347" y="45" width="28" height="75" fill="#080E1E" stroke="#00F0FF" strokeWidth="0.8" strokeOpacity="0.3" />

          {/* Animated Matrix Windows on Towers */}
          {Array.from({ length: 4 }).map((_, r) => (
            <g key={`win-r-${r}`}>
              <rect x="31" y={52 + r * 14} width="4" height="6" fill="#00F0FF" fillOpacity={r % 2 === 0 ? '0.7' : '0.15'} />
              <rect x="41" y={52 + r * 14} width="4" height="6" fill="#F43F5E" fillOpacity={r % 2 === 1 ? '0.8' : '0.2'} />
              <rect x="66" y={38 + r * 15} width="5" height="7" fill="#00F0FF" fillOpacity={r % 2 === 1 ? '0.8' : '0.2'} />
              <rect x="77" y={38 + r * 15} width="5" height="7" fill="#FDE047" fillOpacity={r % 3 === 1 ? '0.85' : '0.2'} />
              <rect x="316" y={38 + r * 15} width="5" height="7" fill="#00F0FF" fillOpacity={r % 2 === 0 ? '0.8' : '0.2'} />
              <rect x="327" y={38 + r * 15} width="5" height="7" fill="#F43F5E" fillOpacity={r % 3 === 2 ? '0.85' : '0.2'} />
              <rect x="353" y={52 + r * 14} width="4" height="6" fill="#00F0FF" fillOpacity={r % 2 === 1 ? '0.7' : '0.15'} />
            </g>
          ))}

          {/* Central Landmark: CASHQUAKE NEXUS TOWER */}
          <path
            d="M 184 120 L 188 35 L 194 18 L 200 12 L 206 18 L 212 35 L 216 120 Z"
            fill="url(#nexusSpine)"
            stroke="#00F0FF"
            strokeWidth="1.5"
          />
          {/* Conduit Spine */}
          <line x1="200" y1="12" x2="200" y2="120" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4 3" />
          {/* Holographic Crown Ring */}
          <ellipse cx="200" cy="38" rx="26" ry="7" fill="none" stroke="#00F0FF" strokeWidth="1.8" />
          <ellipse cx="200" cy="38" rx="30" ry="9" fill="none" stroke="#F43F5E" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.8" />
          {/* Rooftop Antenna & Beacon */}
          <line x1="200" y1="12" x2="200" y2="2" stroke="#00F0FF" strokeWidth="1.8" />
          <circle cx="200" cy="2" r="3.5" fill="#F43F5E" />
          <circle cx="200" cy="2" r="7" fill="none" stroke="#F43F5E" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.7" />

          {/* Upper Architectural Skyline Branding (Positioned high so dice NEVER covers it) */}
          <g transform="translate(200, 68)">
            <rect x="-65" y="-9" width="130" height="18" rx="5" fill="#030814" stroke="#00F0FF" strokeWidth="1.2" />
            <text x="0" y="4" fill="#00F0FF" fontSize="8" fontFamily="var(--font-mono)" fontWeight="900" textAnchor="middle" letterSpacing="2">
              NEXUS CITY 2099
            </text>
          </g>

          {/* Left & Right Flank Digital Billboards */}
          <rect x="98" y="55" width="34" height="12" rx="2" fill="#F43F5E" fillOpacity="0.2" stroke="#F43F5E" strokeWidth="0.8" />
          <text x="115" y="64" fill="#F43F5E" fontSize="5.5" fontFamily="var(--font-mono)" fontWeight="900" textAnchor="middle">NEXUS</text>
          
          <rect x="268" y="55" width="34" height="12" rx="2" fill="#00F0FF" fillOpacity="0.2" stroke="#00F0FF" strokeWidth="0.8" />
          <text x="285" y="64" fill="#00F0FF" fontSize="5.5" fontFamily="var(--font-mono)" fontWeight="900" textAnchor="middle">CORP</text>

          {/* ========================================================================= */}
          {/* ZONE 2: FLANKS & SUSPENDED DATA INFRASTRUCTURE (x: 10-60, 340-390)        */}
          {/* ========================================================================= */}
          {/* Fiber Laser Lines connecting towers */}
          <path d="M 50 115 L 20 180 L 20 280" stroke="#00F0FF" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.4" />
          <path d="M 350 115 L 380 180 L 380 280" stroke="#A855F7" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.4" />

          {/* ========================================================================= */}
          {/* ZONE 3: LOWER / FOREGROUND INFRASTRUCTURE & NEON ROADWAY (y: 280 to 395)  */}
          {/* ========================================================================= */}
          {/* Elevated Maglev Monorail Transit Rail spanning across */}
          <g transform="translate(0, 290)">
            {/* Rail Beam */}
            <rect x="15" y="0" width="370" height="7" rx="3" fill="#060C1A" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.6" />
            <line x1="15" y1="3.5" x2="385" y2="3.5" stroke="#00F0FF" strokeWidth="1.5" strokeDasharray="8 6" strokeOpacity="0.8" />
            {/* Maglev Pod in transit */}
            <rect x="240" y="-4" width="32" height="7" rx="2" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="0.8" />
            <circle cx="268" cy="-0.5" r="1.5" fill="#00F0FF" />
            <line x1="240" y1="-0.5" x2="200" y2="-0.5" stroke="#F43F5E" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 2" />
          </g>

          {/* Ground Neon Roadway & Digital Crosswalks */}
          <path d="M 15 325 L 140 340 L 260 340 L 385 325" stroke="url(#roadGlow)" strokeWidth="2" strokeOpacity="0.8" />
          <rect x="20" y="342" width="360" height="42" rx="6" fill="#030712" stroke="#162A4A" strokeWidth="1" />
          
          {/* Neon Lane Markings */}
          <line x1="30" y1="363" x2="370" y2="363" stroke="#00F0FF" strokeWidth="1.5" strokeDasharray="14 10" strokeOpacity="0.6" />
          
          {/* Autonomous Vehicle Light Beams on Roadway */}
          <line x1="45" y1="353" x2="110" y2="353" stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.9" />
          <circle cx="112" cy="353" r="2" fill="#FFFFFF" />
          
          <line x1="280" y1="373" x2="345" y2="373" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.9" />
          <circle cx="278" cy="373" r="2" fill="#FFFFFF" />

          {/* Subterranean Conduit Access Plate in lower center */}
          <rect x="175" y="372" width="50" height="10" rx="3" fill="#0A152A" stroke="#A855F7" strokeWidth="1" />
          <text x="200" y="380" fill="#A855F7" fontSize="5" fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle">GRID.ACCESS</text>
        </svg>
      );

    case 'mystic_fantasy':
      // Living Enchanted Realm of Eldoria: Organic Forest, Wizard Towers, Cottages & Magical Stream
      return (
        <svg
          viewBox="0 0 400 400"
          preserveAspectRatio="none"
          className={`w-full h-full pointer-events-none select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Enchanted Twilight Gradient */}
            <linearGradient id="mysticTwilightSky" x1="200" y1="-10" x2="200" y2="410" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#120A24" stopOpacity="1" />
              <stop offset="30%" stopColor="#1E0E38" stopOpacity="0.98" />
              <stop offset="60%" stopColor="#151336" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0B1824" stopOpacity="1" />
            </linearGradient>

            {/* Glowing Forest Stream */}
            <linearGradient id="magicStreamGrad" x1="-10" y1="340" x2="410" y2="340" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#C084FC" stopOpacity="0.7" />
            </linearGradient>

            {/* Fairy Dust Pattern */}
            <pattern id="fairyPollen" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="15" r="0.9" fill="#FEF08A" fillOpacity="0.7" />
              <circle cx="38" cy="32" r="1.1" fill="#E9D5FF" fillOpacity="0.8" />
              <circle cx="45" cy="10" r="0.7" fill="#7DD3FC" fillOpacity="0.6" />
              <circle cx="22" cy="42" r="0.8" fill="#F472B6" fillOpacity="0.7" />
            </pattern>
          </defs>

          {/* Full-Arena Edge-to-Edge Enchanted Realm Background Fill */}
          <rect x="-10" y="-10" width="420" height="420" fill="url(#mysticTwilightSky)" />
          <rect x="-10" y="-10" width="420" height="420" fill="url(#fairyPollen)" />

          {/* ========================================================================= */}
          {/* ZONE 1: BACKGROUND SKYLINE, MOON, CROOKED TOWERS & CASTLE (y: 10 to 110)  */}
          {/* ========================================================================= */}
          {/* Distant Organic Mountains */}
          <path d="M -10 110 Q 50 60, 110 110 T 220 110 T 330 80 T 410 110 L 410 120 L -10 120 Z" fill="#0A081C" fillOpacity="0.7" />

          {/* Glowing Enchanted Crescent Moon & Starlight */}
          <circle cx="75" cy="35" r="15" fill="#FEF08A" fillOpacity="0.85" />
          <circle cx="79" cy="32" r="14" fill="#120A24" />
          <circle cx="68" cy="28" r="1" fill="#FFFFFF" />

          {/* Floating Paper / Arcane Lanterns in the Sky */}
          <g transform="translate(130, 25)">
            <ellipse cx="0" cy="0" rx="3.5" ry="5" fill="#F59E0B" fillOpacity="0.85" />
            <circle cx="0" cy="0" r="1.5" fill="#FEF08A" />
            <line x1="0" y1="5" x2="0" y2="8" stroke="#D97706" strokeWidth="0.8" />
          </g>
          <g transform="translate(290, 22)">
            <ellipse cx="0" cy="0" rx="3" ry="4.5" fill="#F43F5E" fillOpacity="0.8" />
            <circle cx="0" cy="0" r="1.2" fill="#FEF08A" />
            <line x1="0" y1="4.5" x2="0" y2="7" stroke="#BE123C" strokeWidth="0.8" />
          </g>

          {/* Distant Castle Spire of Eldoria & Crooked Wizard Towers */}
          {/* Left Wizard Tower with Lit Amber Windows & Drifting Smoke */}
          <path d="M 30 110 L 33 60 Q 35 45, 38 35 L 42 35 Q 45 45, 47 60 L 50 110 Z" fill="#130D2B" stroke="#6D28D9" strokeWidth="0.8" />
          <polygon points="32,35 40,15 48,35" fill="#1E123D" stroke="#A855F7" strokeWidth="0.8" />
          {/* Glowing Amber Windows */}
          <rect x="38" y="45" width="4" height="6" rx="1.5" fill="#FDE047" fillOpacity="0.9" />
          <rect x="38" y="70" width="4" height="6" rx="1.5" fill="#FDE047" fillOpacity="0.9" />
          {/* Drifting Chimney Smoke */}
          <path d="M 40 14 Q 37 8, 41 2 Q 45 -4, 42 -10" stroke="#E9D5FF" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.3" strokeDasharray="3 3" />

          {/* Right Crooked Spire & Wizard Cottage Silhouettes */}
          <path d="M 350 110 L 354 55 Q 356 40, 360 28 L 364 28 Q 368 40, 370 55 L 374 110 Z" fill="#130D2B" stroke="#6D28D9" strokeWidth="0.8" />
          <polygon points="356,28 362,12 368,28" fill="#1E123D" stroke="#A855F7" strokeWidth="0.8" />
          <circle cx="362" cy="42" r="2" fill="#FDE047" fillOpacity="0.9" />
          <rect x="360" y="68" width="4" height="5" rx="1" fill="#FDE047" fillOpacity="0.9" />

          {/* Distant Wizarding Cottages on Ridge */}
          <path d="M 285 105 L 295 95 L 305 105 Z" fill="#1A1235" stroke="#818CF8" strokeWidth="0.6" />
          <rect x="288" y="102" width="14" height="8" fill="#120D26" />
          <rect x="293" y="104" width="3" height="3" fill="#FDE047" fillOpacity="0.8" />

          {/* Central Natural Landmark: THE ARCANE NEXUS STONE ALTAR & ROOTS */}
          <g transform="translate(200, 48)">
            {/* Ancient Mossy Stone Base */}
            <ellipse cx="0" cy="18" rx="28" ry="8" fill="#0C1322" stroke="#22C55E" strokeWidth="0.8" strokeOpacity="0.5" />
            
            {/* Winding Tree Roots Wrapping Altar */}
            <path d="M -26 18 Q -15 12, -8 18 Q 0 14, 8 18 Q 18 12, 26 18" stroke="#78350F" strokeWidth="1.8" fill="none" />
            
            {/* Natural Emerging Mana Crystals */}
            <polygon points="0,-16 9,2 0,16 -9,2" fill="#818CF8" stroke="#E0E7FF" strokeWidth="1" />
            <polygon points="-12,-2 -5,8 -12,16 -18,8" fill="#C084FC" stroke="#F5D0FE" strokeWidth="0.8" />
            <polygon points="12,-2 18,8 12,16 5,8" fill="#38BDF8" stroke="#BAE6FD" strokeWidth="0.8" />
            
            {/* Ambient Candle Lights around Altar */}
            <circle cx="-16" cy="14" r="1.5" fill="#FEF08A" />
            <circle cx="16" cy="14" r="1.5" fill="#FEF08A" />
            <circle cx="0" cy="20" r="1.2" fill="#FEF08A" />

            {/* Subtle Arcane Energy Halo */}
            <circle cx="0" cy="2" r="22" stroke="#C084FC" strokeWidth="0.8" strokeDasharray="4 3" strokeOpacity="0.6" />
          </g>

          {/* Upper Living Realm Banner (Enclosed in vine & leaf trim, safe at y=72) */}
          <g transform="translate(200, 72)">
            <rect x="-72" y="-9" width="144" height="18" rx="7" fill="#0E0B24" stroke="#A855F7" strokeWidth="1.2" />
            {/* Vine Trim */}
            <path d="M -70 -7 Q -65 -11, -60 -7 Q -55 -3, -50 -7" stroke="#22C55E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 50 -7 Q 55 -3, 60 -7 Q 65 -11, 70 -7" stroke="#22C55E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <text x="0" y="4" fill="#F3E8FF" fontSize="7.5" fontFamily="var(--font-serif)" fontWeight="900" textAnchor="middle" letterSpacing="1.5">
              REALM OF ELDORIA
            </text>
          </g>

          {/* ========================================================================= */}
          {/* ZONE 2: FLANKS & GIANT TWISTED TREES (x: 10-65, 335-390, y: 100-280)      */}
          {/* ========================================================================= */}
          {/* Left Giant Ancient Twisted Tree with Moss and Hollow */}
          <g>
            {/* Tree Trunk & Twisted Branches */}
            <path d="M 8 280 Q 20 220, 15 170 Q 12 130, 22 100 Q 28 85, 36 75" stroke="#451A03" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M 20 180 Q 35 150, 45 130" stroke="#5F270B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 16 230 Q 32 210, 42 200" stroke="#5F270B" strokeWidth="3" fill="none" strokeLinecap="round" />
            
            {/* Hanging Moss & Glowing Leaves */}
            <circle cx="36" cy="75" r="10" fill="#064E3B" fillOpacity="0.8" />
            <circle cx="45" cy="128" r="8" fill="#047857" fillOpacity="0.75" />
            <circle cx="42" cy="198" r="6" fill="#065F46" fillOpacity="0.7" />
            
            {/* Floating Fireflies near tree */}
            <circle cx="30" cy="140" r="1.5" fill="#FEF08A" className="animate-pulse" />
            <circle cx="48" cy="170" r="1.2" fill="#A7F3D0" />
            
            {/* Climbing Ivy */}
            <path d="M 12 270 Q 18 240, 15 210 Q 18 180, 14 150" stroke="#10B981" strokeWidth="1.2" strokeDasharray="3 2" fill="none" />
          </g>

          {/* Right Giant Enchanted Willow Tree */}
          <g>
            {/* Tree Trunk */}
            <path d="M 392 280 Q 380 220, 385 170 Q 388 130, 378 100 Q 372 85, 364 75" stroke="#451A03" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M 380 180 Q 365 150, 355 130" stroke="#5F270B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            
            {/* Foliage Clusters */}
            <circle cx="364" cy="75" r="10" fill="#064E3B" fillOpacity="0.8" />
            <circle cx="355" cy="128" r="8" fill="#047857" fillOpacity="0.75" />
            
            {/* Hanging Willow Vines */}
            <path d="M 360 85 Q 358 110, 362 135" stroke="#10B981" strokeWidth="1" fill="none" strokeDasharray="4 2" />
            <path d="M 370 85 Q 368 115, 372 140" stroke="#10B981" strokeWidth="1" fill="none" strokeDasharray="4 2" />
            
            {/* Fireflies */}
            <circle cx="368" cy="145" r="1.5" fill="#FEF08A" />
            <circle cx="350" cy="175" r="1.2" fill="#FBCFE8" />
          </g>

          {/* ========================================================================= */}
          {/* ZONE 3: LOWER FOREST STREAM, STONE BRIDGE & MUSHROOM GROVE (y: 280 to 395)  */}
          {/* ========================================================================= */}
          {/* Crooked Moss-Covered Stone Bridge at y: 288 */}
          <g transform="translate(0, 288)">
            {/* Natural Arched Stone Bridge */}
            <path d="M -10 8 Q 200 -2, 410 8 L 410 14 Q 200 4, -10 14 Z" fill="#1C1E2C" stroke="#475569" strokeWidth="1" />
            {/* Moss Overlay on Bridge */}
            <path d="M -10 7 Q 200 -3, 410 7" stroke="#15803D" strokeWidth="1.8" fill="none" strokeDasharray="14 6" />
            
            {/* Small Lanterns Hanging on Bridge Ends */}
            <circle cx="30" cy="12" r="2.5" fill="#F59E0B" />
            <circle cx="370" cy="12" r="2.5" fill="#F59E0B" />
          </g>

          {/* Living Enchanted Forest Stream (Spanning Edge-to-Edge) */}
          <path d="M -10 325 Q 120 315, 200 330 T 410 325" fill="none" stroke="url(#magicStreamGrad)" strokeWidth="8" strokeOpacity="0.85" />
          <path d="M -10 325 Q 120 315, 200 330 T 410 325" fill="none" stroke="#E0F2FE" strokeWidth="1.5" strokeOpacity="0.7" strokeDasharray="12 10" />

          {/* Lower Grassy Forest Ground with Winding Cobblestone Path */}
          <path d="M -10 340 L 410 340 L 410 410 L -10 410 Z" fill="#0A141A" />
          <path d="M -10 340 Q 200 335, 410 340" stroke="#166534" strokeWidth="2.5" fill="none" />

          {/* Glowing Toadstools / Magic Mushrooms */}
          {/* Left Mushroom Cluster */}
          <g transform="translate(45, 362)">
            <ellipse cx="0" cy="0" rx="6" ry="4" fill="#DC2626" stroke="#FEF2F2" strokeWidth="0.8" />
            <circle cx="-2" cy="-1" r="1" fill="#FFFFFF" />
            <circle cx="2" cy="-1" r="0.8" fill="#FFFFFF" />
            <rect x="-1.5" y="0" width="3" height="6" fill="#F5F5F4" rx="1" />
            {/* Mushroom Spores Glow */}
            <circle cx="0" cy="-6" r="1" fill="#FCA5A5" />
          </g>
          <g transform="translate(60, 368)">
            <ellipse cx="0" cy="0" rx="4.5" ry="3" fill="#8B5CF6" stroke="#EDE9FE" strokeWidth="0.8" />
            <circle cx="0" cy="-0.5" r="0.8" fill="#FFFFFF" />
            <rect x="-1" y="0" width="2" height="4" fill="#F5F5F4" rx="0.5" />
          </g>

          {/* Right Glowing Magic Flower / Flora Cluster */}
          <g transform="translate(345, 365)">
            {/* Glowing Petals */}
            <circle cx="0" cy="0" r="4.5" fill="#EC4899" fillOpacity="0.85" />
            <circle cx="0" cy="0" r="2" fill="#FEF08A" />
            {/* Stem & Leaves */}
            <path d="M 0 4 Q 2 8, 0 12" stroke="#15803D" strokeWidth="1.2" fill="none" />
            <ellipse cx="3" cy="8" rx="2" ry="1" fill="#22C55E" />
            {/* Pollen Glimmer */}
            <circle cx="-3" cy="-4" r="0.9" fill="#FBCFE8" />
            <circle cx="4" cy="-3" r="0.9" fill="#FEF08A" />
          </g>

          {/* Water Lilies & Starlight Fish in Stream */}
          <ellipse cx="140" cy="326" rx="5" ry="3" fill="#047857" stroke="#10B981" strokeWidth="0.8" />
          <circle cx="140" cy="325" r="1.5" fill="#F472B6" />
          
          <ellipse cx="260" cy="328" rx="5" ry="3" fill="#047857" stroke="#10B981" strokeWidth="0.8" />
          <circle cx="260" cy="327" r="1.5" fill="#38BDF8" />

          {/* Center Cobblestone Stepping Stones */}
          <ellipse cx="180" cy="365" rx="7" ry="4" fill="#1E293B" stroke="#475569" strokeWidth="0.8" />
          <ellipse cx="205" cy="372" rx="8" ry="4.5" fill="#1E293B" stroke="#475569" strokeWidth="0.8" />
          <ellipse cx="230" cy="365" rx="7" ry="4" fill="#1E293B" stroke="#475569" strokeWidth="0.8" />

          {/* Small In-World Signpost in lower grass */}
          <g transform="translate(200, 386)">
            <rect x="-24" y="-5" width="48" height="9" rx="2" fill="#3B1D08" stroke="#78350F" strokeWidth="0.8" />
            <text x="0" y="2" fill="#FEF3C7" fontSize="4.5" fontFamily="var(--font-serif)" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
              ELDORIA PATH
            </text>
          </g>
        </svg>
      );

    case 'cosmic_space':
      // Orbital Observation Deck of Station Ares: Deep Space Vista, Ringed Gas Giant, Nebula & Station Trusses
      return (
        <svg
          viewBox="0 0 400 400"
          preserveAspectRatio="none"
          className={`w-full h-full pointer-events-none select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Deep Space Infinite Gradient */}
            <linearGradient id="cosmicVoidSky" x1="200" y1="-10" x2="200" y2="410" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#020617" stopOpacity="1" />
              <stop offset="25%" stopColor="#080C1E" stopOpacity="0.98" />
              <stop offset="55%" stopColor="#0B132B" stopOpacity="0.95" />
              <stop offset="85%" stopColor="#060A18" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#02040E" stopOpacity="1" />
            </linearGradient>

            {/* Glowing Magenta & Cyan Emission Nebula */}
            <radialGradient id="nebulaGlow1" cx="130" cy="110" r="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C084FC" stopOpacity="0.35" />
              <stop offset="45%" stopColor="#818CF8" stopOpacity="0.2" />
              <stop offset="80%" stopColor="#38BDF8" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="nebulaGlow2" cx="290" cy="80" r="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#A855F7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </radialGradient>

            {/* Gas Giant Planet Surface Gradient */}
            <linearGradient id="gasGiantGrad" x1="270" y1="50" x2="350" y2="130" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="1" />
              <stop offset="35%" stopColor="#0284C7" stopOpacity="1" />
              <stop offset="65%" stopColor="#1E3A8A" stopOpacity="1" />
              <stop offset="100%" stopColor="#080E24" stopOpacity="1" />
            </linearGradient>

            {/* Gas Giant Planetary Rings Gradient */}
            <linearGradient id="ringGrad" x1="240" y1="70" x2="380" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#E0F2FE" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.4" />
            </linearGradient>

            {/* Space Station Deck Flooring Gradient */}
            <linearGradient id="stationDeckGrad" x1="200" y1="335" x2="200" y2="410" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0A1020" stopOpacity="1" />
              <stop offset="30%" stopColor="#0F172A" stopOpacity="1" />
              <stop offset="100%" stopColor="#050814" stopOpacity="1" />
            </linearGradient>

            {/* Multi-Magnitude Star Field Pattern */}
            <pattern id="deepStarField" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="18" r="0.8" fill="#FFFFFF" fillOpacity="0.8" />
              <circle cx="34" cy="52" r="1.1" fill="#7DD3FC" fillOpacity="0.9" />
              <circle cx="68" cy="24" r="0.6" fill="#FDE68A" fillOpacity="0.75" />
              <circle cx="48" cy="72" r="0.9" fill="#FFFFFF" fillOpacity="0.85" />
              <circle cx="75" cy="60" r="1.3" fill="#F472B6" fillOpacity="0.7" />
              <circle cx="22" cy="38" r="0.5" fill="#FFFFFF" fillOpacity="0.6" />
            </pattern>
          </defs>

          {/* Full-Arena Edge-to-Edge Deep Space Void */}
          <rect x="-10" y="-10" width="420" height="420" fill="url(#cosmicVoidSky)" />
          {/* Nebula Clouds */}
          <rect x="-10" y="-10" width="420" height="420" fill="url(#nebulaGlow1)" />
          <rect x="-10" y="-10" width="420" height="420" fill="url(#nebulaGlow2)" />
          {/* Star Field */}
          <rect x="-10" y="-10" width="420" height="420" fill="url(#deepStarField)" />

          {/* ========================================================================= */}
          {/* ZONE 1: DEEP SPACE PANORAMA (Planets, Moons, Spiral Galaxy, Passing Probe)*/}
          {/* ========================================================================= */}
          {/* Distant Spiral Galaxy in Upper-Center */}
          <g transform="translate(190, 30) rotate(-25)">
            <ellipse cx="0" cy="0" rx="22" ry="6" fill="#818CF8" fillOpacity="0.25" />
            <ellipse cx="0" cy="0" rx="14" ry="3.5" fill="#C084FC" fillOpacity="0.4" />
            <circle cx="0" cy="0" r="2" fill="#FFFFFF" fillOpacity="0.9" />
          </g>

          {/* Glowing Crescent Moon / Orbital Body in Upper-Left */}
          <g transform="translate(75, 42)">
            <circle cx="0" cy="0" r="13" fill="#334155" stroke="#475569" strokeWidth="0.6" />
            {/* Crater details */}
            <circle cx="-3" cy="-2" r="2.5" fill="#1E293B" />
            <circle cx="4" cy="3" r="1.8" fill="#1E293B" />
            <circle cx="-1" cy="5" r="1.2" fill="#1E293B" />
            {/* Atmospheric Blue Sunlight Limb */}
            <path d="M 0 -13 A 13 13 0 0 1 13 0 A 13 13 0 0 1 0 13 A 13 13 0 0 0 0 -13 Z" fill="#38BDF8" fillOpacity="0.75" />
          </g>

          {/* Giant Ringed Gas Giant Planet in Upper-Right (Dominant Cosmic Landmark) */}
          <g transform="translate(315, 80)">
            {/* Rear Planetary Rings */}
            <ellipse cx="0" cy="0" rx="56" ry="14" fill="none" stroke="url(#ringGrad)" strokeWidth="4.5" strokeOpacity="0.65" transform="rotate(-22)" />
            <ellipse cx="0" cy="0" rx="62" ry="16" fill="none" stroke="#7DD3FC" strokeWidth="1" strokeDasharray="6 3" strokeOpacity="0.4" transform="rotate(-22)" />

            {/* Planet Sphere */}
            <circle cx="0" cy="0" r="34" fill="url(#gasGiantGrad)" stroke="#38BDF8" strokeWidth="0.8" />
            {/* Atmospheric Cloud Band Striations */}
            <path d="M -32 -6 Q 0 -12, 32 -6" stroke="#0284C7" strokeWidth="2.5" fill="none" strokeOpacity="0.6" />
            <path d="M -33 8 Q 0 2, 33 8" stroke="#38BDF8" strokeWidth="2" fill="none" strokeOpacity="0.7" />
            <path d="M -28 18 Q 0 14, 28 18" stroke="#1E3A8A" strokeWidth="2.5" fill="none" strokeOpacity="0.8" />

            {/* Front Planetary Rings & Planet Shadow */}
            <path
              d="M -52 19 C -25 32, 25 12, 52 -19"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Subtle Ring Shadow across Planet */}
            <ellipse cx="0" cy="4" rx="30" ry="4" fill="#020617" fillOpacity="0.5" transform="rotate(-22)" />
          </g>

          {/* Passing Deep Space Exploration Probe Silhouette with Engine Plume */}
          <g transform="translate(130, 88)">
            {/* Ion Engine Glow Trail */}
            <line x1="-35" y1="0" x2="-6" y2="0" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.8" />
            <circle cx="-6" cy="0" r="1.5" fill="#FFFFFF" />
            {/* Probe Chassis */}
            <polygon points="-6,-3 6,0 -6,3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.5" />
            {/* Solar Wings */}
            <rect x="-3" y="-8" width="2" height="16" rx="0.5" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="0.5" />
          </g>

          {/* ========================================================================= */}
          {/* ZONE 2: STATION STRUCTURAL FRAME, CUPOLA TRUSSES & BRANDING BANNER        */}
          {/* ========================================================================= */}
          {/* Station Upper Hull Arch / Observation Window Frame */}
          <path d="M -10 15 Q 200 -8, 410 15 L 410 24 Q 200 4, -10 24 Z" fill="#0B1329" stroke="#1E3A8A" strokeWidth="1.2" />

          {/* Left Exterior Structural Trusses */}
          <path d="M -10 24 L 28 120 L 28 260 L -10 335" stroke="#1E293B" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M -10 70 L 28 120 L -10 170" stroke="#334155" strokeWidth="1.5" fill="none" />
          <path d="M -10 210 L 28 260 L -10 310" stroke="#334155" strokeWidth="1.5" fill="none" />

          {/* Right Exterior Structural Trusses */}
          <path d="M 410 24 L 372 120 L 372 260 L 410 335" stroke="#1E293B" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 410 70 L 372 120 L 410 170" stroke="#334155" strokeWidth="1.5" fill="none" />
          <path d="M 410 210 L 372 260 L 410 310" stroke="#334155" strokeWidth="1.5" fill="none" />

          {/* Upper Observation Deck Banner (Positioned safely at y=70, well above dice) */}
          <g transform="translate(200, 70)">
            <rect x="-76" y="-9" width="152" height="18" rx="6" fill="#050C1F" stroke="#38BDF8" strokeWidth="1.2" />
            {/* Status Beacon Lights */}
            <circle cx="-68" cy="0" r="2" fill="#22C55E" className="animate-pulse" />
            <circle cx="68" cy="0" r="2" fill="#38BDF8" className="animate-pulse" />
            <text x="0" y="4" fill="#38BDF8" fontSize="7" fontFamily="var(--font-mono)" fontWeight="900" textAnchor="middle" letterSpacing="2">
              ORBITAL STATION ARES
            </text>
          </g>

          {/* ========================================================================= */}
          {/* ZONE 3: LOWER OBSERVATION DECK FLOORING & ILLUMINATED RUNWAYS (y: 335-410) */}
          {/* ========================================================================= */}
          {/* Solid Station Observation Deck Base Floor */}
          <path d="M -10 335 L 410 335 L 410 410 L -10 410 Z" fill="url(#stationDeckGrad)" />
          {/* Floor Deck Seam & Trim */}
          <line x1="-10" y1="335" x2="410" y2="335" stroke="#1E3A8A" strokeWidth="2" />
          <line x1="-10" y1="337" x2="410" y2="337" stroke="#38BDF8" strokeWidth="1" strokeDasharray="12 6" strokeOpacity="0.7" />

          {/* Left & Right Runway Guidance Strip Lights */}
          <line x1="20" y1="358" x2="140" y2="358" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
          <circle cx="20" cy="358" r="2" fill="#FFFFFF" />
          <circle cx="140" cy="358" r="2" fill="#FFFFFF" />

          <line x1="260" y1="358" x2="380" y2="358" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
          <circle cx="260" cy="358" r="2" fill="#FFFFFF" />
          <circle cx="380" cy="358" r="2" fill="#FFFFFF" />

          {/* Center Deck Expansion Hatch & Stenciling */}
          <rect x="175" y="365" width="50" height="12" rx="3" fill="#070D1E" stroke="#334155" strokeWidth="1" />
          <text x="200" y="374" fill="#64748B" fontSize="5" fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle" letterSpacing="1">
            DECK.01 // BAY-7
          </text>
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
      // Anime Akiba District — Vibrant Night Street Panorama with Neon Storefronts, Elevated Yamanote Rail & Crosswalk
      return (
        <svg
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
          className={`w-full h-full pointer-events-none select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Tokyo Night Sky Gradient */}
            <linearGradient id="akiba-night-sky" x1="200" y1="0" x2="200" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#080312" />
              <stop offset="35%" stopColor="#140624" />
              <stop offset="70%" stopColor="#1f0a35" />
              <stop offset="100%" stopColor="#0c0417" />
            </linearGradient>

            {/* Neon Magenta Glow */}
            <linearGradient id="akiba-magenta-glow" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f472b6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
            </linearGradient>

            {/* Neon Cyan Glow */}
            <linearGradient id="akiba-cyan-glow" x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.7" />
            </linearGradient>

            {/* Street Asphalt & Neon Reflection */}
            <linearGradient id="akiba-asphalt" x1="200" y1="320" x2="200" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#110722" />
              <stop offset="50%" stopColor="#180c2e" />
              <stop offset="100%" stopColor="#0a0314" />
            </linearGradient>

            {/* Wet Road Neon Mirror */}
            <linearGradient id="akiba-road-reflection" x1="200" y1="340" x2="200" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* 1. Base Night Sky Canvas (100% Coverage, Zero Borders) */}
          <rect width="400" height="400" fill="url(#akiba-night-sky)" />

          {/* 2. Distant Ambient Neon Halos */}
          <circle cx="80" cy="90" r="90" fill="#ec4899" fillOpacity="0.07" filter="blur(30px)" />
          <circle cx="320" cy="80" r="100" fill="#06b6d4" fillOpacity="0.07" filter="blur(35px)" />
          <circle cx="200" cy="180" r="110" fill="#8b5cf6" fillOpacity="0.05" filter="blur(40px)" />

          {/* 3. Deep Background Layer: Distant Skyscrapers Silhouette & Grid Windows */}
          <g opacity="0.45">
            {/* Left Distant Towers */}
            <rect x="15" y="45" width="40" height="180" fill="#0b0416" />
            <rect x="45" y="30" width="35" height="195" fill="#0d051c" />
            <rect x="70" y="55" width="30" height="170" fill="#090314" />

            {/* Right Distant Towers */}
            <rect x="300" y="50" width="35" height="175" fill="#090314" />
            <rect x="325" y="35" width="40" height="190" fill="#0d051c" />
            <rect x="355" y="55" width="30" height="170" fill="#0b0416" />

            {/* Distant Window Lights */}
            {[
              [22, 60], [30, 60], [22, 80], [30, 80], [22, 100], [30, 100],
              [52, 45], [62, 45], [52, 65], [62, 65], [52, 85], [62, 85],
              [310, 65], [320, 65], [310, 85], [320, 85],
              [335, 50], [345, 50], [335, 70], [345, 70], [335, 90], [345, 90],
            ].map(([wx, wy], idx) => (
              <rect key={`dw-${idx}`} x={wx} y={wy} width="4" height="6" rx="1" fill={idx % 3 === 0 ? '#fde047' : idx % 2 === 0 ? '#38bdf8' : '#f472b6'} opacity="0.6" />
            ))}
          </g>

          {/* 4. Midground Layer: Multi-Floor Anime & Electronics Department Stores */}
          {/* Left Megastore Facade (Animate / Hobby Complex) */}
          <g>
            <rect x="2" y="70" width="85" height="255" fill="#130626" stroke="#4a156e" strokeWidth="1" />
            {/* Storefront Floor Dividers */}
            <line x1="2" y1="120" x2="87" y2="120" stroke="#6b21a8" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="2" y1="170" x2="87" y2="170" stroke="#6b21a8" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="2" y1="220" x2="87" y2="220" stroke="#6b21a8" strokeWidth="1" strokeOpacity="0.5" />

            {/* Giant Vertical Kanji Neon Sign 「秋葉原」 (Akihabara) */}
            <rect x="68" y="75" width="15" height="90" rx="3" fill="#090214" stroke="#ec4899" strokeWidth="1.2" />
            <text x="75.5" y="94" fill="#f472b6" fontSize="11" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" filter="drop-shadow(0 0 4px #ec4899)">秋</text>
            <text x="75.5" y="118" fill="#f472b6" fontSize="11" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" filter="drop-shadow(0 0 4px #ec4899)">葉</text>
            <text x="75.5" y="142" fill="#f472b6" fontSize="11" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" filter="drop-shadow(0 0 4px #ec4899)">原</text>
            <circle cx="75.5" cy="155" r="2" fill="#fbbf24" />

            {/* Small Anime Poster Displays on Facade */}
            <rect x="8" y="128" width="22" height="34" rx="2" fill="#1e0b3b" stroke="#38bdf8" strokeWidth="1" />
            <polygon points="19,134 25,148 13,148" fill="#38bdf8" fillOpacity="0.7" />
            <circle cx="19" cy="138" r="3" fill="#fde047" />

            <rect x="35" y="128" width="26" height="34" rx="2" fill="#1e0b3b" stroke="#ec4899" strokeWidth="1" />
            <path d="M 48 135 C 44 130, 39 135, 48 148 C 57 135, 52 130, 48 135 Z" fill="#ec4899" fillOpacity="0.8" />
          </g>

          {/* Right Megastore Facade (Sega / Taito Arcade Complex) */}
          <g>
            <rect x="313" y="65" width="85" height="260" fill="#130626" stroke="#4a156e" strokeWidth="1" />
            {/* Floor Dividers */}
            <line x1="313" y1="115" x2="398" y2="115" stroke="#6b21a8" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="313" y1="165" x2="398" y2="165" stroke="#6b21a8" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="313" y1="215" x2="398" y2="215" stroke="#6b21a8" strokeWidth="1" strokeOpacity="0.5" />

            {/* Giant Vertical Kanji Neon Sign 「ゲーム」 (Game) */}
            <rect x="317" y="72" width="15" height="85" rx="3" fill="#090214" stroke="#06b6d4" strokeWidth="1.2" />
            <text x="324.5" y="90" fill="#38bdf8" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" filter="drop-shadow(0 0 4px #06b6d4)">ゲ</text>
            <text x="324.5" y="112" fill="#38bdf8" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" filter="drop-shadow(0 0 4px #06b6d4)">ー</text>
            <text x="324.5" y="134" fill="#38bdf8" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" filter="drop-shadow(0 0 4px #06b6d4)">ム</text>
            <circle cx="324.5" cy="147" r="2" fill="#4ade80" />

            {/* Pixel Character Neon Icon on Right Facade */}
            <rect x="340" y="125" width="48" height="34" rx="3" fill="#1b0a38" stroke="#f59e0b" strokeWidth="1" />
            <rect x="348" y="132" width="6" height="6" fill="#fbbf24" />
            <rect x="366" y="132" width="6" height="6" fill="#fbbf24" />
            <rect x="354" y="142" width="12" height="4" rx="1" fill="#ec4899" />
          </g>

          {/* 5. Elevated Yamanote / Chuo Rail Transit Bridge ($y: 45 - 60$) */}
          <g>
            {/* Bridge Concrete Truss */}
            <rect x="75" y="48" width="250" height="9" fill="#1b122e" stroke="#475569" strokeWidth="1" />
            <line x1="85" y1="52" x2="315" y2="52" stroke="#64748b" strokeWidth="1" strokeDasharray="6 4" />

            {/* Commuter Train Train Cars with Glowing Windows */}
            <rect x="135" y="38" width="130" height="12" rx="2" fill="#0f172a" stroke="#22c55e" strokeWidth="1.2" />
            {/* Yamanote Green Accent Stripe */}
            <rect x="135" y="44" width="130" height="2.5" fill="#22c55e" />
            {/* Passenger Windows */}
            {[142, 155, 168, 181, 194, 207, 220, 233, 246].map((tx, idx) => (
              <rect key={`train-w-${idx}`} x={tx} y={40} width="8" height="3.5" rx="0.5" fill="#fef08a" fillOpacity="0.85" />
            ))}
            {/* Train Headlights */}
            <circle cx="262" cy="45" r="2" fill="#ffffff" filter="drop-shadow(0 0 3px #ffffff)" />
          </g>

          {/* 6. Signature District Landmark Marquee: 「AKIBA CENTRAL」 ($y: 68 - 92$) */}
          <g>
            {/* Scaffolding Supports */}
            <line x1="135" y1="68" x2="135" y2="92" stroke="#475569" strokeWidth="1.2" />
            <line x1="265" y1="68" x2="265" y2="92" stroke="#475569" strokeWidth="1.2" />

            {/* Glowing Center Signboard */}
            <rect x="125" y="68" width="150" height="24" rx="5" fill="#0d041c" stroke="url(#akiba-magenta-glow)" strokeWidth="1.8" />
            <rect x="128" y="71" width="144" height="18" rx="3" fill="#1b0833" fillOpacity="0.9" />

            {/* Cute Sparkle Icons */}
            <text x="138" y="84" fill="#fbbf24" fontSize="10" fontWeight="bold">✨</text>
            <text x="252" y="84" fill="#fbbf24" fontSize="10" fontWeight="bold">🌸</text>

            {/* Marquee Title */}
            <text
              x="200"
              y="83"
              fill="#f472b6"
              fontSize="11"
              fontFamily="var(--font-display, sans-serif)"
              fontWeight="900"
              letterSpacing="2.5"
              textAnchor="middle"
              filter="drop-shadow(0 0 6px #ec4899)"
            >
              AKIBA CENTRAL
            </text>
          </g>

          {/* 7. Tangled Urban Power Cables & Utility Poles */}
          <g stroke="#334155" strokeWidth="0.8" opacity="0.65" fill="none">
            {/* Utility Pole Left */}
            <line x1="88" y1="85" x2="88" y2="330" stroke="#475569" strokeWidth="2" />
            <line x1="80" y1="100" x2="96" y2="100" stroke="#475569" strokeWidth="1.5" />
            <line x1="82" y1="140" x2="94" y2="140" stroke="#475569" strokeWidth="1.5" />
            {/* Transformer Canister */}
            <rect x="83" y="105" width="10" height="18" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />

            {/* Utility Pole Right */}
            <line x1="312" y1="85" x2="312" y2="330" stroke="#475569" strokeWidth="2" />
            <line x1="304" y1="100" x2="320" y2="100" stroke="#475569" strokeWidth="1.5" />
            <line x1="306" y1="140" x2="318" y2="140" stroke="#475569" strokeWidth="1.5" />

            {/* Swagging Overhead Power Cables */}
            <path d="M 88 100 Q 200 130, 312 100" />
            <path d="M 88 103 Q 200 135, 312 103" />
            <path d="M 88 140 Q 200 170, 312 140" strokeDasharray="3 3" />
            <path d="M 88 100 Q 150 150, 2 120" />
            <path d="M 312 100 Q 350 145, 398 115" />
          </g>

          {/* 8. Hanging Red Paper Lanterns (Chochin / 提灯) along Lower Street Alleys */}
          {[
            { cx: 80, cy: 260 },
            { cx: 95, cy: 268 },
            { cx: 305, cy: 268 },
            { cx: 320, cy: 260 },
          ].map((lantern, idx) => (
            <g key={`lantern-${idx}`}>
              <line x1={lantern.cx} y1={lantern.cy - 10} x2={lantern.cx} y2={lantern.cy} stroke="#78350f" strokeWidth="1" />
              <ellipse cx={lantern.cx} cy={lantern.cy + 5} rx="4.5" ry="6.5" fill="#dc2626" stroke="#fca5a5" strokeWidth="0.8" filter="drop-shadow(0 0 4px #ef4444)" />
              <line x1={lantern.cx - 3} y1={lantern.cy + 5} x2={lantern.cx + 3} y2={lantern.cy + 5} stroke="#fee2e2" strokeWidth="0.8" />
              <line x1={lantern.cx} y1={lantern.cy + 11.5} x2={lantern.cx} y2={lantern.cy + 14} stroke="#991b1b" strokeWidth="0.8" />
            </g>
          ))}

          {/* 9. Foreground Street Level & Crosswalk ($y: 330 - 400$) */}
          <g>
            {/* Asphalt Base */}
            <rect x="0" y="330" width="400" height="70" fill="url(#akiba-asphalt)" />
            {/* Wet Asphalt Neon Light Reflection Puddles */}
            <ellipse cx="140" cy="365" rx="70" ry="16" fill="url(#akiba-road-reflection)" />
            <ellipse cx="260" cy="370" rx="80" ry="18" fill="url(#akiba-road-reflection)" />

            {/* Sidewalk Curbs & Yellow Tactile Paver Strips */}
            <rect x="0" y="328" width="400" height="3" fill="#334155" />
            <line x1="0" y1="331" x2="400" y2="331" stroke="#eab308" strokeWidth="1.2" strokeDasharray="4 4" strokeOpacity="0.7" />

            {/* Tokyo Shibuya/Akiba Zebra Crosswalk Stripes */}
            {[70, 105, 140, 175, 210, 245, 280, 315].map((cx, idx) => (
              <g key={`crosswalk-${idx}`}>
                <polygon
                  points={`${cx},342 ${cx + 20},342 ${cx + 14},388 ${cx - 6},388`}
                  fill="#ffffff"
                  fillOpacity="0.32"
                  stroke="#cbd5e1"
                  strokeWidth="0.5"
                  strokeOpacity="0.4"
                />
              </g>
            ))}

            {/* Street Road Markings & Stop Line */}
            <line x1="50" y1="340" x2="350" y2="340" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.45" />

            {/* Tokyo Round Manhole Cover in Street */}
            <circle cx="200" cy="375" r="10" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
            <circle cx="200" cy="375" r="7" stroke="#64748b" strokeWidth="0.8" strokeDasharray="2 2" fill="none" />
            <polygon points="200,370 204,377 196,377" fill="#ec4899" fillOpacity="0.6" />
          </g>

          {/* 10. Floating Atmospheric Cherry Blossom Petals (Sakura 🌸) */}
          {[
            { cx: 60, cy: 190, r: 3, rot: 15 },
            { cx: 110, cy: 220, r: 2.5, rot: 45 },
            { cx: 290, cy: 210, r: 3.2, rot: -30 },
            { cx: 340, cy: 240, r: 2.8, rot: 60 },
            { cx: 160, cy: 300, r: 2.4, rot: 25 },
            { cx: 240, cy: 310, r: 3, rot: -40 },
          ].map((petal, idx) => (
            <g key={`sakura-${idx}`} transform={`rotate(${petal.rot} ${petal.cx} ${petal.cy})`} opacity="0.75">
              <path
                d={`M ${petal.cx} ${petal.cy - petal.r} C ${petal.cx - petal.r * 1.2} ${petal.cy - petal.r * 0.2}, ${petal.cx - petal.r * 0.6} ${petal.cy + petal.r}, ${petal.cx} ${petal.cy + petal.r * 1.3} C ${petal.cx + petal.r * 0.6} ${petal.cy + petal.r}, ${petal.cx + petal.r * 1.2} ${petal.cy - petal.r * 0.2}, ${petal.cx} ${petal.cy - petal.r} Z`}
                fill="#f472b6"
                stroke="#ec4899"
                strokeWidth="0.5"
                filter="drop-shadow(0 0 2px #f472b6)"
              />
            </g>
          ))}
        </svg>
      );

    case 'pixel_arcade':
      // Retro 8-Bit Indie Arcade Screen & Pixel Coin Motif
      return (
        <svg
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
          className={`w-full h-full pointer-events-none select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stepped Pixel Outer Border */}
          <rect x="24" y="24" width="352" height="352" stroke={accentColor} strokeWidth="2" strokeOpacity="0.3" fill="#06050F" fillOpacity="0.4" />
          <rect x="36" y="36" width="328" height="328" stroke={accentColor} strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.2" />

          {/* Corner Pixel Corner Brackets */}
          <path d="M 28 48 L 28 28 L 48 28 M 352 28 L 372 28 L 372 48 M 372 352 L 372 372 L 352 372 M 48 372 L 28 372 L 28 352" stroke={accentColor} strokeWidth="3" strokeOpacity="0.6" strokeLinecap="square" />

          {/* Pixel Starfield */}
          {[
            [70, 70], [330, 80], [60, 290], [340, 300], [120, 110], [280, 120],
            [90, 200], [310, 210], [150, 60], [250, 70], [180, 330], [220, 340]
          ].map(([x, y], idx) => (
            <g key={idx} opacity={idx % 2 === 0 ? "0.6" : "0.35"}>
              <rect x={x - 2} y={y - 2} width="4" height="4" fill="#38BDF8" />
              <rect x={x - 5} y={y - 1} width="2" height="2" fill="#38BDF8" />
              <rect x={x + 3} y={y - 1} width="2" height="2" fill="#38BDF8" />
              <rect x={x - 1} y={y - 5} width="2" height="2" fill="#38BDF8" />
              <rect x={x - 1} y={y + 3} width="2" height="2" fill="#38BDF8" />
            </g>
          ))}

          {/* Pixel Clouds / Skyline Silhouette */}
          <g fill={accentColor} fillOpacity="0.12">
            <rect x="50" y="270" width="40" height="60" />
            <rect x="90" y="250" width="30" height="80" />
            <rect x="120" y="280" width="45" height="50" />
            <rect x="235" y="275" width="45" height="55" />
            <rect x="280" y="255" width="35" height="75" />
            <rect x="315" y="270" width="35" height="60" />
            {/* Ground line */}
            <rect x="40" y="328" width="320" height="4" fill={accentColor} fillOpacity="0.25" />
          </g>

          {/* Floating Pixel Quest Coin / Shield Emblem */}
          <g transform="translate(140, 130)">
            {/* Outer Coin Stepped Octagon */}
            <path
              d="M 30 0 L 90 0 L 120 30 L 120 90 L 90 120 L 30 120 L 0 90 L 0 30 Z"
              fill="#180B28"
              stroke={accentColor}
              strokeWidth="4"
            />
            {/* Inner Coin Ring */}
            <path
              d="M 36 12 L 84 12 L 108 36 L 108 84 L 84 108 L 36 108 L 12 84 L 12 36 Z"
              fill="#F59E0B"
              fillOpacity="0.15"
              stroke="#FBBF24"
              strokeWidth="2"
            />
            {/* Pixel Diamond Star in Center */}
            <polygon points="60,28 76,60 60,92 44,60" fill="#FBBF24" fillOpacity="0.9" />
            <polygon points="60,36 70,60 60,84 50,60" fill="#FEF08A" />
            <rect x="56" y="56" width="8" height="8" fill="#FFFFFF" />

            {/* Micro Pixel Sparkles */}
            <rect x="100" y="10" width="6" height="6" fill="#38BDF8" fillOpacity="0.8" />
            <rect x="14" y="98" width="6" height="6" fill="#F472B6" fillOpacity="0.8" />
          </g>

          {/* Retro Level Banner Label */}
          <g transform="translate(200, 285)">
            <rect x="-60" y="-12" width="120" height="24" fill="#0F0C24" stroke={accentColor} strokeWidth="1.5" rx="2" />
            <text
              x="0"
              y="5"
              textAnchor="middle"
              fill="#E9D5FF"
              fontSize="9"
              fontFamily="var(--font-pixel, monospace)"
              fontWeight="bold"
              letterSpacing="0.1em"
            >
              LEVEL 1
            </text>
          </g>
        </svg>
      );
  }
};
