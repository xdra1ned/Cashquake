import {
  Clock,
  Coins,
  Copy,
  Crown,
  Flame,
  Globe,
  Info,
  Lock,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  Unlock,
  Users,
  X,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { PACING_CONFIG } from '../../config/pacing';
import { useSocket } from '../../context/SocketContext';

interface HostControlsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HostControlsDrawer: React.FC<HostControlsDrawerProps> = ({ isOpen, onClose }) => {
  const { gameState, myPlayerId, updateRules, addBot } = useSocket();
  const [activeTab, setActiveTab] = useState<'pacing' | 'chaos' | 'economy' | 'management'>('pacing');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !gameState) return null;

  const isHost = myPlayerId ? gameState.players[myPlayerId]?.isHost : false;
  const isMatchLive = gameState.phase !== 'lobby' && gameState.phase !== 'game_over';
  const rules = gameState.rules;

  const handleRuleUpdate = (key: string, value: any) => {
    if (!isHost) return;
    updateRules(gameState.preset, { [key]: value });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gameState.roomCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l-2 border-slate-700 shadow-2xl flex flex-col overflow-hidden animate-slide-left">
        {/* Drawer Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              {isHost ? <Crown className="w-4 h-4 fill-amber-400" /> : <Sliders className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="font-display font-black text-white text-base tracking-wide flex items-center gap-2">
                <span>{isHost ? 'HOST CONTROLS' : 'MATCH RULES'}</span>
                {isHost && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold">
                    Host Admin
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-400 font-sans">
                {isHost ? 'Live tuning & match configuration' : 'Current match settings & rules'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 overflow-x-auto">
          {[
            { id: 'pacing', label: 'Pacing & Timers', icon: Clock },
            { id: 'chaos', label: 'Chaos Modifiers', icon: Zap },
            { id: 'economy', label: 'Economy & Rules', icon: Coins },
            { id: 'management', label: 'Room & Players', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 btn-tactile ${
                  active
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-display'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans text-xs">
          {/* TAB 1: PACING & TIMERS (CAN CHANGE LIVE) */}
          {activeTab === 'pacing' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px]">
                <Unlock className="w-3.5 h-3.5 shrink-0" />
                <span>Live Adjustable: Changes take effect immediately on the next turn.</span>
              </div>

              {/* Turn Timer Setting */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white font-display text-sm">Turn Time Limit</div>
                    <div className="text-slate-400 text-[11px]">Auto-skips inactive player when timer expires</div>
                  </div>
                  <span className="font-mono font-black text-cyan-400 text-sm px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 tabular-nums">
                    {rules.turnTimeLimitSeconds === 0 ? 'Unlimited' : `${rules.turnTimeLimitSeconds}s`}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {PACING_CONFIG.TIMER_PRESET_OPTIONS.map((t) => (
                    <button
                      key={t.value}
                      disabled={!isHost}
                      onClick={() => handleRuleUpdate('turnTimeLimitSeconds', t.value)}
                      className={`py-2 rounded-xl font-mono font-bold text-xs transition btn-tactile ${
                        rules.turnTimeLimitSeconds === t.value
                          ? 'bg-cyan-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-60'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auction Countdown */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white font-display text-sm">Auction Timer</div>
                    <div className="text-slate-400 text-[11px]">Countdown reset on each bid</div>
                  </div>
                  <span className="font-mono font-black text-amber-400 text-sm px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 tabular-nums">
                    {rules.auctionCountdown}s
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {[5, 8, 10, 15].map((sec) => (
                    <button
                      key={sec}
                      disabled={!isHost}
                      onClick={() => handleRuleUpdate('auctionCountdown', sec)}
                      className={`py-2 rounded-xl font-mono font-bold text-xs transition btn-tactile ${
                        rules.auctionCountdown === sec
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-60'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHAOS MODIFIERS (CAN CHANGE LIVE) */}
          {activeTab === 'chaos' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px]">
                <Unlock className="w-3.5 h-3.5 shrink-0" />
                <span>Live Adjustable: Modifiers apply dynamically to ongoing gameplay.</span>
              </div>

              {/* Snake Eyes Bonus */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white font-display">Snake Eyes Cash Bonus</div>
                    <div className="text-slate-400 text-[11px]">Reward for rolling 1 + 1</div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-xs">${rules.snakeEyesBonusCash}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 100, 250, 500].map((amt) => (
                    <button
                      key={amt}
                      disabled={!isHost}
                      onClick={() => handleRuleUpdate('snakeEyesBonusCash', amt)}
                      className={`py-2 rounded-xl font-mono font-bold text-xs transition btn-tactile ${
                        rules.snakeEyesBonusCash === amt
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-60'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vacation Cash Pot */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white font-display">Vacation Cash Pot</div>
                  <div className="text-slate-400 text-[11px]">Taxes and penalties pool at Vacation space</div>
                </div>
                <button
                  disabled={!isHost}
                  onClick={() => handleRuleUpdate('vacationCashPot', !rules.vacationCashPot)}
                  className={`px-3.5 py-2 rounded-xl font-bold font-mono text-xs transition btn-tactile ${
                    rules.vacationCashPot ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {rules.vacationCashPot ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              {/* Exact GO Landing Bonus */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white font-display">Exact GO Double Bonus</div>
                  <div className="text-slate-400 text-[11px]">Double cash when landing directly on Start</div>
                </div>
                <button
                  disabled={!isHost}
                  onClick={() => handleRuleUpdate('exactGoBonus', !rules.exactGoBonus)}
                  className={`px-3.5 py-2 rounded-xl font-bold font-mono text-xs transition btn-tactile ${
                    rules.exactGoBonus ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {rules.exactGoBonus ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ECONOMY & RULES (LOCKED DURING MATCH) */}
          {activeTab === 'economy' && (
            <div className="space-y-4">
              {isMatchLive ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Locked during live match to preserve financial state consistency.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px]">
                  <Unlock className="w-3.5 h-3.5 shrink-0" />
                  <span>Editable in lobby before match launch.</span>
                </div>
              )}

              {/* Starting Cash */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white font-display">Starting Cash</div>
                    <div className="text-slate-400 text-[11px]">Initial player bankroll</div>
                  </div>
                  <span className="font-mono font-bold text-white text-xs">${rules.startingCash}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1000, 1500, 2000, 3000].map((amt) => (
                    <button
                      key={amt}
                      disabled={!isHost || isMatchLive}
                      onClick={() => handleRuleUpdate('startingCash', amt)}
                      className={`py-2 rounded-xl font-mono font-bold text-xs transition ${
                        rules.startingCash === amt
                          ? 'bg-purple-600 text-white font-black'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-50'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pass GO Reward */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white font-display">Pass GO Reward</div>
                    <div className="text-slate-400 text-[11px]">Salary upon completing board lap</div>
                  </div>
                  <span className="font-mono font-bold text-white text-xs">${rules.goReward}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[100, 200, 400].map((amt) => (
                    <button
                      key={amt}
                      disabled={!isHost || isMatchLive}
                      onClick={() => handleRuleUpdate('goReward', amt)}
                      className={`py-2 rounded-xl font-mono font-bold text-xs transition ${
                        rules.goReward === amt
                          ? 'bg-purple-600 text-white font-black'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-50'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rent Multiplier */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white font-display">Rent Multiplier</div>
                    <div className="text-slate-400 text-[11px]">Global scale factor on property rents</div>
                  </div>
                  <span className="font-mono font-bold text-white text-xs">{rules.rentMultiplier}x</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[1.0, 1.5, 2.0].map((mult) => (
                    <button
                      key={mult}
                      disabled={!isHost || isMatchLive}
                      onClick={() => handleRuleUpdate('rentMultiplier', mult)}
                      className={`py-2 rounded-xl font-mono font-bold text-xs transition ${
                        rules.rentMultiplier === mult
                          ? 'bg-purple-600 text-white font-black'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-50'
                      }`}
                    >
                      {mult}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ROOM & PLAYER MANAGEMENT */}
          {activeTab === 'management' && (
            <div className="space-y-4">
              {/* Room Code Quick Share */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-2">
                <div className="font-bold text-white font-display">Lobby Room Code</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono font-black text-amber-400 text-base tracking-widest text-center">
                    {gameState.roomCode}
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition flex items-center gap-1 btn-tactile"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Bot Addition (if Host & room not full) */}
              {isHost && (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white font-display">Add AI Bot Player</div>
                    <div className="text-slate-400 text-[11px]">Spawn an automated player into the match</div>
                  </div>
                  <button
                    onClick={addBot}
                    disabled={Object.keys(gameState.players).length >= 6}
                    className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs transition btn-tactile"
                  >
                    + Add Bot
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">Preset: {gameState.preset.toUpperCase()}</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition btn-tactile font-display"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
