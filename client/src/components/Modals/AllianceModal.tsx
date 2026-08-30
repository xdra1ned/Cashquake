import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  Handshake,
  HeartCrack,
  Info,
  Percent,
  Plus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { BoardTile, Player } from '@shared/types';
import { useSocket } from '../../context/SocketContext';
import { AvatarSilhouette } from '../Avatars/AvatarSilhouette';

interface AllianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTargetPlayerId?: string;
}

export const AllianceModal: React.FC<AllianceModalProps> = ({
  isOpen,
  onClose,
  initialTargetPlayerId,
}) => {
  const {
    gameState,
    myPlayerId,
    sendAllianceRequest,
    respondAllianceRequest,
    proposeAllianceAgreement,
    respondAllianceAgreement,
    breakAlliance,
  } = useSocket();

  const [activeTab, setActiveTab] = useState<'roster' | 'agreement_editor'>('roster');
  const [selectedAllyId, setSelectedAllyId] = useState<string>(initialTargetPlayerId || '');
  const [propertyExemptions, setPropertyExemptions] = useState<Record<string, number>>({});
  const [breakingAllyId, setBreakingAllyId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !gameState || !myPlayerId) return null;

  const myPlayer = gameState.players[myPlayerId];
  if (!myPlayer) return null;

  const activePlayers = Object.values(gameState.players).filter(
    (p) => !p.isBankrupt && !p.isSpectator
  );
  const otherPlayers = activePlayers.filter((p) => p.id !== myPlayerId);

  // Incoming Requests & Agreements for me
  const incomingRequests = (gameState.pendingAllianceRequests || []).filter(
    (r) => r.toPlayerId === myPlayerId && r.status === 'pending'
  );
  const outgoingRequests = (gameState.pendingAllianceRequests || []).filter(
    (r) => r.fromPlayerId === myPlayerId && r.status === 'pending'
  );

  const incomingAgreements = (gameState.pendingAllianceAgreements || []).filter(
    (a) => a.beneficiaryPlayerId === myPlayerId && a.status === 'pending'
  );

  // Helper: check alliance
  const isAlliedWith = (otherId: string) => {
    return (gameState.activeAlliances || []).some(
      (a) => a.memberIds.includes(myPlayerId) && a.memberIds.includes(otherId)
    );
  };

  const myAllies = otherPlayers.filter((p) => isAlliedWith(p.id));

  // Helper: get tile
  const getTile = (id: string): BoardTile | undefined => {
    return gameState.board.find((t) => t.id === id);
  };

  // Helper: get active agreement from me to ally
  const getOutgoingAgreement = (allyId: string) => {
    return (gameState.activeAllianceAgreements || []).find(
      (a) => a.grantorPlayerId === myPlayerId && a.beneficiaryPlayerId === allyId && a.status === 'active'
    );
  };

  // Helper: get active agreement from ally to me
  const getIncomingAgreement = (allyId: string) => {
    return (gameState.activeAllianceAgreements || []).find(
      (a) => a.grantorPlayerId === allyId && a.beneficiaryPlayerId === myPlayerId && a.status === 'active'
    );
  };

  // Handle open agreement editor for ally
  const handleOpenAgreementEditor = (allyId: string) => {
    setSelectedAllyId(allyId);
    const existing = getOutgoingAgreement(allyId);
    if (existing) {
      setPropertyExemptions({ ...existing.exemptions });
    } else {
      setPropertyExemptions({});
    }
    setActiveTab('agreement_editor');
  };

  // Toggle exemption % on property
  const handleSetExemption = (propId: string, percentage: number) => {
    setPropertyExemptions((prev) => {
      const updated = { ...prev };
      if (percentage <= 0) {
        delete updated[propId];
      } else {
        updated[propId] = percentage;
      }
      return updated;
    });
  };

  // Submit proposed agreement
  const handleSendAgreement = async () => {
    if (!selectedAllyId || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await proposeAllianceAgreement(selectedAllyId, propertyExemptions);
      setActiveTab('roster');
    } catch (err) {
      // Ignored
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 shadow-inner">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white font-display">Player Alliances</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30 uppercase">
                  {myAllies.length} {myAllies.length === 1 ? 'Ally' : 'Allies'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Negotiate non-team alliances & directional property rent exemptions
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
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'roster'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20 font-display'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Tycoons Roster</span>
            {incomingRequests.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
            )}
          </button>

          {myAllies.length > 0 && (
            <button
              onClick={() => {
                setActiveTab('agreement_editor');
                if (!selectedAllyId && myAllies.length > 0) {
                  setSelectedAllyId(myAllies[0].id);
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'agreement_editor'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-display'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Rent Exemptions</span>
              {incomingAgreements.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              )}
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* 1. Urgent Incoming Alliance Proposals */}
          {incomingRequests.map((req) => {
            const sender = gameState.players[req.fromPlayerId];
            if (!sender) return null;
            return (
              <div
                key={req.id}
                className="p-3.5 rounded-xl bg-gradient-to-r from-pink-950/70 via-slate-900 to-purple-950/70 border border-pink-500/50 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
                    style={{
                      backgroundColor: `${sender.customization.color}20`,
                      borderColor: sender.customization.color,
                    }}
                  >
                    <AvatarSilhouette
                      avatarId={sender.customization.avatarId || sender.customization.avatarIcon}
                      color={sender.customization.color}
                      size={20}
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      <span className="text-pink-300 font-black">{sender.name}</span> wants to form an Alliance!
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Enables mutual property rent discount agreements.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => respondAllianceRequest(req.id, 'accept')}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold text-xs shadow-md shadow-pink-500/20 transition flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept Alliance</span>
                  </button>
                  <button
                    onClick={() => respondAllianceRequest(req.id, 'decline')}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold text-xs transition"
                  >
                    Decline
                  </button>
                </div>
              </div>
            );
          })}

          {/* 2. Urgent Incoming Rent Exemption Agreements */}
          {incomingAgreements.map((agr) => {
            const grantor = gameState.players[agr.grantorPlayerId];
            if (!grantor) return null;
            const entries = Object.entries(agr.exemptions);
            return (
              <div
                key={agr.id}
                className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-emerald-950/70 border border-cyan-500/50 shadow-lg flex flex-col gap-2.5 animate-fade-in"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs font-bold text-white">
                      <span className="text-cyan-300 font-black">{grantor.name}</span> offered you a Rent Exemption Agreement
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => respondAllianceAgreement(agr.id, 'accept')}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold text-xs shadow-md transition flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Accept Agreement</span>
                    </button>
                    <button
                      onClick={() => respondAllianceAgreement(agr.id, 'decline')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold text-xs transition"
                    >
                      Decline
                    </button>
                  </div>
                </div>

                {/* Exemption breakdown table */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                  {entries.map(([pId, pct]) => {
                    const tile = getTile(pId);
                    return (
                      <div
                        key={pId}
                        className="px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <span className="text-slate-300 font-bold truncate">{tile?.name || pId}</span>
                        <span className="font-mono font-black text-emerald-400">{pct}% OFF</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* TAB 1: ALLIANCES ROSTER */}
          {activeTab === 'roster' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
                <Info className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-200">Diplomacy Rules:</span> Alliances allow temporary agreements between competitors. Players do not share victory conditions or combine assets. Alliances automatically dissolve when 2 players remain.
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {otherPlayers.map((player) => {
                  const allied = isAlliedWith(player.id);
                  const isOutgoingPending = outgoingRequests.some((r) => r.toPlayerId === player.id);
                  const outgoingAgr = getOutgoingAgreement(player.id);
                  const incomingAgr = getIncomingAgreement(player.id);

                  return (
                    <div
                      key={player.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col gap-2.5 ${
                        allied
                          ? 'bg-slate-800/60 border-pink-500/40 shadow-sm'
                          : 'bg-slate-800/30 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
                            style={{
                              backgroundColor: `${player.customization.color}20`,
                              borderColor: player.customization.color,
                            }}
                          >
                            <AvatarSilhouette
                              avatarId={player.customization.avatarId || player.customization.avatarIcon}
                              color={player.customization.color}
                              size={20}
                            />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs sm:text-sm font-display">
                                {player.name}
                              </span>
                              {allied ? (
                                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono text-[10px] font-bold border border-pink-500/40">
                                  🤝 Allied
                                </span>
                              ) : isOutgoingPending ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/40">
                                  Request Sent
                                </span>
                              ) : null}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              ${player.cash} Cash • {player.inventory.properties.length} Properties
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          {allied ? (
                            <>
                              <button
                                onClick={() => handleOpenAgreementEditor(player.id)}
                                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center gap-1"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Configure</span> Exemptions
                              </button>

                              {breakingAllyId === player.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      breakAlliance(player.id);
                                      setBreakingAllyId(null);
                                    }}
                                    className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
                                  >
                                    Confirm End
                                  </button>
                                  <button
                                    onClick={() => setBreakingAllyId(null)}
                                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs transition"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setBreakingAllyId(player.id)}
                                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition"
                                  title="End Alliance"
                                >
                                  <HeartCrack className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              disabled={isOutgoingPending}
                              onClick={() => sendAllianceRequest(player.id)}
                              className={`px-3.5 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                                isOutgoingPending
                                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                  : 'bg-pink-500 hover:bg-pink-400 text-white shadow-md shadow-pink-500/20'
                              }`}
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>{isOutgoingPending ? 'Pending...' : 'Send Request'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Exemption Agreement Badges if active */}
                      {allied && (outgoingAgr || incomingAgr) && (
                        <div className="pt-1.5 border-t border-slate-700/50 flex flex-wrap gap-2 text-[11px]">
                          {outgoingAgr && Object.keys(outgoingAgr.exemptions).length > 0 && (
                            <span className="px-2 py-0.5 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                              🛡️ You grant: {Object.keys(outgoingAgr.exemptions).length} property discounts
                            </span>
                          )}
                          {incomingAgr && Object.keys(incomingAgr.exemptions).length > 0 && (
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                              🎁 {player.name} grants you: {Object.keys(incomingAgr.exemptions).length} property discounts
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: RENT EXEMPTION AGREEMENT EDITOR */}
          {activeTab === 'agreement_editor' && (
            <div className="space-y-4">
              {/* Ally Selector */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-white">Target Ally</div>
                  <div className="text-[11px] text-slate-400">Select which allied tycoon receives this rent exemption agreement</div>
                </div>

                <select
                  value={selectedAllyId}
                  onChange={(e) => handleOpenAgreementEditor(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs border border-slate-700 focus:outline-none focus:border-pink-500"
                >
                  {myAllies.map((ally) => (
                    <option key={ally.id} value={ally.id}>
                      🤝 {ally.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property list */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-slate-300">
                    Your Owned Properties ({myPlayer.inventory.properties.length})
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Select discount % when {gameState.players[selectedAllyId]?.name || 'Ally'} lands on your tiles
                  </div>
                </div>

                {myPlayer.inventory.properties.length === 0 ? (
                  <div className="p-6 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-500">
                    You do not own any properties yet. Acquire properties to offer rent exemptions.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[260px] overflow-y-auto scrollbar-thin pr-1">
                    {myPlayer.inventory.properties.map((propId) => {
                      const tile = getTile(propId);
                      if (!tile) return null;
                      const currentPct = propertyExemptions[propId] || 0;

                      return (
                        <div
                          key={propId}
                          className={`p-2.5 sm:p-3 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                            currentPct > 0
                              ? 'bg-slate-800/80 border-cyan-500/50 shadow-sm'
                              : 'bg-slate-800/30 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {tile.color && (
                              <div
                                className="w-3 h-8 rounded-lg shrink-0 shadow-sm"
                                style={{ backgroundColor: tile.color }}
                              />
                            )}
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate">{tile.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                Base Rent: ${tile.rent ? tile.rent[0] : 0}
                              </div>
                            </div>
                          </div>

                          {/* Percentage selection buttons */}
                          <div className="flex items-center gap-1 shrink-0">
                            {[
                              { label: 'None', val: 0 },
                              { label: '25%', val: 25 },
                              { label: '50%', val: 50 },
                              { label: '75%', val: 75 },
                              { label: '100% Free', val: 100 },
                            ].map((opt) => (
                              <button
                                key={opt.val}
                                onClick={() => handleSetExemption(propId, opt.val)}
                                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold transition ${
                                  currentPct === opt.val
                                    ? opt.val === 100
                                      ? 'bg-emerald-500 text-white shadow-sm font-black'
                                      : opt.val > 0
                                      ? 'bg-cyan-600 text-white font-black'
                                      : 'bg-slate-700 text-slate-200'
                                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-700'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Submit agreement button */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  <span className="font-bold text-white">
                    {Object.keys(propertyExemptions).length}
                  </span>{' '}
                  {Object.keys(propertyExemptions).length === 1 ? 'property' : 'properties'} with rent discounts
                </div>

                <button
                  disabled={isSubmitting || !selectedAllyId || myPlayer.inventory.properties.length === 0}
                  onClick={handleSendAgreement}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Propose Agreement</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
