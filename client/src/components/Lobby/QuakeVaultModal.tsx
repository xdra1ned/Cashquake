import {
  Award,
  Check,
  Coins,
  Dices,
  Footprints,
  Sparkles,
  Unlock,
  User,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { QUAKE_VAULT_ITEMS, ShopItem } from '@shared/constants';
import { useSocket } from '../../context/SocketContext';
import { getDiceSkin } from '../../theme/cosmeticsRegistry';
import { AvatarSilhouette } from '../Avatars/AvatarSilhouette';

interface QuakeVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuakeVaultModal: React.FC<QuakeVaultModalProps> = ({ isOpen, onClose }) => {
  const { session, updateSession, unlockItem, earnCoins, claimDailyCoins } = useSocket();
  const [activeTab, setActiveTab] = useState<'avatar' | 'dice' | 'trail' | 'title'>('avatar');
  const [isClaiming, setIsClaiming] = useState(false);

  if (!isOpen) return null;

  const today = new Date().toISOString().slice(0, 10);
  const hasClaimedToday = session.lastDailyClaimDate === today;

  const handleClaimDaily = async () => {
    if (hasClaimedToday || isClaiming) return;
    setIsClaiming(true);
    try {
      await claimDailyCoins();
    } finally {
      setIsClaiming(false);
    }
  };

  const items = QUAKE_VAULT_ITEMS.filter((item) => item.category === activeTab);

  const isUnlocked = (item: ShopItem): boolean => {
    if (item.price === 0) return true;
    if (item.category === 'avatar') return session.unlockedSkins.includes(item.id);
    if (item.category === 'dice') return session.unlockedDice.includes(item.id);
    if (item.category === 'trail') return true;
    if (item.category === 'title') return true;
    return false;
  };

  const isEquipped = (item: ShopItem): boolean => {
    if (item.category === 'avatar') return session.customization.avatarId === item.id || session.customization.avatarIcon === item.icon;
    if (item.category === 'dice') return session.customization.diceSkin === item.id;
    if (item.category === 'trail') return session.customization.trailEffect === item.id;
    if (item.category === 'title') return session.customization.title === item.name;
    return false;
  };

  const handleEquip = (item: ShopItem) => {
    if (item.category === 'avatar') {
      updateSession({
        customization: {
          ...session.customization,
          avatarId: item.id,
          avatarIcon: item.id,
        },
      });
    } else if (item.category === 'dice') {
      updateSession({
        customization: {
          ...session.customization,
          diceSkin: item.id,
        },
      });
    } else if (item.category === 'trail') {
      updateSession({
        customization: {
          ...session.customization,
          trailEffect: item.id,
        },
      });
    } else if (item.category === 'title') {
      updateSession({
        customization: {
          ...session.customization,
          title: item.name,
        },
      });
    }
  };

  const handleUnlockAll = () => {
    const allAvatarIds = QUAKE_VAULT_ITEMS.filter((i) => i.category === 'avatar').map((i) => i.id);
    const allDiceIds = QUAKE_VAULT_ITEMS.filter((i) => i.category === 'dice').map((i) => i.id);
    earnCoins(1000);
    updateSession({
      unlockedSkins: Array.from(new Set([...session.unlockedSkins, ...allAvatarIds])),
      unlockedDice: Array.from(new Set([...session.unlockedDice, ...allDiceIds])),
    });
  };

  // Render visual preview badge per category without emojis
  const renderItemPreview = (item: ShopItem) => {
    if (item.category === 'avatar') {
      return (
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center shadow-inner border-2 transition-transform"
          style={{
            backgroundColor: `${session.customization.color || '#EC4899'}20`,
            borderColor: session.customization.color || '#EC4899',
          }}
        >
          <AvatarSilhouette
            avatarId={item.id}
            color={session.customization.color || '#EC4899'}
            size={32}
            showBorder={true}
          />
        </div>
      );
    }

    if (item.category === 'dice') {
      const diceSkin = getDiceSkin(item.id);
      return (
        <div
          className={`w-14 h-14 rounded-xl border-2 shadow-md flex flex-col justify-between p-2 relative select-none transition-transform ${diceSkin.bgClass} ${diceSkin.borderClass}`}
          style={{ boxShadow: diceSkin.shadow }}
        >
          {/* 6-pip Die Face Layout */}
          <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-0.5 pointer-events-none">
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 rounded-full shadow-inner" style={{ backgroundColor: diceSkin.pipColor }} />
            </div>
            <div />
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 rounded-full shadow-inner" style={{ backgroundColor: diceSkin.pipColor }} />
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 rounded-full shadow-inner" style={{ backgroundColor: diceSkin.pipColor }} />
            </div>
            <div />
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 rounded-full shadow-inner" style={{ backgroundColor: diceSkin.pipColor }} />
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 rounded-full shadow-inner" style={{ backgroundColor: diceSkin.pipColor }} />
            </div>
            <div />
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 rounded-full shadow-inner" style={{ backgroundColor: diceSkin.pipColor }} />
            </div>
          </div>
        </div>
      );
    }

    if (item.category === 'trail') {
      return (
        <div className="w-14 h-14 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-cyan-400 shadow-inner">
          <Footprints className="w-6 h-6" />
        </div>
      );
    }

    return (
      <div className="w-14 h-14 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-amber-400 shadow-inner">
        <Award className="w-6 h-6" />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border-2 border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-inner text-amber-400">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-wide text-white flex items-center gap-2 font-display">
                QuakeVault <span className="text-amber-400 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 font-sans">100% FREE</span>
              </h2>
              <p className="text-xs text-slate-400 font-sans">Unlock cosmetics using in-game QuakeCoins (No real money ever!)</p>
            </div>
          </div>

          {/* Currency Display & Close */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm shadow-md font-mono">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="tabular-nums">{session.quakeCoins} Coins</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800 bg-slate-950/40 overflow-x-auto">
          {(['avatar', 'dice', 'trail', 'title'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all flex items-center gap-1.5 btn-tactile ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-500/20'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab === 'avatar' && <><User className="w-3.5 h-3.5" /> <span>Avatars</span></>}
              {tab === 'dice' && <><Dices className="w-3.5 h-3.5" /> <span>Dice Skins</span></>}
              {tab === 'trail' && <><Footprints className="w-3.5 h-3.5" /> <span>Step Trails</span></>}
              {tab === 'title' && <><Award className="w-3.5 h-3.5" /> <span>Player Titles</span></>}
            </button>
          ))}

          <div className="ml-auto">
            <button
              onClick={handleUnlockAll}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition btn-tactile"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Unlock Everything (Free Pass)</span>
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => {
            const unlocked = isUnlocked(item);
            const equipped = isEquipped(item);

            return (
              <div
                key={item.id}
                className={`relative flex flex-col p-4 rounded-xl border transition-all duration-200 ${
                  equipped
                    ? 'bg-pink-500/10 border-pink-500/50 shadow-lg shadow-pink-500/10'
                    : unlocked
                    ? 'bg-slate-800/40 border-slate-700 hover:border-slate-500'
                    : 'bg-slate-900/60 border-slate-800 opacity-90'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  {renderItemPreview(item)}

                  {equipped && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold">
                      <Check className="w-3 h-3" /> Equipped
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-white text-sm sm:text-base mb-1 font-display">
                    {item.name.replace(/[^a-zA-Z0-9 ’'!,.-]/g, '')}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3 font-sans">{item.description}</p>
                </div>

                <div className="mt-auto pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  {unlocked ? (
                    <button
                      onClick={() => handleEquip(item)}
                      disabled={equipped}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition btn-tactile ${
                        equipped
                          ? 'bg-slate-800 text-slate-500 cursor-default'
                          : 'bg-slate-700 hover:bg-slate-600 text-white shadow-sm'
                      }`}
                    >
                      {equipped ? 'Active' : 'Equip'}
                    </button>
                  ) : (
                    <button
                      onClick={() => unlockItem(item.id, item.category as any, item.price)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition btn-tactile font-mono"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Unlock ({item.price} Coins)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          {hasClaimedToday ? (
            <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 font-semibold font-mono text-xs flex items-center gap-1.5 cursor-not-allowed">
              <span className="text-emerald-400">✓</span>
              <span>Claimed Today (Come back tomorrow!)</span>
            </div>
          ) : (
            <button
              onClick={handleClaimDaily}
              disabled={isClaiming}
              className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold hover:bg-amber-500/20 disabled:opacity-50 transition btn-tactile font-mono flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isClaiming ? 'Claiming...' : '+ Claim 200 Free Daily Coins'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

