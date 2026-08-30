import {
  Coins,
  Dices,
  Flame,
  Home,
  Lock,
  RotateCcw,
  Shield,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { GameRules, PresetType } from '@shared/types';
import { useSocket } from '../../context/SocketContext';

interface GameRulesStudioProps {
  isHost?: boolean;
}

export const GameRulesStudio: React.FC<GameRulesStudioProps> = ({ isHost = true }) => {
  const { gameState, updateRules } = useSocket();
  const [activeCategory, setActiveCategory] = useState<
    'economy' | 'properties' | 'movement' | 'prison' | 'chaos'
  >('economy');

  const [localRules, setLocalRules] = useState<GameRules | null>(
    gameState ? { ...gameState.rules } : null
  );

  const debounceTimerRef = useRef<any>(null);

  useEffect(() => {
    if (gameState?.rules) {
      setLocalRules({ ...gameState.rules });
    }
  }, [gameState?.rules, gameState?.preset]);

  if (!gameState || !localRules) return null;

  const currentRules = localRules;
  const currentPreset = gameState.preset;

  const handleRuleChange = (key: keyof GameRules, value: any) => {
    if (!isHost) return;
    setLocalRules((prev) => (prev ? { ...prev, [key]: value } : prev));

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      updateRules('custom', { [key]: value });
    }, 200);
  };

  const handlePresetChange = (preset: PresetType) => {
    if (!isHost) return;
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    updateRules(preset);
  };

  const PRESETS_LIST: { id: PresetType; label: string; desc: string; icon: string }[] = [
    { id: 'classic', label: 'Classic', desc: 'Standard rules & classic pace', icon: '🎩' },
    { id: 'speed_quake', label: 'Speed Quake', desc: 'Fast turns & chaos modifiers', icon: '⚡' },
    { id: 'high_roller', label: 'High Roller', desc: 'High stakes & expensive rent', icon: '💎' },
    { id: 'total_chaos', label: 'Total Chaos', desc: 'Frequent random disasters', icon: '🌋' },
    { id: 'anarchy', label: 'Anarchy', desc: 'Wild multipliers & short jail', icon: '💣' },
    { id: 'custom', label: 'Custom', desc: 'Handcrafted rules studio', icon: '🛠️' },
  ];

  return (
    <div className="w-full flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Studio Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950/60 via-slate-900 to-pink-950/40 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-inner">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white font-display">
                Game Rules Studio
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono text-[10px] font-bold border border-pink-500/30 uppercase">
                {currentPreset.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              {isHost
                ? 'Configure economy, movement, jail, and chaos rules before match launch.'
                : 'Viewing host configured match settings (read-only).'}
            </p>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {PRESETS_LIST.map((p) => {
            const isSelected = currentPreset === p.id;
            return (
              <button
                key={p.id}
                disabled={!isHost}
                onClick={() => handlePresetChange(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 btn-tactile ${
                  isSelected
                    ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30 border border-pink-400 font-display'
                    : 'bg-slate-800/70 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                } ${!isHost ? 'opacity-80 cursor-default' : ''}`}
                title={p.desc}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-800/80 bg-slate-950/50 overflow-x-auto scrollbar-none">
        {[
          { id: 'economy', label: 'Economy', icon: Coins, color: 'text-emerald-400' },
          { id: 'properties', label: 'Properties', icon: Home, color: 'text-cyan-400' },
          { id: 'movement', label: 'Movement & Turns', icon: Dices, color: 'text-amber-400' },
          { id: 'prison', label: 'Detention / Jail', icon: Lock, color: 'text-rose-400' },
          { id: 'chaos', label: 'Chaos Engine', icon: Flame, color: 'text-pink-400' },
        ].map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 btn-tactile ${
                isActive
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700 font-display'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${cat.color}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Category Content Area */}
      <div className="p-4 sm:p-5 space-y-3.5 max-h-[360px] overflow-y-auto font-sans scrollbar-thin">
        {/* 1. ECONOMY */}
        {activeCategory === 'economy' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Starting Cash */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Starting Cash Balance</div>
                  <div className="text-[11px] text-slate-400">Cash provided at match start</div>
                </div>
                <span className="font-mono text-emerald-400 font-black text-sm tabular-nums">
                  ${currentRules.startingCash}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="250"
                disabled={!isHost}
                value={currentRules.startingCash}
                onChange={(e) => handleRuleChange('startingCash', Number(e.target.value))}
                className="accent-pink-500 cursor-pointer w-full"
              />
            </div>

            {/* Passing START Reward */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Passing START Reward</div>
                  <div className="text-[11px] text-slate-400">Cash collected per loop</div>
                </div>
                <span className="font-mono text-emerald-400 font-black text-sm tabular-nums">
                  ${currentRules.goReward}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="800"
                step="50"
                disabled={!isHost}
                value={currentRules.goReward}
                onChange={(e) => handleRuleChange('goReward', Number(e.target.value))}
                className="accent-pink-500 cursor-pointer w-full"
              />
            </div>

            {/* Global Rent Multiplier */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Global Rent Multiplier</div>
                  <div className="text-[11px] text-slate-400">Scales all board rent charges</div>
                </div>
                <span className="font-mono text-cyan-400 font-black text-sm tabular-nums">
                  {currentRules.rentMultiplier}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.5"
                disabled={!isHost}
                value={currentRules.rentMultiplier}
                onChange={(e) => handleRuleChange('rentMultiplier', Number(e.target.value))}
                className="accent-cyan-500 cursor-pointer w-full"
              />
            </div>

            {/* Vacation Cash Pot Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Vacation Cash Pot</div>
                <div className="text-[11px] text-slate-400">Fines pool into Vacation space jackpot</div>
              </div>
              <input
                type="checkbox"
                disabled={!isHost}
                checked={currentRules.vacationCashPot}
                onChange={(e) => handleRuleChange('vacationCashPot', e.target.checked)}
                className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
              />
            </div>

            {/* Exact START 2x Bonus */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Exact START 2x Bonus</div>
                <div className="text-[11px] text-slate-400">Double reward if landing on space 0</div>
              </div>
              <input
                type="checkbox"
                disabled={!isHost}
                checked={currentRules.exactGoBonus}
                onChange={(e) => handleRuleChange('exactGoBonus', e.target.checked)}
                className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
              />
            </div>

            {/* Double Rent on Full Set */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Double Rent on Full Color Sets</div>
                <div className="text-[11px] text-slate-400">Doubles base rent with 0 houses</div>
              </div>
              <input
                type="checkbox"
                disabled={!isHost}
                checked={currentRules.doubleRentFullSet}
                onChange={(e) => handleRuleChange('doubleRentFullSet', e.target.checked)}
                className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
              />
            </div>

            {/* Alliances Diplomacy Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>🤝 Player Alliances</span>
                </div>
                <div className="text-[11px] text-slate-400">Allow temporary non-team alliances & rent exemptions (3+ players)</div>
              </div>
              <input
                type="checkbox"
                disabled={!isHost}
                checked={currentRules.alliancesEnabled}
                onChange={(e) => handleRuleChange('alliancesEnabled', e.target.checked)}
                className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* 2. PROPERTIES */}
        {activeCategory === 'properties' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Live Auctions Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Live Property Auctions</div>
                <div className="text-[11px] text-slate-400">Start live auction if property is passed</div>
              </div>
              <input
                type="checkbox"
                disabled={!isHost}
                checked={currentRules.allowAuctions}
                onChange={(e) => handleRuleChange('allowAuctions', e.target.checked)}
                className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
              />
            </div>

            {/* Auction Timer Duration */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Auction Countdown</div>
                  <div className="text-[11px] text-slate-400">Seconds before auction hammer drops</div>
                </div>
                <span className="font-mono text-amber-400 font-black text-sm tabular-nums">
                  {currentRules.auctionCountdown}s
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                disabled={!isHost}
                value={currentRules.auctionCountdown}
                onChange={(e) => handleRuleChange('auctionCountdown', Number(e.target.value))}
                className="accent-amber-500 cursor-pointer w-full"
              />
            </div>

            {/* Even Building Rule */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Even Building Rule</div>
                <div className="text-[11px] text-slate-400">Must build houses evenly across color set</div>
              </div>
              <input
                type="checkbox"
                disabled={!isHost}
                checked={currentRules.evenBuilding}
                onChange={(e) => handleRuleChange('evenBuilding', e.target.checked)}
                className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
              />
            </div>

            {/* Mortgage Interest Rate */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Mortgage Fee Percentage</div>
                  <div className="text-[11px] text-slate-400">Interest fee to unmortgage</div>
                </div>
                <span className="font-mono text-pink-400 font-black text-sm tabular-nums">
                  {Math.round(currentRules.mortgageInterestRate * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.30"
                step="0.05"
                disabled={!isHost}
                value={currentRules.mortgageInterestRate}
                onChange={(e) => handleRuleChange('mortgageInterestRate', Number(e.target.value))}
                className="accent-pink-500 cursor-pointer w-full"
              />
            </div>
          </div>
        )}

        {/* 3. MOVEMENT & TURNS */}
        {activeCategory === 'movement' && (
          <div className="space-y-3">
            {/* Turn Time Limit Selector */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Authoritative Turn Time Limit</div>
                  <div className="text-[11px] text-slate-400">Auto-skips inactive player when timer expires</div>
                </div>
                <span className="font-mono text-cyan-400 font-black text-xs px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 tabular-nums">
                  {currentRules.turnTimeLimitSeconds === 0 ? 'Unlimited' : `${currentRules.turnTimeLimitSeconds}s`}
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { label: '30s', val: 30 },
                  { label: '45s', val: 45 },
                  { label: '60s (Default)', val: 60 },
                  { label: '90s', val: 90 },
                  { label: '120s', val: 120 },
                  { label: 'Unlimited', val: 0 },
                ].map((t) => (
                  <button
                    key={t.val}
                    type="button"
                    disabled={!isHost}
                    onClick={() => handleRuleChange('turnTimeLimitSeconds', t.val)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition btn-tactile ${
                      currentRules.turnTimeLimitSeconds === t.val
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

              {/* 12-Sided Dice Mode Toggle */}
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>🎲 12-Sided Dice Mode (2×d12)</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[9px] font-bold border border-cyan-500/40">
                      {currentRules.diceMode === '2d12' ? '2–24 RANGE' : '2–12 RANGE (2d6)'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">Rolls 2×12-sided dice for high-velocity movement across the board</div>
                </div>
                <input
                  type="checkbox"
                  disabled={!isHost}
                  checked={currentRules.diceMode === '2d12'}
                  onChange={(e) => handleRuleChange('diceMode', e.target.checked ? '2d12' : '2d6')}
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>

              {/* Public Trade Spectating Toggle */}
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>👁️ Public Trade Spectating</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Allows non-participating players to view ongoing trade offers in read-only mode</div>
                </div>
                <input
                  type="checkbox"
                  disabled={!isHost}
                  checked={currentRules.spectateTrades || false}
                  onChange={(e) => handleRuleChange('spectateTrades', e.target.checked)}
                  className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
                />
              </div>

              {/* Snake Eyes Bonus Cash */}
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Snake Eyes Bonus Cash</div>
                    <div className="text-[11px] text-slate-400">Bonus rewarded on rolling 1 + 1</div>
                  </div>
                  <span className="font-mono text-emerald-400 font-black text-sm tabular-nums">
                    ${currentRules.snakeEyesBonusCash}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="50"
                  disabled={!isHost}
                  value={currentRules.snakeEyesBonusCash}
                  onChange={(e) => handleRuleChange('snakeEyesBonusCash', Number(e.target.value))}
                  className="accent-emerald-500 cursor-pointer w-full"
                />
              </div>

              {/* Max Doubles Before Detention */}
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Max Doubles Before Detention</div>
                    <div className="text-[11px] text-slate-400">Consecutive doubles allowed</div>
                  </div>
                  <span className="font-mono text-amber-400 font-black text-sm tabular-nums">
                    {currentRules.maxDoublesBeforePrison}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  disabled={!isHost}
                  value={currentRules.maxDoublesBeforePrison}
                  onChange={(e) => handleRuleChange('maxDoublesBeforePrison', Number(e.target.value))}
                  className="accent-amber-500 cursor-pointer w-full"
                />
              </div>
            </div>
        )}

        {/* 4. DETENTION / JAIL */}
        {activeCategory === 'prison' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Collect Rent in Prison */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Collect Rent While in Detention</div>
                <div className="text-[11px] text-slate-400">Can collect rent while locked up</div>
              </div>
              <input
                type="checkbox"
                disabled={!isHost}
                checked={currentRules.collectRentInPrison}
                onChange={(e) => handleRuleChange('collectRentInPrison', e.target.checked)}
                className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
              />
            </div>

            {/* Prison Bail Amount */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Detention Bail Amount</div>
                  <div className="text-[11px] text-slate-400">Fee for immediate release</div>
                </div>
                <span className="font-mono text-emerald-400 font-black text-sm tabular-nums">
                  ${currentRules.prisonBailAmount}
                </span>
              </div>
              <input
                type="range"
                min="25"
                max="300"
                step="25"
                disabled={!isHost}
                value={currentRules.prisonBailAmount}
                onChange={(e) => handleRuleChange('prisonBailAmount', Number(e.target.value))}
                className="accent-emerald-500 cursor-pointer w-full"
              />
            </div>

            {/* Max Prison Turns */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Maximum Turns in Detention</div>
                  <div className="text-[11px] text-slate-400">Turns to roll doubles before mandatory bail</div>
                </div>
                <span className="font-mono text-amber-400 font-black text-sm tabular-nums">
                  {currentRules.prisonTurnsMax} Turns
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                disabled={!isHost}
                value={currentRules.prisonTurnsMax}
                onChange={(e) => handleRuleChange('prisonTurnsMax', Number(e.target.value))}
                className="accent-amber-500 cursor-pointer w-full"
              />
            </div>
          </div>
        )}

        {/* 5. CHAOS ENGINE */}
        {activeCategory === 'chaos' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 border border-pink-500/30 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5 font-display">
                  <Flame className="w-4 h-4 text-pink-400" />
                  <span>Enable Chaos Engine</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Triggers random game-wide modifiers (Market Crash, Rent Roulette, Blood Money)
                </div>
              </div>
              <input
                type="checkbox"
                disabled={!isHost}
                checked={currentRules.chaosEventsEnabled}
                onChange={(e) => handleRuleChange('chaosEventsEnabled', e.target.checked)}
                className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
              />
            </div>

            {currentRules.chaosEventsEnabled && (
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Chaos Strike Frequency</div>
                    <div className="text-[11px] text-slate-400">Triggers an event every N turns</div>
                  </div>
                  <span className="font-mono text-pink-400 font-black text-sm tabular-nums">
                    Every {currentRules.chaosEventFrequencyTurns} Turns
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  disabled={!isHost}
                  value={currentRules.chaosEventFrequencyTurns}
                  onChange={(e) => handleRuleChange('chaosEventFrequencyTurns', Number(e.target.value))}
                  className="accent-pink-500 cursor-pointer w-full"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
