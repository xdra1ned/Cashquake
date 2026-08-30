import { Check, Flame, Sliders, X } from 'lucide-react';
import React, { useState } from 'react';
import { GameRules, PresetType } from '@shared/types';
import { useSocket } from '../../context/SocketContext';

interface RoomSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoomSettingsModal: React.FC<RoomSettingsModalProps> = ({ isOpen, onClose }) => {
  const { gameState, updateRules } = useSocket();
  const [activeCategory, setActiveCategory] = useState<'economy' | 'properties' | 'movement' | 'prison' | 'chaos'>('economy');

  if (!isOpen || !gameState) return null;

  const currentRules = gameState.rules;

  const handleRuleChange = (key: keyof GameRules, value: any) => {
    updateRules('custom', { [key]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xl text-purple-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Custom Game Rule Studio</h2>
              <p className="text-xs text-slate-400">Configure every tiny nuance of your match</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Navigation */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800 bg-slate-950/40 overflow-x-auto">
          {[
            { id: 'economy', label: '💰 Economy' },
            { id: 'properties', label: '🏠 Properties' },
            { id: 'movement', label: '🎲 Movement & Turns' },
            { id: 'prison', label: '🚔 Detention / Jail' },
            { id: 'chaos', label: '🧨 Chaos Engine' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Category Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Economy Settings */}
          {activeCategory === 'economy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Starting Cash Balance</div>
                  <div className="text-xs text-slate-400">Amount each player begins with</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-emerald-400 font-bold text-sm">${currentRules.startingCash}</span>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="250"
                    value={currentRules.startingCash}
                    onChange={(e) => handleRuleChange('startingCash', Number(e.target.value))}
                    className="accent-pink-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Passing START Reward</div>
                  <div className="text-xs text-slate-400">Cash collected when looping around the board</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-emerald-400 font-bold text-sm">${currentRules.goReward}</span>
                  <input
                    type="range"
                    min="100"
                    max="800"
                    step="50"
                    value={currentRules.goReward}
                    onChange={(e) => handleRuleChange('goReward', Number(e.target.value))}
                    className="accent-pink-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Exact START Landing 2x Bonus</div>
                  <div className="text-xs text-slate-400">Double reward if a player lands directly on space 0</div>
                </div>
                <input
                  type="checkbox"
                  checked={currentRules.exactGoBonus}
                  onChange={(e) => handleRuleChange('exactGoBonus', e.target.checked)}
                  className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Vacation Cash Pot</div>
                  <div className="text-xs text-slate-400">All tax and penalty fees pool into Vacation space</div>
                </div>
                <input
                  type="checkbox"
                  checked={currentRules.vacationCashPot}
                  onChange={(e) => handleRuleChange('vacationCashPot', e.target.checked)}
                  className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Double Rent on Full Color Sets</div>
                  <div className="text-xs text-slate-400">Base rent is doubled if monopoly is owned with 0 houses</div>
                </div>
                <input
                  type="checkbox"
                  checked={currentRules.doubleRentFullSet}
                  onChange={(e) => handleRuleChange('doubleRentFullSet', e.target.checked)}
                  className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">🤝 Player Alliances</div>
                  <div className="text-xs text-slate-400">Allow temporary non-team alliances and directional property rent exemptions (3+ players)</div>
                </div>
                <input
                  type="checkbox"
                  checked={currentRules.alliancesEnabled}
                  onChange={(e) => handleRuleChange('alliancesEnabled', e.target.checked)}
                  className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Global Rent Multiplier</div>
                  <div className="text-xs text-slate-400">Scale all rental prices across the entire board</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-cyan-400 font-bold text-sm">{currentRules.rentMultiplier}x</span>
                  <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.5"
                    value={currentRules.rentMultiplier}
                    onChange={(e) => handleRuleChange('rentMultiplier', Number(e.target.value))}
                    className="accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Properties Settings */}
          {activeCategory === 'properties' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Live Property Auctions</div>
                  <div className="text-xs text-slate-400">If a player passes on buying, open live auction for all</div>
                </div>
                <input
                  type="checkbox"
                  checked={currentRules.allowAuctions}
                  onChange={(e) => handleRuleChange('allowAuctions', e.target.checked)}
                  className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Auction Timer Duration</div>
                  <div className="text-xs text-slate-400">Seconds before auction hammer drops</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-amber-400 font-bold text-sm">{currentRules.auctionCountdown}s</span>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={currentRules.auctionCountdown}
                    onChange={(e) => handleRuleChange('auctionCountdown', Number(e.target.value))}
                    className="accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Even Building Rule</div>
                  <div className="text-xs text-slate-400">Must build houses evenly across a color group</div>
                </div>
                <input
                  type="checkbox"
                  checked={currentRules.evenBuilding}
                  onChange={(e) => handleRuleChange('evenBuilding', e.target.checked)}
                  className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Mortgage Interest Rate</div>
                  <div className="text-xs text-slate-400">Extra fee percentage required to unmortgage</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-pink-400 font-bold text-sm">{Math.round(currentRules.mortgageInterestRate * 100)}%</span>
                  <input
                    type="range"
                    min="0.0"
                    max="0.30"
                    step="0.05"
                    value={currentRules.mortgageInterestRate}
                    onChange={(e) => handleRuleChange('mortgageInterestRate', Number(e.target.value))}
                    className="accent-pink-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Movement Settings */}
          {activeCategory === 'movement' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white font-display">Turn Time Limit</div>
                    <div className="text-xs text-slate-400">Default: 60s. Auto-skips inactive player when expired.</div>
                  </div>
                  <span className="font-mono text-cyan-400 font-extrabold text-sm tabular-nums bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-700">
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
                      onClick={() => handleRuleChange('turnTimeLimitSeconds', t.val)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition btn-tactile ${
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

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Snake Eyes Bonus Cash</div>
                  <div className="text-xs text-slate-400">Bonus rewarded upon rolling 1 + 1</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-emerald-400 font-bold text-sm">${currentRules.snakeEyesBonusCash}</span>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="50"
                    value={currentRules.snakeEyesBonusCash}
                    onChange={(e) => handleRuleChange('snakeEyesBonusCash', Number(e.target.value))}
                    className="accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Max Doubles Before Detention</div>
                  <div className="text-xs text-slate-400">Consecutive doubles allowed before speeding ticket</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-amber-400 font-bold text-sm">{currentRules.maxDoublesBeforePrison}</span>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="1"
                    value={currentRules.maxDoublesBeforePrison}
                    onChange={(e) => handleRuleChange('maxDoublesBeforePrison', Number(e.target.value))}
                    className="accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Detention Settings */}
          {activeCategory === 'prison' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Collect Rent While In Prison</div>
                  <div className="text-xs text-slate-400">Allow players in detention to still collect property rent</div>
                </div>
                <input
                  type="checkbox"
                  checked={currentRules.collectRentInPrison}
                  onChange={(e) => handleRuleChange('collectRentInPrison', e.target.checked)}
                  className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Prison Bail Amount</div>
                  <div className="text-xs text-slate-400">Fee required to purchase early release</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-emerald-400 font-bold text-sm">${currentRules.prisonBailAmount}</span>
                  <input
                    type="range"
                    min="25"
                    max="300"
                    step="25"
                    value={currentRules.prisonBailAmount}
                    onChange={(e) => handleRuleChange('prisonBailAmount', Number(e.target.value))}
                    className="accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Maximum Turns In Prison</div>
                  <div className="text-xs text-slate-400">Turns to attempt rolling doubles before mandatory bail</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-amber-400 font-bold text-sm">{currentRules.prisonTurnsMax}</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={currentRules.prisonTurnsMax}
                    onChange={(e) => handleRuleChange('prisonTurnsMax', Number(e.target.value))}
                    className="accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Chaos Settings */}
          {activeCategory === 'chaos' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-amber-500/10 border border-pink-500/30 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-pink-400" />
                    <span>Enable Chaos Engine</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Triggers random wild events (Market Crash, Rent Roulette, Blood Money)
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={currentRules.chaosEventsEnabled}
                  onChange={(e) => handleRuleChange('chaosEventsEnabled', e.target.checked)}
                  className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
                />
              </div>

              {currentRules.chaosEventsEnabled && (
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">Chaos Strike Frequency</div>
                    <div className="text-xs text-slate-400">Triggers a new chaos event every N game turns</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-pink-400 font-bold text-sm">Every {currentRules.chaosEventFrequencyTurns} Turns</span>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      step="1"
                      value={currentRules.chaosEventFrequencyTurns}
                      onChange={(e) => handleRuleChange('chaosEventFrequencyTurns', Number(e.target.value))}
                      className="accent-pink-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-pink-500/25 transition"
          >
            <Check className="w-4 h-4" />
            <span>Save Rules</span>
          </button>
        </div>
      </div>
    </div>
  );
};
