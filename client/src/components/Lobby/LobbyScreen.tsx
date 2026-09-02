import {
  Bot,
  Copy,
  Crown,
  Eye,
  Flame,
  Globe,
  HelpCircle,
  Palette,
  Play,
  Settings,
  Share2,
  Shield,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { THEME_NAMES } from '@shared/constants';
import { BoardThemeId, Player, PresetType } from '@shared/types';
import { useAudio } from '../../context/AudioContext';
import { useSocket } from '../../context/SocketContext';
import { AvatarSilhouette } from '../Avatars/AvatarSilhouette';
import { JasmineEasterEgg } from '../HUD/JasmineEasterEgg';
import { HowToPlayModal } from '../Modals/HowToPlayModal';
import { QuakeVaultModal } from './QuakeVaultModal';
import { RoomSettingsModal } from './RoomSettingsModal';
import { GameRulesStudio } from './GameRulesStudio';

export const LobbyScreen: React.FC = () => {
  const audio = useAudio();
  const {
    gameState,
    myPlayerId,
    session,
    error,
    clearError,
    updateSession,
    createRoom,
    joinRoom,
    addBot,
    updateRules,
    updateTheme,
    startGame,
    leaveRoom,
  } = useSocket();

  const [inputCode, setInputCode] = useState('');
  const [joinAsSpectator, setJoinAsSpectator] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-check URL query params for ?code=
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code');
    if (codeParam && !gameState) {
      setInputCode(codeParam.toUpperCase());
    }
  }, [gameState]);

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      audio.playButtonTap();
      await createRoom();
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!inputCode.trim()) return;
    setLoading(true);
    try {
      audio.playButtonTap();
      await joinRoom(inputCode.trim().toUpperCase(), joinAsSpectator);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handlePlayWithBots = async () => {
    setLoading(true);
    try {
      audio.playButtonTap();
      await createRoom();
      setTimeout(() => {
        addBot();
        setTimeout(() => {
          addBot();
          setTimeout(() => {
            addBot();
          }, 200);
        }, 200);
      }, 300);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!gameState) return;
    const url = `${window.location.origin}/?code=${gameState.roomCode}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    audio.playSparkleChime();
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleCopyCode = () => {
    if (!gameState) return;
    navigator.clipboard.writeText(gameState.roomCode);
    setIsCopied(true);
    audio.playSparkleChime();
    setTimeout(() => setIsCopied(false), 2500);
  };

  const isHost = gameState && myPlayerId ? gameState.players[myPlayerId]?.isHost : false;
  const playersList = gameState ? Object.values(gameState.players) : [];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-4 md:p-8">
      {/* Top Header Bar */}
      <header className="w-full max-w-6xl flex items-center justify-between py-3.5 px-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md mb-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display leading-tight">
              CASHQUAKE
            </h1>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              A chaotic property-trading board game
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* How to Play / Guide Button */}
          <button
            onClick={() => setShowHowToPlayModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition btn-tactile shadow-sm"
            title="How to Play Cashquake (Rules & Guide)"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          {/* QuakeVault Button */}
          <button
            onClick={() => setShowVaultModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>QuakeVault</span>
            <span className="px-1.5 py-0.5 rounded-lg bg-amber-500/20 text-[11px] font-mono">
              🪙 {session.quakeCoins}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={audio.toggleMute}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title={audio.isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {audio.isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="w-full max-w-xl mb-4 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-sm flex items-center justify-between shadow-lg">
          <span>{error}</span>
          <button onClick={clearError} className="text-xs font-bold underline ml-3">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="w-full max-w-5xl flex-1 flex flex-col items-center justify-center">
        {!gameState ? (
          /* ========================================================================= */
          /* HOME SCREEN: CREATE / JOIN / BOT PRACTICE                                  */
          /* ========================================================================= */
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column: Player Identity & Quick Customization */}
            <div className="lg:col-span-5 flex flex-col p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-pink-400" />
                <span>Your Player Profile</span>
              </h2>

              <div className="flex items-center gap-4 mb-6">
                <div
                  className="relative w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition border-2"
                  style={{
                    backgroundColor: `${session.customization.color}25`,
                    borderColor: session.customization.color,
                  }}
                  onClick={() => setShowVaultModal(true)}
                  title="Click to customize avatar in QuakeVault!"
                >
                  <AvatarSilhouette
                    avatarId={session.customization.avatarId || session.customization.avatarIcon}
                    color={session.customization.color}
                    size={42}
                    showBorder={true}
                  />
                  <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] text-amber-300 font-bold font-mono">
                    Vault
                  </span>
                </div>

                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Display Name</label>
                  <input
                    type="text"
                    maxLength={18}
                    value={session.playerName}
                    onChange={(e) => updateSession({ playerName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:outline-none focus:border-pink-500 transition text-sm"
                    placeholder="Enter player name..."
                  />
                  <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                    <span>Title:</span>
                    <span className="text-pink-300 font-semibold">{session.customization.title}</span>
                  </div>
                </div>
              </div>

              {/* Quick Color Picker */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-400 block mb-2">Pawn Color Accent</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {['#EC4899', '#38BDF8', '#F97316', '#22C55E', '#A855F7', '#EAB308', '#EF4444', '#14B8A6'].map((col) => {
                    const isSelected = session.customization.color?.toUpperCase() === col.toUpperCase();

                    return (
                      <button
                        key={col}
                        title={`Select color ${col}`}
                        onClick={() =>
                          updateSession({
                            customization: { ...session.customization, color: col },
                          })
                        }
                        className={`w-7 h-7 rounded-xl transition-all ${
                          isSelected
                            ? 'scale-125 ring-2 ring-white shadow-lg z-10'
                            : 'opacity-70 hover:opacity-100 hover:scale-110'
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Guest Play Active (No login needed)</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> 100% Free
                </span>
              </div>
            </div>

            {/* Right Column: Game Launch Actions */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Create Game Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-slate-900 border border-pink-500/30 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-pink-400" />
                      <span>Host a Private Room</span>
                    </h3>
                    <p className="text-xs text-slate-300">
                      Create a private lobby and invite up to 8 friends with a 5-letter code or link.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={handleCreateRoom}
                    disabled={loading}
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-purple-500 text-white font-extrabold text-sm shadow-lg shadow-pink-500/25 transition transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Create Multiplayer Room</span>
                  </button>

                  <button
                    onClick={handlePlayWithBots}
                    disabled={loading}
                    className="px-4 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-2 whitespace-nowrap"
                    title="Instantly test with AI Bots!"
                  >
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span>Practice with Bots</span>
                  </button>
                </div>
              </div>

              {/* Join Game Card */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Join Friend's Lobby</span>
                </h3>

                <div className="flex items-center gap-3 mt-3">
                  <input
                    type="text"
                    maxLength={6}
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    placeholder="ENTER 5-LETTER CODE (e.g. CQ89K)"
                    className="flex-1 px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white font-mono font-bold tracking-widest text-center focus:outline-none focus:border-cyan-400 uppercase text-sm"
                  />

                  <button
                    onClick={handleJoinRoom}
                    disabled={loading || !inputCode.trim()}
                    className="px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition active:scale-95"
                  >
                    Join
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <input
                    type="checkbox"
                    id="spectatorCheck"
                    checked={joinAsSpectator}
                    onChange={(e) => setJoinAsSpectator(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                  />
                  <label htmlFor="spectatorCheck" className="cursor-pointer flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-cyan-300" /> Join as Spectator only (watch game live)
                  </label>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* LOBBY ROOM: CONFIGURE PRESETS, THEMES, PLAYERS, & RULES STUDIO             */
          /* ========================================================================= */
          <div className="w-full max-w-6xl flex flex-col gap-5">
            {/* Room Share Header Banner */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-slate-900 border border-pink-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase font-mono tracking-widest text-pink-300 font-bold mb-1">
                  Lobby Ready — Share with Friends
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl md:text-4xl font-black font-mono tracking-widest text-white glow-gold">
                    {gameState.roomCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition flex items-center gap-1.5 btn-tactile"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 font-bold text-xs flex items-center gap-2 transition btn-tactile"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{isCopied ? 'Link Copied!' : 'Share Direct Link'}</span>
                </button>

                <button
                  onClick={leaveRoom}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold transition btn-tactile"
                >
                  Leave Lobby
                </button>
              </div>
            </div>

            {/* Main Pre-Game Grid: Left (Players + Themes) | Right (Persistent Game Rules Studio) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Player Slots + Theme Selection */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Players List */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
                  <div className="flex items-center justify-between mb-3.5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                      <Users className="w-4 h-4 text-pink-400" />
                      <span>Players in Lobby ({playersList.length}/{gameState.rules.maxPlayers})</span>
                    </h3>

                    {isHost && playersList.length < gameState.rules.maxPlayers && (
                      <button
                        onClick={addBot}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition btn-tactile"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>+ Add Bot</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                    {playersList.map((player) => (
                      <div
                        key={player.id}
                        className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-inner border-2 shrink-0"
                            style={{
                              backgroundColor: `${player.customization.color}25`,
                              borderColor: player.customization.color,
                            }}
                          >
                            <AvatarSilhouette
                              avatarId={player.customization.avatarId || player.customization.avatarIcon}
                              color={player.customization.color}
                              size={20}
                              showBorder={true}
                            />
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                              <span>{player.name}</span>
                              {player.isHost && (
                                <span title="Host">
                                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                </span>
                              )}
                              {player.isBot && (
                                <span className="px-1.5 py-0.2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[9px] font-bold">
                                  BOT
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">{player.customization.title || 'Landlord'}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[11px] text-emerald-400 font-semibold">Ready</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Player Color Accent in Lobby */}
                  <div className="mt-4 pt-3.5 border-t border-slate-800">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 font-display">
                      Your Pawn Color Accent
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {['#EC4899', '#38BDF8', '#F97316', '#22C55E', '#A855F7', '#EAB308', '#EF4444', '#14B8A6'].map((col) => {
                        const isTaken = Object.values(gameState.players).some(
                          (p) => p.id !== myPlayerId && p.customization?.color?.toUpperCase() === col.toUpperCase()
                        );
                        const isSelected = session.customization.color?.toUpperCase() === col.toUpperCase();

                        return (
                          <button
                            key={col}
                            disabled={isTaken}
                            title={isTaken ? 'Color taken by another player' : `Select color ${col}`}
                            onClick={() =>
                              updateSession({
                                customization: { ...session.customization, color: col },
                              })
                            }
                            className={`relative w-7 h-7 rounded-xl transition-all ${
                              isSelected
                                ? 'scale-125 ring-2 ring-white shadow-lg z-10'
                                : isTaken
                                ? 'opacity-20 cursor-not-allowed'
                                : 'opacity-70 hover:opacity-100 hover:scale-110'
                            }`}
                            style={{ backgroundColor: col }}
                          >
                            {isTaken && (
                              <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white/90 font-black">
                                ✕
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Map Theme Selector */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-display">
                      <Globe className="w-3.5 h-3.5 text-purple-400" />
                      <span>Board Map Theme</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {(
                      [
                        'world_tour',
                        'cyber_neon',
                        'mystic_fantasy',
                        'cosmic_space',
                        'anime_akiba',
                        'casino_royale',
                        'pixel_arcade',
                        'frutiger_aero',
                      ] as BoardThemeId[]
                    ).map((tId) => {
                      const themeInfo = THEME_NAMES[tId];
                      const selected = gameState.themeId === tId;
                      return (
                        <button
                          key={tId}
                          disabled={!isHost}
                          onClick={() => updateTheme(tId)}
                          className={`p-3 rounded-xl border text-left transition flex items-center justify-between btn-tactile ${
                            selected
                              ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                              : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">{themeInfo.icon}</span>
                            <div>
                              <div className="text-xs font-bold">{themeInfo.name}</div>
                              <div className="text-[10px] text-slate-400">{themeInfo.description}</div>
                            </div>
                          </div>
                          {selected && <span className="w-2 h-2 rounded-full bg-purple-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Directly Visible Game Rules Studio */}
              <div className="lg:col-span-7 flex flex-col">
                <GameRulesStudio isHost={isHost} />
              </div>
            </div>

            {/* Launch Match Footer Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {playersList.length < 2
                    ? 'Need at least 2 players or bots to launch match'
                    : 'All rules and theme configured. Ready to start!'}
                </span>
              </div>

              {isHost ? (
                <button
                  onClick={() => startGame()}
                  disabled={playersList.length < 2}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-black text-sm tracking-wide shadow-2xl shadow-emerald-500/30 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 btn-tactile font-display"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>START CASHQUAKE</span>
                </button>
              ) : (
                <div className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold animate-pulse text-center">
                  Waiting for host to start match...
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <RoomSettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      <QuakeVaultModal isOpen={showVaultModal} onClose={() => setShowVaultModal(false)} />
      <HowToPlayModal isOpen={showHowToPlayModal} onClose={() => setShowHowToPlayModal(false)} />

      {/* Footer with Jasmine's Easter Egg */}
      <footer className="w-full max-w-6xl mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-sans">
        <div>Cashquake · A chaotic property-trading board game</div>
        <JasmineEasterEgg />
      </footer>
    </div>
  );
};
