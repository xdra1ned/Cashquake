import {
  ArrowLeftRight,
  ArrowRight,
  Award,
  BookOpen,
  Building,
  Building2,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Coins,
  DollarSign,
  Flame,
  Gavel,
  Handshake,
  HelpCircle,
  Home,
  Hotel,
  Info,
  Layers,
  Lock,
  Percent,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Skull,
  Sparkles,
  Umbrella,
  Unlock,
  User,
  X,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSectionId?: string;
}

interface GuideSection {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  icon: string;
  badge: string;
  summary: string;
  diagram: React.ReactNode;
  rules: { title: string; text: string; highlight?: boolean }[];
  proTip?: string;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  initialSectionId,
}) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(() => {
    if (!initialSectionId) return 0;
    const idx = GUIDE_SECTIONS.findIndex((s) => s.id === initialSectionId);
    return idx >= 0 ? idx : 0;
  });

  if (!isOpen) return null;

  const currentSection = GUIDE_SECTIONS[activeSectionIndex] || GUIDE_SECTIONS[0];

  const handleNext = () => {
    if (activeSectionIndex < GUIDE_SECTIONS.length - 1) {
      setActiveSectionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeSectionIndex > 0) {
      setActiveSectionIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] rounded-3xl bg-slate-900 border-2 border-slate-700/80 shadow-2xl overflow-hidden flex flex-col animate-fade-in"
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-display tracking-tight">
                  How to Play Cashquake
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                  Section {currentSection.number} of {GUIDE_SECTIONS.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Master property trading, building monopolies, and bank tactics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition btn-tactile"
            title="Close Guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Navigation Tabs (Horizontal Scrollable Pills) */}
        <div className="px-3 sm:px-6 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          {GUIDE_SECTIONS.map((section, idx) => {
            const isActive = idx === activeSectionIndex;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSectionIndex(idx)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition btn-tactile ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <span>{section.icon}</span>
                <span className="text-[11px] font-sans">{section.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin">
          {/* Section Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/90">
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
                {currentSection.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    {currentSection.badge}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white font-display">
                  {currentSection.title}
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-300 sm:max-w-md leading-relaxed font-sans">
              {currentSection.summary}
            </p>
          </div>

          {/* Visual Diagram Representation Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>VISUAL MECHANIC OVERVIEW</span>
            </div>
            {currentSection.diagram}
          </div>

          {/* Core Rules List */}
          <div className="space-y-2.5">
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
              <Info className="w-3 h-3 text-cyan-400" />
              <span>KEY GAME RULES</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {currentSection.rules.map((rule, rIdx) => (
                <div
                  key={rIdx}
                  className={`p-3 rounded-xl border leading-relaxed ${
                    rule.highlight
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${
                        rule.highlight ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    />
                    <h4 className="text-xs font-bold text-white font-sans">{rule.title}</h4>
                  </div>
                  <p className="text-[11.5px] text-slate-300 leading-normal pl-5">
                    {rule.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Pro Tip */}
          {currentSection.proTip && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-slate-950/40 border border-cyan-500/30 flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono uppercase font-black tracking-wider text-cyan-300 block mb-0.5">
                  Tycoon Pro-Tip
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {currentSection.proTip}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={handlePrev}
            disabled={activeSectionIndex === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 text-xs font-bold transition btn-tactile border border-slate-700"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Step Dots */}
          <div className="flex items-center gap-1.5">
            {GUIDE_SECTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSectionIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === activeSectionIndex
                    ? 'w-6 bg-cyan-400 shadow-sm shadow-cyan-400/50'
                    : 'bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Jump to section ${i + 1}`}
              />
            ))}
          </div>

          {activeSectionIndex === GUIDE_SECTIONS.length - 1 ? (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition btn-tactile shadow-md"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Let's Play!</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition btn-tactile shadow-md"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 9 COMPREHENSIVE GUIDE SECTIONS (WITH AUTHENTIC CASHQUAKE UI MINIATURES)
// ============================================================================

const GUIDE_SECTIONS: GuideSection[] = [
  // 1. Turn Sequence & Movement
  {
    id: 'turn_sequence',
    number: 1,
    title: 'Your Turn & Movement',
    shortTitle: 'Turn Flow',
    icon: '🎲',
    badge: 'Core Mechanic',
    summary:
      'Roll the dice, hop across 40 board spaces, collect passing rewards, and trigger space actions.',
    diagram: (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 py-2">
        {/* Step 1 */}
        <div className="flex-1 w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xl mb-1">👤</div>
          <div className="text-[11px] font-bold text-white">1. Active Player</div>
          <div className="text-[9.5px] text-slate-400 mt-0.5">Turn timer starts ticking</div>
        </div>

        <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 rotate-90 sm:rotate-0" />

        {/* Step 2: Mini Dice Roller */}
        <div className="flex-1 w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold text-xs flex items-center justify-center shadow-inner">
              4
            </div>
            <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold text-xs flex items-center justify-center shadow-inner">
              4
            </div>
          </div>
          <div className="text-[11px] font-bold text-cyan-300">2. Roll 2d6 Dice</div>
          <div className="text-[9.5px] text-amber-300 font-mono">Doubles = Extra Turn!</div>
        </div>

        <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 rotate-90 sm:rotate-0" />

        {/* Step 3: Movement */}
        <div className="flex-1 w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xl mb-1">👣</div>
          <div className="text-[11px] font-bold text-white">3. Pawn Hopping</div>
          <div className="text-[9.5px] text-slate-400 mt-0.5">Move clockwise across tiles</div>
        </div>

        <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 rotate-90 sm:rotate-0" />

        {/* Step 4: Land */}
        <div className="flex-1 w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xl mb-1">🎯</div>
          <div className="text-[11px] font-bold text-emerald-300">4. Space Action</div>
          <div className="text-[9.5px] text-slate-400 mt-0.5">Buy, Pay Rent, or Draw Card</div>
        </div>
      </div>
    ),
    rules: [
      {
        title: 'Rolling Doubles Grants Extra Turns',
        text: 'If both dice show the same number, you take another turn immediately after resolving the current space.',
      },
      {
        title: '3 Consecutive Doubles Penalty',
        text: 'Rolling 3 consecutive doubles in a single turn triggers a speeding violation and sends you straight to Detention.',
        highlight: true,
      },
      {
        title: 'Passing START Grants +$200',
        text: 'Every complete lap around the board awards +$200 cash. Landing exactly on START awards double (+$400) if enabled.',
      },
      {
        title: 'Snake Eyes Bonus',
        text: 'Rolling double 1s awards an immediate cash bonus when configured in your match rules.',
      },
    ],
    proTip:
      'Keep an eye on the turn countdown timer in the board center. If your timer runs out, the game will automatically resolve your turn or decline unowned property purchases.',
  },

  // 2. Properties & Monopolies
  {
    id: 'properties',
    number: 2,
    title: 'Properties & Monopolies',
    shortTitle: 'Properties',
    icon: '🏠',
    badge: 'Core Revenue',
    summary:
      'Buy unowned spaces to grow your territory, collect rent from visitors, and complete color sets to double base payouts.',
    diagram: (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-1">
        {/* Miniature Cashquake Property Card Representation */}
        <div className="w-44 rounded-xl bg-slate-900 border border-slate-700 shadow-md overflow-hidden text-center shrink-0">
          <div className="h-5 bg-[#38BDF8] border-b border-black/30 flex items-center justify-center text-[9px] font-bold text-slate-950 font-mono">
            SKYLINE DISTRICT
          </div>
          <div className="p-2 space-y-1">
            <div className="text-xs font-bold text-white">Sapphire Tower</div>
            <div className="text-xs font-mono font-black text-emerald-400">$120</div>
            <div className="text-[9.5px] text-slate-400 font-mono border-t border-slate-800 pt-1 flex justify-between">
              <span>Base Rent:</span>
              <span className="text-white font-bold">$8</span>
            </div>
            <div className="text-[9.5px] text-amber-300 font-mono flex justify-between">
              <span>Full Set:</span>
              <span className="font-bold">$16 (2×)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 max-w-xs text-xs">
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-[#38BDF8] shrink-0" />
            <div className="text-slate-300 text-[11px]">
              <span className="font-bold text-white">Full Color Set</span> = Double base rent on unimproved properties
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <span className="text-base">🚆</span>
            <div className="text-slate-300 text-[11px]">
              <span className="font-bold text-white">Railroads</span> scale with ownership: $25 → $50 → $100 → $200
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <span className="text-base">⚡</span>
            <div className="text-slate-300 text-[11px]">
              <span className="font-bold text-white">Utilities</span> charge 4× (1 owned) or 10× (both owned) dice roll
            </div>
          </div>
        </div>
      </div>
    ),
    rules: [
      {
        title: 'Buying Unowned Properties',
        text: 'When landing on an unowned property, railroad, or utility, you can buy it immediately at the listed price.',
      },
      {
        title: 'Collecting Rent',
        text: 'When an opponent lands on a property you own, they automatically pay you the current rent value.',
      },
      {
        title: 'Monopoly Sets Double Rent',
        text: 'Owning all properties in a single color group doubles the base unimproved rent and unlocks building construction.',
        highlight: true,
      },
      {
        title: 'Property vs Ownership Display',
        text: 'Properties retain their original color band (e.g. Cyan), while owner indicators appear in the owner’s assigned color badge.',
      },
    ],
    proTip:
      'Prioritize completing color sets through trading early in the match. Monopolies are the sole requirement for building houses.',
  },

  // 3. Houses & Hotels
  {
    id: 'houses_hotels',
    number: 3,
    title: 'Houses & Hotels',
    shortTitle: 'Buildings',
    icon: '🏘️',
    badge: 'Upgrades',
    summary:
      'Construct buildings on complete color sets to scale rent from minor nuisance into lethal game-ending payouts.',
    diagram: (
      <div className="flex flex-col gap-2 py-1">
        {/* Progression Track */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5 text-center">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-slate-400 text-sm mb-0.5">🏷️</div>
            <div className="text-[10px] font-bold text-slate-300">Unimproved</div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold">$10</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-sm mb-0.5">🏠</div>
            <div className="text-[10px] font-bold text-slate-200">1 House</div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold">$50</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-sm mb-0.5">🏠🏠</div>
            <div className="text-[10px] font-bold text-slate-200">2 Houses</div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold">$150</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-sm mb-0.5">🏠🏠🏠</div>
            <div className="text-[10px] font-bold text-slate-200">3 Houses</div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold">$450</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-sm mb-0.5">🏠🏠🏠🏠</div>
            <div className="text-[10px] font-bold text-slate-200">4 Houses</div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold">$625</div>
          </div>
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/40">
            <div className="text-sm mb-0.5">🏨</div>
            <div className="text-[10px] font-bold text-amber-300">1 Hotel</div>
            <div className="text-[10px] font-mono text-amber-400 font-black">$750</div>
          </div>
        </div>
      </div>
    ),
    rules: [
      {
        title: 'Full Color Set Required',
        text: 'You can only construct buildings once you own all properties in that color group and none are mortgaged.',
      },
      {
        title: 'Even Building Rule',
        text: 'You must build evenly across the set. You cannot place a 2nd house on a tile until all tiles in the group have 1 house.',
        highlight: true,
      },
      {
        title: 'Hotel Maximum Cap',
        text: 'After building 4 houses on a property, the next upgrade converts all 4 houses into 1 Hotel (🏨), unlocking maximum rent.',
      },
      {
        title: 'Selling Buildings for 50% Refund',
        text: 'During your turn, you can sell houses and hotels back to the bank for half of their initial purchase cost (even selling applies).',
      },
    ],
    proTip:
      '3 Houses is the classic sweet spot where rent jumps exponentially compared to building cost. Focus on reaching 3 houses per property quickly.',
  },

  // 4. Money & Debt
  {
    id: 'money_debt',
    number: 4,
    title: 'Money, Taxes & Debt',
    shortTitle: 'Debt',
    icon: '💰',
    badge: 'Survival',
    summary:
      'Manage liquidity carefully. If an obligation exceeds your cash, enter Debt Mode and liquidate assets before continuing.',
    diagram: (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 py-1">
        <div className="flex-1 w-full p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center">
          <div className="text-base font-mono font-black text-emerald-400">+$250 Cash</div>
          <div className="text-[10px] text-emerald-300 font-bold mt-0.5">Positive Balance</div>
          <div className="text-[9px] text-slate-400">Free to roll & invest</div>
        </div>

        <ArrowRight className="w-4 h-4 text-rose-400 shrink-0 rotate-90 sm:rotate-0" />

        <div className="flex-1 w-full p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-center">
          <div className="text-base font-mono font-black text-rose-400">-$380 Debt</div>
          <div className="text-[10px] text-rose-300 font-bold mt-0.5">⚠️ Debt Mode</div>
          <div className="text-[9px] text-rose-200">Cannot roll or end turn</div>
        </div>

        <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 rotate-90 sm:rotate-0" />

        <div className="flex-1 w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="flex justify-center gap-1.5 text-xs text-cyan-300 font-mono font-bold mb-0.5">
            <span>🔒 Mortgage</span>
            <span>•</span>
            <span>🤝 Trade</span>
          </div>
          <div className="text-[10px] font-bold text-white">Emergency Liquidation</div>
          <div className="text-[9px] text-slate-400">Raise cash back to &ge; $0</div>
        </div>
      </div>
    ),
    rules: [
      {
        title: 'Negative Balance Triggers Debt Mode',
        text: 'If a rent or tax payment exceeds your wallet, your balance becomes negative. You cannot end turn or roll while in debt.',
        highlight: true,
      },
      {
        title: 'Resolving Debt Options',
        text: 'To resolve debt: mortgage unimproved properties (50% value), sell houses (50% cost), or propose emergency trades for cash.',
      },
      {
        title: 'Bankruptcy on Insolvency',
        text: 'If your total liquidatable asset value cannot satisfy your negative debt, you must declare Bankruptcy.',
      },
      {
        title: 'Tax Spaces',
        text: 'Landing on Tax spaces deducts the specified flat tax from your cash reserves.',
      },
    ],
    proTip:
      'Always maintain a safety cash cushion when moving through opponent-heavy monopoly territories to avoid forced liquidation.',
  },

  // 5. Auctions
  {
    id: 'auctions',
    number: 5,
    title: 'Live Property Auctions',
    shortTitle: 'Auctions',
    icon: '🔨',
    badge: 'Competitive',
    summary:
      'Whenever a player declines to buy an unowned property, an open real-time auction starts for all active players.',
    diagram: (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-1">
        {/* Miniature Live Auction UI Representation */}
        <div className="w-64 rounded-2xl bg-slate-900 border-2 border-amber-500/40 p-3 shadow-lg text-center space-y-2 shrink-0">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold">
            <span className="text-amber-400 flex items-center gap-1">
              <Gavel className="w-3 h-3" /> LIVE AUCTION
            </span>
            <span className="text-slate-400">⏱️ 8s left</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-xs font-bold text-white">Cyber Plaza</div>
            <div className="text-sm font-mono font-black text-amber-300 mt-0.5">Highest Bid: $90</div>
            <div className="text-[9.5px] text-cyan-400 font-medium">Leader: Player 2 (Cyan)</div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono">
            <span className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              +$10
            </span>
            <span className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              +$50
            </span>
            <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              +$100
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-300 space-y-1.5 max-w-xs">
          <div className="font-bold text-white text-sm">Real-time Bidding Process</div>
          <p className="text-[11.5px] text-slate-300 leading-relaxed">
            1. Unbought properties start at <strong>$10</strong> opening bid.<br />
            2. Any active player with enough cash can place higher bids.<br />
            3. When countdown reaches 0, the highest bidder wins and pays their bid!
          </p>
        </div>
      </div>
    ),
    rules: [
      {
        title: 'Declined Properties Go to Auction',
        text: 'If the landed player clicks "Auction / Pass", or their turn action timer expires, an auction immediately begins.',
      },
      {
        title: 'All Active Players Can Bid',
        text: 'All non-bankrupt players can participate in the auction, including the player who initially declined to purchase it.',
      },
      {
        title: '$10 Minimum Opening Bid',
        text: 'Auctions open at $10. Each subsequent bid must strictly exceed the current highest bid amount.',
      },
      {
        title: 'Timer Extension on Late Bids',
        text: 'Bids placed in the closing seconds give other players a brief window to counter before the gavel falls.',
      },
    ],
    proTip:
      'Use auctions to snatch valuable color set pieces at a steep discount when opponents are low on cash.',
  },

  // 6. Trading
  {
    id: 'trading',
    number: 6,
    title: 'Trading & Custom Deals',
    shortTitle: 'Trading',
    icon: '🔄',
    badge: 'Diplomacy',
    summary:
      'Negotiate custom asset exchanges with any opponent or bot, combining deeds, cash, and prison cards.',
    diagram: (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-1">
        {/* Miniature Trading Interface Representation */}
        <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-3 shadow-md">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 mb-2">
            <span>YOUR OFFER</span>
            <ArrowLeftRight className="w-3.5 h-3.5 text-pink-400" />
            <span>THEIR OFFER</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1 text-[10px] text-cyan-300 font-bold">
                <div className="w-2 h-2 rounded-full bg-[#EC4899]" />
                <span className="truncate">Neon Blvd</span>
              </div>
              <div className="text-[10px] font-mono text-emerald-400 font-bold">+$150 Cash</div>
            </div>

            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1 text-[10px] text-amber-300 font-bold">
                <div className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                <span className="truncate">Azure Port</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">Deed Only</div>
            </div>
          </div>
        </div>
      </div>
    ),
    rules: [
      {
        title: 'Open Trade Modal Anytime',
        text: 'Access the Trade menu from the board toolbar to propose a trade to any active opponent or bot.',
      },
      {
        title: 'Multi-Asset Exchange',
        text: 'You can bundle multiple properties, cash balances, and "Get Out of Prison Free" cards in a single deal.',
      },
      {
        title: 'Accept, Decline, or Counter',
        text: 'The recipient receives an interactive prompt to accept, decline, or adjust terms before concluding the deal.',
      },
      {
        title: 'Fair Bot Evaluation',
        text: 'Bots evaluate proposed trades using calculated economic value, property development potential, and set synergy.',
      },
    ],
    proTip:
      'Mutual monopolies are the most common trade agreement: give an opponent their 3rd piece in exchange for your 3rd piece, creating two competing superpowers.',
  },

  // 7. Mortgages
  {
    id: 'mortgages',
    number: 7,
    title: 'Mortgages & Liquidation',
    shortTitle: 'Mortgages',
    icon: '🏦',
    badge: 'Financing',
    summary:
      'Mortgage properties for an instant 50% cash payout, and unmortgage later by repaying principal plus interest.',
    diagram: (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-1">
        {/* Active Deed */}
        <div className="flex-1 w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xs font-bold text-white mb-0.5">Active Property</div>
          <div className="text-[10px] font-mono text-slate-400">Value: $200</div>
          <div className="text-[9.5px] text-emerald-400 font-bold mt-1">Collects Rent</div>
        </div>

        <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 rotate-90 sm:rotate-0" />

        {/* Mortgaged */}
        <div className="flex-1 w-full p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-center">
          <div className="text-xs font-bold text-rose-300 mb-0.5 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-rose-400" /> MORTGAGED
          </div>
          <div className="text-[10px] font-mono text-emerald-400 font-black">+$100 Instant Cash</div>
          <div className="text-[9.5px] text-rose-400 font-bold mt-1">$0 Rent Collected</div>
        </div>

        <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 rotate-90 sm:rotate-0" />

        {/* Unmortgaged */}
        <div className="flex-1 w-full p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center">
          <div className="text-xs font-bold text-emerald-300 mb-0.5 flex items-center justify-center gap-1">
            <Unlock className="w-3 h-3 text-emerald-400" /> UNMORTGAGE
          </div>
          <div className="text-[10px] font-mono text-amber-300 font-bold">Pay $110 ($100 + 10%)</div>
          <div className="text-[9.5px] text-emerald-300 mt-1">Rent Restored</div>
        </div>
      </div>
    ),
    rules: [
      {
        title: '50% Mortgage Payout',
        text: 'Mortgaging a property instantly gives you 50% of its face value in cash from the bank.',
      },
      {
        title: 'No Rent Collected While Mortgaged',
        text: 'Opponents landing on a mortgaged property pay $0 rent. Mortgaged spaces are marked with a prominent stamp.',
        highlight: true,
      },
      {
        title: 'Must Sell Buildings in Group First',
        text: 'You cannot mortgage a property if any property in its color group still has houses or hotels.',
      },
      {
        title: 'Unmortgage with +10% Interest',
        text: 'To restore a property to active status, you pay back the mortgage value plus the interest rate (default: +10%).',
      },
    ],
    proTip:
      'Mortgage isolated single properties that opponents rarely land on first before mortgaging complete monopoly sets.',
  },

  // 8. Bankruptcy & Spectator Mode
  {
    id: 'bankruptcy',
    number: 8,
    title: 'Bankruptcy & Spectator Mode',
    shortTitle: 'Bankruptcy',
    icon: '💥',
    badge: 'End Game',
    summary:
      'Bankruptcy eliminates a player from active play. All properties return to the bank as unowned, and the player transitions to spectator mode.',
    diagram: (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-1">
        <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-center space-y-1.5 max-w-xs">
          <Skull className="w-7 h-7 text-rose-400 mx-auto" />
          <div className="text-sm font-black text-rose-300 font-display">Player Bankrupt</div>
          <p className="text-[11px] text-slate-300 leading-snug">
            All deeds return to the bank as unowned. Bankrupt players become spectators.
          </p>
        </div>

        <div className="text-xs text-slate-300 space-y-2 max-w-xs">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-bold text-white">Properties Return to Bank:</span>
            <div className="text-[11px] text-slate-400 mt-0.5">
              All owned properties become unowned spaces again for other players to acquire.
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-bold text-white">Spectator Transition:</span>
            <div className="text-[11px] text-slate-400 mt-0.5">
              You stay in the room to watch rolls, auctions, chaos events, and chat in real-time.
            </div>
          </div>
        </div>
      </div>
    ),
    rules: [
      {
        title: 'Voluntary & Debt Bankruptcy',
        text: 'Bankruptcy can occur when an outstanding negative debt cannot be paid, or voluntarily at any point in the match via the Surrender action.',
      },
      {
        title: 'Properties Return to the Bank',
        text: 'All properties owned by the bankrupt player immediately return to the Bank in an unowned state with all mortgages and buildings cleared. They become available for other players to purchase according to standard rules.',
        highlight: true,
      },
      {
        title: 'Spectator Mode & Clean Exit',
        text: 'Bankrupt players are not kicked from the match. You remain connected in Spectator Mode to follow the live game, with an Exit Match option available at any time.',
      },
      {
        title: 'Automatic Turn Transfer',
        text: 'If a player declares bankruptcy during their active turn, turn control immediately and cleanly transfers to the next eligible active player.',
      },
      {
        title: 'Last Tycoon Standing Wins',
        text: 'The match concludes immediately when only one active, non-bankrupt player remains in the game.',
      },
    ],
    proTip:
      'If you find yourself facing large debts, check your portfolio first to see if mortgaging properties or selling houses can keep you in the game.',
  },

  // 9. Special Spaces & Modifiers
  {
    id: 'special_spaces',
    number: 9,
    title: 'Special Spaces & Modifiers',
    shortTitle: 'Special Spaces',
    icon: '⚡',
    badge: 'Modifiers',
    summary:
      'Vacation Cash Pots, Detention mechanics, Chance/Fortune draws, and optional Tycoon Alliances.',
    diagram: (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1">
        {/* Vacation */}
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <span className="text-xl">🏖️</span>
          <div className="text-xs font-bold text-amber-300">Vacation Pot</div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Fines & taxes collect in the pot. Land on Vacation to claim the full jackpot!
          </p>
        </div>

        {/* Prison */}
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <span className="text-xl">🚔</span>
          <div className="text-xs font-bold text-rose-300">Detention</div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Escape via doubles, $50 bail, or card. Force released after max turns.
          </p>
        </div>

        {/* Cards & Chaos */}
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <span className="text-xl">❓💎</span>
          <div className="text-xs font-bold text-pink-300">Cards & Chaos</div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Draw Chance & Fortune cards triggering global market shifts, bonuses, or taxes.
          </p>
        </div>
      </div>
    ),
    rules: [
      {
        title: 'Vacation Cash Pot (Free Parking)',
        text: 'When enabled in room rules, all paid fines, taxes, and bail accumulate in the center pot for lucky visitors.',
      },
      {
        title: 'Escaping Detention',
        text: 'You can leave jail by: rolling doubles on your turn, paying $50 bail before rolling, using a Get Out of Jail card, or serving max turns.',
      },
      {
        title: 'Chance ❓ and Fortune 💎 Cards',
        text: 'Drawing cards can award windfalls, repair taxes per building, teleports, or global chaos events (Market Crash, Rent Roulette).',
      },
      {
        title: 'Tycoon Alliances (3+ Players)',
        text: 'When alliances are enabled, tycoons can sign mutual rent exemption pacts. Alliances dissolve automatically when 2 players remain.',
      },
    ],
    proTip:
      'In the late game with high board rents, staying in Detention for a turn or two can actually protect your cash while opponents navigate your hotel gauntlet.',
  },
];
