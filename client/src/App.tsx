import {
  ArrowLeftRight,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Crown,
  HelpCircle,
  LogOut,
  Sliders,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { Board2D } from './components/Board/Board2D';
import { ActivityLogPanel } from './components/HUD/ActivityLogPanel';
import { AllianceDissolutionBanner } from './components/HUD/AllianceDissolutionBanner';
import { BoardCardAnnouncement } from './components/HUD/BoardCardAnnouncement';
import { ChatPanel } from './components/HUD/ChatPanel';
import { HostControlsDrawer } from './components/HUD/HostControlsDrawer';
import { JasmineEasterEgg } from './components/HUD/JasmineEasterEgg';
import { PlayerHUD } from './components/HUD/PlayerHUD';
import { LobbyScreen } from './components/Lobby/LobbyScreen';
import { QuakeVaultModal } from './components/Lobby/QuakeVaultModal';
import { AllianceModal } from './components/Modals/AllianceModal';
import { AuctionModal } from './components/Modals/AuctionModal';
import { BankruptcyModal } from './components/Modals/BankruptcyModal';
import { CardDrawModal } from './components/Modals/CardDrawModal';
import { CasinoEventModal } from './components/Casino/CasinoEventModal';
import { GameOverModal } from './components/Modals/GameOverModal';
import { HowToPlayModal } from './components/Modals/HowToPlayModal';
import { ManagePropertiesModal } from './components/Modals/ManagePropertiesModal';
import { PrisonModal } from './components/Modals/PrisonModal';
import { PropertyActionModal } from './components/Modals/PropertyActionModal';
import { TradingModal } from './components/Modals/TradingModal';
import { AudioProvider, useAudio } from './context/AudioContext';
import { SocketProvider, useSocket } from './context/SocketContext';

const GameArena: React.FC = () => {
  const audio = useAudio();
  const { gameState, myPlayerId, session, leaveRoom, tradeToast, dismissTradeToast } = useSocket();

  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showAllianceModal, setShowAllianceModal] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [showHostDrawer, setShowHostDrawer] = useState(false);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  const [showBankruptcyModal, setShowBankruptcyModal] = useState(false);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);

  // Dynamic Theme BGM Management (Lifecycle-Safe & Continuous)
  React.useEffect(() => {
    const isGameActive = gameState?.phase && gameState.phase !== 'lobby' && gameState.phase !== 'game_over';
    const isAuction = gameState?.phase === 'auction' || !!gameState?.activeAuction;
    const currentTrack = isAuction ? 'auction' : 'gameplay';

    if (isGameActive && gameState?.themeId) {
      audio.startThemeBgm(gameState.themeId, currentTrack);
    } else if (gameState?.phase === 'lobby' || gameState?.phase === 'game_over') {
      audio.stopThemeBgm();
    }
  }, [
    gameState?.phase === 'lobby',
    gameState?.phase === 'game_over',
    gameState?.themeId,
    gameState?.phase === 'auction',
    !!gameState?.activeAuction,
  ]);

  if (!gameState || gameState.phase === 'lobby') {
    return <LobbyScreen />;
  }

  const myPlayer = myPlayerId ? gameState.players[myPlayerId] : undefined;
  const isSpectator = !!myPlayer?.isBankrupt || !!myPlayer?.isSpectator;
  const isHost = myPlayer ? myPlayer.isHost : false;

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-1.5 sm:p-2.5 bg-[#080c16] text-slate-100 overflow-x-hidden">
      {/* Top Navbar */}
      <header className="w-full max-w-[1920px] flex items-center justify-between py-1.5 px-2.5 sm:px-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg backdrop-blur-md mb-1.5 shrink-0">
        {/* Left Branding Group: [ CASHQUAKE ] [ ✨ Jasmine ★ ] */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <h1 className="font-black text-xs sm:text-sm tracking-tight text-white font-display leading-none">
                CASHQUAKE
              </h1>
            </div>
            <span className="text-[10px] font-mono text-slate-400 border-l border-slate-800 pl-2">
              <span className="text-amber-400 font-bold tracking-wider">{gameState.roomCode}</span>
            </span>
          </div>

          <JasmineEasterEgg />
        </div>

        {/* Action Controls & Host Access */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* How to Play / Guide Button */}
          <button
            onClick={() => setShowHowToPlayModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition btn-tactile shadow-sm"
            title="How to Play Cashquake (Rules & Guide)"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline font-sans">Guide</span>
          </button>

          {/* Host Controls / Match Rules Button */}
          <button
            onClick={() => setShowHostDrawer(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition btn-tactile shadow-sm"
            title="Open Game Settings & Host Controls"
          >
            {isHost ? (
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            ) : (
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span className="hidden sm:inline font-sans">{isHost ? 'Host Controls' : 'Match Rules'}</span>
          </button>

          {/* QuakeVault Button */}
          <button
            onClick={() => setShowVaultModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition btn-tactile shadow-sm font-mono"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-sans">Vault</span>
            <span className="text-[11px] tabular-nums font-bold">🪙{session.quakeCoins}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={audio.toggleMute}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition btn-tactile"
            title={audio.isMuted ? 'Unmute' : 'Mute'}
          >
            {audio.isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            )}
          </button>

          {/* Leave Game */}
          <button
            onClick={leaveRoom}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition btn-tactile"
            title="Leave Match"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Spectator Mode Banner (Calm, persistent, and offers Exit Match) */}
      {isSpectator && (
        <div className="w-full max-w-[1920px] mb-1.5 px-4 py-2 rounded-2xl bg-slate-900/95 border border-slate-700/80 flex items-center justify-between gap-3 shadow-xl backdrop-blur-md animate-fade-in">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 animate-pulse" />
            <span className="font-extrabold text-slate-200 font-display tracking-wide uppercase">
              {myPlayer?.isBankrupt ? 'BANKRUPT • SPECTATING MATCH' : 'SPECTATOR MODE'}
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              You are observing live gameplay. All board activity and events stream in real-time.
            </span>
          </div>
          <button
            onClick={leaveRoom}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 hover:text-rose-200 text-xs font-bold transition flex items-center gap-1.5 btn-tactile shadow-sm shrink-0"
            title="Exit Match to Lobby"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Match</span>
          </button>
        </div>
      )}

      {/* Real-time Trade Result Feedback Banner */}
      {tradeToast && (
        <div
          className={`w-full max-w-[1920px] mb-2 px-3.5 py-2 rounded-xl flex items-center justify-between gap-3 text-xs font-bold shadow-xl border animate-fade-in transition-all ${
            tradeToast.type === 'accepted'
              ? 'bg-emerald-950/90 border-emerald-500/80 text-emerald-200 shadow-emerald-500/10'
              : tradeToast.type === 'declined'
              ? 'bg-rose-950/90 border-rose-500/80 text-rose-200 shadow-rose-500/10'
              : tradeToast.type === 'expired'
              ? 'bg-amber-950/90 border-amber-500/80 text-amber-200 shadow-amber-500/10'
              : 'bg-slate-900/90 border-cyan-500/80 text-cyan-200 shadow-cyan-500/10'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">
              {tradeToast.type === 'accepted'
                ? '🤝'
                : tradeToast.type === 'declined'
                ? '❌'
                : tradeToast.type === 'expired'
                ? '⏱️'
                : '📨'}
            </span>
            <span>{tradeToast.message}</span>
          </div>
          <button
            onClick={dismissTradeToast}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Horizontal HUD for Mobile/Tablet (< lg) */}
      <div className="w-full max-w-[1920px] lg:hidden mb-2 px-1 flex flex-col gap-2">
        <PlayerHUD layout="horizontal" />
      </div>

      {/* Main Game Arena (3-Region Layout: Standings | Board | Activity & Chat) */}
      <main className="w-full max-w-[1920px] flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-3 px-1 sm:px-3 my-0.5 min-h-0">
        {/* Left Column: Player Standings Roster & Live In-Game Auction Panel */}
        {!isLeftPanelCollapsed ? (
          <div className="hidden lg:flex w-72 xl:w-80 2xl:w-84 shrink-0 flex-col gap-2.5 transition-all">
            <div className="p-3.5 rounded-3xl bg-slate-900/85 border border-slate-800 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-display">
                    Standings
                  </h3>
                  {gameState.rules.alliancesEnabled &&
                    Object.values(gameState.players).filter((p) => !p.isBankrupt && !p.isSpectator).length >= 3 && (
                      <button
                        onClick={() => setShowAllianceModal(true)}
                        className="px-2 py-0.5 rounded-full bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-[10px] font-bold border border-pink-500/40 transition flex items-center gap-1"
                        title="Manage Tycoon Alliances & Rent Exemptions"
                      >
                        <span>🤝</span>
                        <span>Alliances</span>
                      </button>
                    )}
                </div>
                <button
                  onClick={() => setIsLeftPanelCollapsed(true)}
                  className="text-slate-500 hover:text-slate-300 p-1 text-[10px] transition"
                  title="Collapse Standings"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
              <PlayerHUD layout="vertical" />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsLeftPanelCollapsed(false)}
            className="hidden lg:flex p-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white transition shadow-md"
            title="Expand Standings"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Center: Prioritized Board Viewport with Flexible Relationship */}
        <div className="flex-1 min-w-0 flex items-center justify-center w-full h-full">
          <Board2D
            onOpenTradeModal={() => setShowTradeModal(true)}
            onOpenManageModal={() => setShowManageModal(true)}
            onOpenAllianceModal={() => setShowAllianceModal(true)}
            onOpenHostControls={() => setShowHostDrawer(true)}
            onOpenBankruptcyModal={() => setShowBankruptcyModal(true)}
          />
        </div>

        {/* Right Column: Independent Activity Feed & Multiplayer Chat Panels */}
        {!isRightPanelCollapsed ? (
          <div className="w-full lg:w-72 xl:w-80 2xl:w-84 shrink-0 flex flex-col gap-2.5 transition-all h-[520px] sm:h-[560px] lg:h-[calc(100vh-130px)] lg:max-h-[820px] min-h-0">
            <div className="hidden lg:flex justify-end pr-1 shrink-0">
              <button
                onClick={() => setIsRightPanelCollapsed(true)}
                className="text-slate-500 hover:text-slate-300 text-[10px] flex items-center gap-1 transition"
                title="Collapse Side Panels"
              >
                <span>Collapse</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            {/* Top Panel: Activity Feed */}
            <div className="flex-1 min-h-0">
              <ActivityLogPanel />
            </div>
            {/* Bottom Panel: Live Chat & Quick Reactions */}
            <div className="flex-1 min-h-0">
              <ChatPanel />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsRightPanelCollapsed(false)}
            className="hidden lg:flex p-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white transition shadow-md"
            title="Expand Side Panels"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </main>

      {/* Temporary Notice Banners & Shared Board Announcements */}
      <AllianceDissolutionBanner />
      <BoardCardAnnouncement />

      {/* Modals & Slide-out Drawers (Interactive decisions only) */}
      <HostControlsDrawer isOpen={showHostDrawer} onClose={() => setShowHostDrawer(false)} />
      <PropertyActionModal onOpenManageModal={() => setShowManageModal(true)} />
      <AuctionModal />
      <BankruptcyModal
        isOpen={showBankruptcyModal}
        onClose={() => setShowBankruptcyModal(false)}
        onOpenManageModal={() => setShowManageModal(true)}
        onOpenTradeModal={() => setShowTradeModal(true)}
      />
      <TradingModal isOpen={showTradeModal} onClose={() => setShowTradeModal(false)} />
      <ManagePropertiesModal isOpen={showManageModal} onClose={() => setShowManageModal(false)} />
      <AllianceModal isOpen={showAllianceModal} onClose={() => setShowAllianceModal(false)} />
      <PrisonModal />
      <CardDrawModal />
      <CasinoEventModal />
      <GameOverModal />
      <QuakeVaultModal isOpen={showVaultModal} onClose={() => setShowVaultModal(false)} />
      <HowToPlayModal isOpen={showHowToPlayModal} onClose={() => setShowHowToPlayModal(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AudioProvider>
      <SocketProvider>
        <GameArena />
      </SocketProvider>
    </AudioProvider>
  );
};

export default App;
