import {
  AlertOctagon,
  Building2,
  CheckCircle,
  Clock,
  Compass,
  Crown,
  Flame,
  Handshake,
  Sliders,
  Umbrella,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { THEME_NAMES } from '@shared/constants';
import { BoardTile, Player } from '@shared/types';
import { useSocket } from '../../context/SocketContext';
import { ThemedCenterMotif } from '../../theme/centerPatterns';
import { getTheme } from '../../theme/themeRegistry';
import { AvatarSilhouette } from '../Avatars/AvatarSilhouette';
import { PropertyInspectModal } from '../Modals/PropertyInspectModal';
import { BoardActivityToast } from './BoardActivityToast';
import { DiceRoller3D } from './DiceRoller3D';
import { ThemeInteractiveLayer } from './ThemeInteractions/ThemeInteractiveLayer';
import { TileComponent } from './TileComponent';

interface Board2DProps {
  onOpenTradeModal: (targetPlayerId?: string) => void;
  onOpenManageModal: () => void;
  onOpenHostControls: () => void;
  onOpenAllianceModal?: () => void;
  onOpenBankruptcyModal?: () => void;
}

export const Board2D: React.FC<Board2DProps> = ({
  onOpenTradeModal,
  onOpenManageModal,
  onOpenHostControls,
  onOpenAllianceModal,
  onOpenBankruptcyModal,
}) => {
  const {
    gameState,
    myPlayerId,
    displayedPawnPositions,
    isPawnStepping,
    turnPresentationPhase,
    endTurn,
  } = useSocket();
  const [inspectedTile, setInspectedTile] = useState<BoardTile | null>(null);
  const [liveRemainingSeconds, setLiveRemainingSeconds] = useState<number>(0);

  useEffect(() => {
    if (!gameState || !gameState.turn.turnEndsAt || gameState.rules.turnTimeLimitSeconds === 0) {
      setLiveRemainingSeconds(gameState?.turn.turnTimerSeconds || 0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.ceil((gameState.turn.turnEndsAt! - Date.now()) / 1000)
      );
      setLiveRemainingSeconds(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [gameState?.turn.turnEndsAt, gameState?.turn.turnNumber, gameState?.rules.turnTimeLimitSeconds]);

  if (!gameState) return null;

  const currentP = gameState.players[gameState.turn.currentPlayerId];
  const myPlayer = myPlayerId ? gameState.players[myPlayerId] : undefined;
  const isSpectator = !!myPlayer?.isBankrupt || !!myPlayer?.isSpectator;
  const isMyTurn = currentP?.id === myPlayerId && !isSpectator;
  const isHost = myPlayerId ? gameState.players[myPlayerId]?.isHost : false;
  const isAuctionActive = gameState.phase === 'auction' || !!gameState.activeAuction;
  const canEndTurn =
    isMyTurn &&
    gameState.turn.hasRolled &&
    !gameState.turn.pendingAction &&
    !isPawnStepping &&
    turnPresentationPhase === 'ACTION' &&
    !isAuctionActive &&
    !isSpectator;

  // Determine dynamic turn event notification (anchored above Turn box)
  let turnEventNotification: string | null = null;
  const currentTile = currentP ? gameState.board[currentP.position] : undefined;

  if (isSpectator) {
    if (gameState.turn.pendingAction === 'buy_property' && currentP && currentTile) {
      turnEventNotification = `${currentP.name} is deciding whether to buy ${currentTile.name} ($${currentTile.price || 0})`;
    } else if (isPawnStepping && currentP) {
      turnEventNotification = `${currentP.name} rolled ${gameState.turn.dice.join('+')} and is advancing...`;
    }
  } else if (!isMyTurn && currentP) {
    if (gameState.turn.pendingAction === 'buy_property' && currentTile) {
      turnEventNotification = `${currentP.name} is deciding whether to buy ${currentTile.name} ($${currentTile.price || 0})`;
    } else if (isPawnStepping) {
      turnEventNotification = `${currentP.name} rolled ${gameState.turn.dice.join('+')} and is advancing...`;
    } else if (currentP.inPrison) {
      turnEventNotification = `${currentP.name} is serving time in Detention`;
    } else if (gameState.activeCasinoEvent) {
      turnEventNotification = `${currentP.name} is playing ${gameState.activeCasinoEvent.eventType === 'roulette' ? 'Roulette 🎡' : 'Slots 🎰'}!`;
    }
  } else if (isMyTurn) {
    if (gameState.turn.isDouble && gameState.turn.hasRolled && !canEndTurn) {
      turnEventNotification = `🎲 Doubles! You get another roll!`;
    } else if (myPlayer?.inPrison) {
      turnEventNotification = `🔒 Detention: Roll doubles, pay $${gameState.rules.prisonBailAmount} bail, or use a card.`;
    } else if ((myPlayer?.cash || 0) < 0) {
      turnEventNotification = `⚠️ Outstanding Debt: -$${Math.abs(myPlayer!.cash)}. Liquidate assets before ending turn.`;
    }
  }

  const theme = getTheme(gameState.themeId);
  const themeInfo = THEME_NAMES[gameState.themeId] || THEME_NAMES.world_tour;

  const getTileOrientation = (index: number): 'bottom' | 'left' | 'top' | 'right' | 'corner' => {
    if (index === 0 || index === 10 || index === 20 || index === 30) return 'corner';
    if (index > 0 && index < 10) return 'top';
    if (index > 10 && index < 20) return 'right';
    if (index > 20 && index < 30) return 'bottom';
    return 'left';
  };

  const getTileGridPosition = (index: number) => {
    if (index >= 0 && index <= 10) {
      // Top lane: Index 0 (col 1) -> Index 10 (col 11)
      const col = 1 + index;
      return { gridRow: 1, gridColumn: col };
    } else if (index > 10 && index <= 20) {
      // Right lane: Index 10 (row 1) -> Index 20 (row 11)
      const row = 1 + (index - 10);
      return { gridRow: row, gridColumn: 11 };
    } else if (index > 20 && index <= 30) {
      // Bottom lane: Index 20 (col 11) -> Index 30 (col 1)
      const col = 11 - (index - 20);
      return { gridRow: 11, gridColumn: col };
    } else {
      // Left lane: Index 30 (row 11) -> Index 39 (row 2)
      const row = 11 - (index - 30);
      return { gridRow: row, gridColumn: 1 };
    }
  };

  // Uses displayedPawnPositions for visible hopping steps
  const getPlayersOnTile = (tileIndex: number): Player[] => {
    return Object.values(gameState.players).filter((p) => {
      if (p.isBankrupt) return false;
      const currentPos = displayedPawnPositions[p.id] ?? p.position;
      return currentPos === tileIndex;
    });
  };

  const getPropertyOwner = (tileId: string): Player | undefined => {
    return Object.values(gameState.players).find(
      (p) => !p.isBankrupt && p.inventory.properties.includes(tileId)
    );
  };

  const hasTimeLimit = gameState.rules.turnTimeLimitSeconds > 0;
  const isTimerLow = hasTimeLimit && liveRemainingSeconds > 0 && liveRemainingSeconds <= 10;

  return (
    <div className="w-full flex flex-col items-center justify-center p-0">
      {/* Viewport-Aware Responsive Rectangular Spacious Grid Board Container */}
      <div
        className="relative rounded-3xl border-4 shadow-2xl p-1 sm:p-2 overflow-hidden transition-all duration-300 max-w-full"
        style={{
          width: 'min(100%, calc((100vh - 105px) * 1.15), 1080px)',
          height: 'min(100%, calc(100vh - 105px), 840px)',
          aspectRatio: '1.15 / 1',
          backgroundColor: theme.colors.boardBg,
          borderColor: theme.colors.boardBorder,
        }}
      >
        {/* 11x11 Spacious Proportional Grid:
            Columns: Corner/Left/Right lanes 1.45fr, 9 Top/Bottom properties 1.12fr
            Rows: Corner/Top/Bottom lanes 1.55fr, 9 Left/Right properties 1fr */}
        <div
          className="w-full h-full grid gap-0.5 sm:gap-1"
          style={{
            gridTemplateColumns:
              'minmax(0, 1.45fr) repeat(9, minmax(0, 1.12fr)) minmax(0, 1.45fr)',
            gridTemplateRows:
              'minmax(0, 1.55fr) repeat(9, minmax(0, 1fr)) minmax(0, 1.55fr)',
          }}
        >
          {/* Render 40 Board Tiles */}
          {gameState.board.map((tile) => {
            const gridPos = getTileGridPosition(tile.index);
            const orientation = getTileOrientation(tile.index);
            const playersHere = getPlayersOnTile(tile.index);
            const owner = getPropertyOwner(tile.id);

            return (
              <div
                key={tile.id}
                style={{ gridRow: gridPos.gridRow, gridColumn: gridPos.gridColumn }}
                className="w-full h-full min-w-0 min-h-0"
              >
                <TileComponent
                  tile={tile}
                  themeId={gameState.themeId}
                  owner={owner}
                  playersOnTile={playersHere}
                  activePlayerId={gameState.turn.currentPlayerId}
                  orientation={orientation}
                  onInspectTile={(t) => setInspectedTile(t)}
                />
              </div>
            );
          })}

          {/* ========================================================================= */}
          {/* CENTER ARENA (Span Col 2-10, Row 2-10)                                   */}
          {/* ========================================================================= */}
          <div
            style={{
              gridRow: '2 / 11',
              gridColumn: '2 / 11',
              backgroundColor: theme.colors.centerBg,
              borderColor: theme.colors.centerBorder,
            }}
            className="w-full h-full rounded-2xl border-2 p-2 sm:p-3.5 flex flex-col items-center justify-between relative shadow-inner overflow-hidden"
          >
            {/* Themed Center Vector Motif & Background Ambient Visuals - Fixed Geometric Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
              <ThemedCenterMotif
                themeId={gameState.themeId}
                accentColor={theme.colors.uiAccent}
              />
              <ThemeInteractiveLayer themeId={gameState.themeId} />
            </div>

            {/* Top Bar: Theme Name, Round, Pot & Host Quick Access */}
            <div className="w-full flex items-center justify-between gap-2 z-10">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center shadow-inner shrink-0"
                  style={{
                    backgroundColor: `${theme.colors.uiAccent}20`,
                    borderColor: `${theme.colors.uiAccent}50`,
                  }}
                >
                  <Compass
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    style={{ color: theme.colors.uiAccent }}
                  />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-black tracking-wider text-white font-display leading-tight">
                    {themeInfo.name.replace(/[^a-zA-Z0-9 ]/g, '')}
                  </h2>
                  <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
                    Round #
                    {Math.floor(
                      gameState.turn.turnNumber /
                        Math.max(Object.keys(gameState.players).length, 1)
                    ) + 1}
                  </div>
                </div>
              </div>

              {/* Center Top Badges: Host Controls & Vacation Pot */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Host Controls Quick Drawer Trigger */}
                <button
                  onClick={onOpenHostControls}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[10px] sm:text-xs font-bold transition btn-tactile shadow-sm"
                  title="Open Match Rules & Host Controls"
                >
                  {isHost ? (
                    <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ) : (
                    <Sliders className="w-3 h-3 text-cyan-400" />
                  )}
                  <span className="hidden sm:inline">
                    {isHost ? 'Host Controls' : 'Match Rules'}
                  </span>
                </button>

                {/* Vacation Cash Pot */}
                {gameState.rules.vacationCashPot && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-md cursor-help transition hover:bg-amber-500/25"
                    title="Vacation Cash Pot: Fines and taxes collected during the match. Land on Vacation (Free Parking) to claim this entire pot!"
                  >
                    <Umbrella className="w-3.5 h-3.5 text-amber-400" />
                    <div className="text-right leading-none">
                      <span className="text-[8px] uppercase font-black text-amber-400/90 font-display block">
                        Vacation Pot
                      </span>
                      <span className="font-mono text-xs font-black tabular-nums text-amber-300">
                        ${gameState.potCash}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Active Chaos Event Banner */}
            {gameState.activeChaosEvents.length > 0 && (
              <div className="w-full max-w-md my-0.5 p-2 rounded-xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-amber-500/20 border border-pink-500/40 text-center animate-pulse z-10">
                <div className="text-[11px] font-black text-pink-300 flex items-center justify-center gap-1.5 font-display">
                  <Flame className="w-3 h-3 text-pink-400" />
                  <span>{gameState.activeChaosEvents[0].title}</span>
                </div>
                <p className="text-[9px] text-slate-300 leading-tight mt-0.5">
                  {gameState.activeChaosEvents[0].description}
                </p>
              </div>
            )}

            {/* Dedicated Match Activity Toast Area (Upper Center Board Area - Zero Turn Box Collision) */}
            <BoardActivityToast />

            {/* Center: Turn Status, Tactile 3D Dice Roller & Integrated Turn Actions */}
            <div className="flex flex-col items-center justify-center my-auto z-10 gap-2">
              {/* Prominent Turn Indicator with Dynamically Anchored Upward-Growing Event Notification */}
              <div className="relative flex flex-col items-center">
                {/* Temporary Turn-Event Notification: Anchored directly above Turn Box with constant gap (mb-2.5) */}
                {turnEventNotification && (
                  <div className="absolute bottom-full mb-2.5 w-max max-w-[280px] sm:max-w-xs md:max-w-sm pointer-events-none z-20 flex flex-col items-center animate-fade-in">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-900/95 border border-slate-700/80 text-slate-200 text-xs shadow-xl backdrop-blur-md text-center leading-snug">
                      <span className="font-semibold text-slate-300">{turnEventNotification}</span>
                    </div>
                  </div>
                )}

                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl border transition-all ${
                    isMyTurn
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/10 animate-pulse'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <AvatarSilhouette
                    avatarId={
                      currentP?.customization.avatarId || currentP?.customization.avatarIcon
                    }
                    color={currentP?.customization.color || '#38BDF8'}
                    size={16}
                  />
                  <span className="font-display font-black text-xs tracking-wider">
                    {isMyTurn ? 'YOUR TURN' : `${currentP?.name.toUpperCase()}'S TURN`}
                  </span>

                  {hasTimeLimit && (
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-lg border tabular-nums ${
                        isTimerLow
                          ? 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      <Clock className="w-2.5 h-2.5 inline mr-0.5" />
                      {liveRemainingSeconds}s
                    </span>
                  )}
                </div>
              </div>

              {/* Tactile Dice Roller Component */}
              <DiceRoller3D />

              {/* Direct Turn Action: END TURN button grouped immediately below Dice */}
              {canEndTurn && !isAuctionActive && !isSpectator && (
                <button
                  onClick={() => endTurn()}
                  className="mt-1 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/30 transition-all active:scale-95 btn-tactile flex items-center gap-2 border-2 border-slate-950 font-display"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>END TURN</span>
                </button>
              )}

              {isSpectator && (
                <div className="mt-1 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                  <span>Spectating live match...</span>
                </div>
              )}

              {isAuctionActive && (
                <div className="mt-1 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-bold font-sans flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Auction in progress...</span>
                </div>
              )}

              {isMyTurn && gameState.turn.hasRolled && !isPawnStepping && !canEndTurn && !isAuctionActive && !isSpectator && (
                <div className="text-[11px] text-amber-400 font-bold font-sans flex items-center gap-1">
                  <span>Action required on board...</span>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar: Portfolio, Trade, Alliances & Surrender */}
            <div className="w-full flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenManageModal}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow-sm btn-tactile"
                >
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Portfolio</span>
                </button>

                {!isSpectator && (
                  <button
                    onClick={() => onOpenTradeModal()}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow-sm btn-tactile"
                  >
                    <Handshake className="w-3.5 h-3.5 text-pink-400" />
                    <span className="hidden sm:inline">Trade</span>
                  </button>
                )}

                {gameState.rules.alliancesEnabled &&
                  !isSpectator &&
                  Object.values(gameState.players).filter((p) => !p.isBankrupt && !p.isSpectator).length >= 3 &&
                  onOpenAllianceModal && (
                    <button
                      onClick={onOpenAllianceModal}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-pink-500/40 text-pink-300 text-xs font-bold transition flex items-center gap-1.5 shadow-sm btn-tactile"
                      title="Manage Tycoon Alliances"
                    >
                      <Handshake className="w-3.5 h-3.5 text-pink-400" />
                      <span className="hidden sm:inline">Alliances</span>
                    </button>
                  )}

                {/* Surrender / Declare Bankruptcy Action Button */}
                {onOpenBankruptcyModal && !isSpectator && (
                  <button
                    onClick={onOpenBankruptcyModal}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 border border-rose-800/40 hover:border-rose-500/60 text-rose-400 text-xs font-bold transition flex items-center gap-1.5 shadow-sm btn-tactile"
                    title="Surrender / Declare Bankruptcy"
                  >
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Bankruptcy</span>
                  </button>
                )}
              </div>

              <div className="text-[10px] font-mono text-slate-500">
                Turn #{gameState.turn.turnNumber}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Viewport-aware Property Deed Inspect Overlay */}
      <PropertyInspectModal
        tile={inspectedTile}
        onClose={() => setInspectedTile(null)}
        onOpenTradeModal={(targetId) => {
          setInspectedTile(null);
          onOpenTradeModal(targetId);
        }}
      />
    </div>
  );
};
