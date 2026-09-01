import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  BoardThemeId,
  GameRules,
  GameState,
  PlayerId,
  PresetType,
  RoomCode,
  TradeOffer,
  UserSession,
} from '@shared/types';
import { PACING_CONFIG } from '../config/pacing';
import { DICE_SKIN_STYLES } from '../theme/cosmeticsRegistry';
import { useAudio } from './AudioContext';

export type TurnPresentationPhase =
  | 'IDLE'
  | 'ROLLING'
  | 'ROLL_RESULT'
  | 'MOVING'
  | 'ARRIVED'
  | 'ACTION';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  gameState: GameState | null;
  myPlayerId: PlayerId | null;
  session: UserSession;
  displayedPawnPositions: Record<string, number>;
  isPawnStepping: boolean;
  turnPresentationPhase: TurnPresentationPhase;
  animDice: [number, number];
  activeMovingPlayerId: string | null;
  activeMovingPawnTrail: string | null;
  inspectedPlayerId: string | null;
  setInspectedPlayerId: (id: string | null) => void;
  error: string | null;
  clearError: () => void;
  updateSession: (newSession: Partial<UserSession>) => void;
  earnCoins: (amount: number) => void;
  claimDailyCoins: () => Promise<boolean>;
  unlockItem: (itemId: string, category: 'avatar' | 'dice' | 'theme', cost: number) => boolean;
  createRoom: (name?: string) => Promise<string>;
  joinRoom: (roomCode: RoomCode, isSpectator?: boolean) => Promise<boolean>;
  addBot: () => void;
  updateRules: (preset: PresetType, customRules?: Partial<GameRules>) => void;
  updateTheme: (themeId: BoardThemeId) => void;
  startGame: () => Promise<boolean>;
  rollDice: () => Promise<any>;
  tradeToast: TradeToast | null;
  dismissTradeToast: () => void;
  sendChatMessage: (message: string) => void;
  buyProperty: () => Promise<boolean>;
  passProperty: () => void;
  placeBid: (bidAmount: number) => Promise<boolean>;
  passAuction: () => void;
  buildHouse: (tileId: string) => Promise<boolean>;
  sellHouse: (tileId: string) => Promise<boolean>;
  mortgageProperty: (tileId: string) => Promise<boolean>;
  unmortgageProperty: (tileId: string) => Promise<boolean>;
  sellProperty: (tileId: string) => Promise<boolean>;
  spinCasinoEvent: () => void;
  resolveCasinoEvent: () => void;
  sendAllianceRequest: (toPlayerId: PlayerId) => Promise<boolean>;
  respondAllianceRequest: (requestId: string, response: 'accept' | 'decline') => Promise<boolean>;
  proposeAllianceAgreement: (beneficiaryPlayerId: PlayerId, exemptions: Record<string, number>) => Promise<boolean>;
  respondAllianceAgreement: (agreementId: string, response: 'accept' | 'decline') => Promise<boolean>;
  breakAlliance: (targetPlayerId: PlayerId) => Promise<boolean>;
  proposeTrade: (offer: Omit<TradeOffer, 'id' | 'createdAt' | 'status' | 'fromPlayerId'>) => Promise<boolean>;
  respondTrade: (tradeId: string, action: 'accept' | 'decline' | 'cancel') => void;
  payBail: () => Promise<boolean>;
  usePrisonCard: () => Promise<boolean>;
  endTurn: () => Promise<boolean>;
  declareBankruptcy: () => void;
  sendEmote: (emote: string) => void;
  leaveRoom: () => void;
}

export interface TradeToast {
  id: string;
  type: 'sent' | 'accepted' | 'declined' | 'expired';
  message: string;
  timestamp: number;
}

const SocketCtx = createContext<SocketContextType | null>(null);

const DEFAULT_SESSION: UserSession = {
  sessionId: `sess_${Math.random().toString(36).substring(2, 10)}`,
  playerName: 'Jasmine',
  customization: {
    avatarId: 'av_star',
    avatarIcon: '⭐',
    color: '#EC4899',
    diceSkin: 'dice_classic',
    trailEffect: 'trail_sparkles',
    title: 'Quake Tycoon',
  },
  quakeCoins: 500,
  unlockedSkins: ['av_star', 'av_cat', 'av_robot'],
  unlockedDice: ['dice_classic'],
  unlockedThemes: ['world_tour', 'cyber_neon', 'mystic_fantasy', 'cosmic_space', 'anime_akiba', 'casino_royale', 'pixel_arcade'],
  stats: {
    matchesPlayed: 0,
    matchesWon: 0,
    totalQuakeCoinsEarned: 500,
  },
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audio = useAudio();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<PlayerId | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Coordinated Presentation Engine State
  const [turnPresentationPhase, setTurnPresentationPhase] = useState<TurnPresentationPhase>('IDLE');
  const [animDice, setAnimDice] = useState<[number, number]>([1, 1]);
  const [displayedPawnPositions, setDisplayedPawnPositions] = useState<Record<string, number>>({});
  const [isPawnStepping, setIsPawnStepping] = useState(false);
  const [activeMovingPlayerId, setActiveMovingPlayerId] = useState<string | null>(null);
  const [activeMovingPawnTrail, setActiveMovingPawnTrail] = useState<string | null>(null);
  const [inspectedPlayerId, setInspectedPlayerId] = useState<string | null>(null);
  const [tradeToast, setTradeToast] = useState<TradeToast | null>(null);
  const prevGameStateRef = useRef<GameState | null>(null);
  const presentationTimeoutsRef = useRef<any[]>([]);
  const shuffleIntervalRef = useRef<any>(null);
  const tradeToastTimeoutRef = useRef<any>(null);

  const showTradeToast = (
    type: 'sent' | 'accepted' | 'declined' | 'expired',
    message: string,
    autoDismissMs?: number
  ) => {
    if (tradeToastTimeoutRef.current) {
      clearTimeout(tradeToastTimeoutRef.current);
      tradeToastTimeoutRef.current = null;
    }
    const toast: TradeToast = {
      id: `toast_${Date.now()}`,
      type,
      message,
      timestamp: Date.now(),
    };
    setTradeToast(toast);

    if (autoDismissMs) {
      tradeToastTimeoutRef.current = setTimeout(() => {
        setTradeToast((curr) => (curr?.id === toast.id ? null : curr));
        tradeToastTimeoutRef.current = null;
      }, autoDismissMs);
    }
  };

  const processedChatIdsRef = useRef<Set<string>>(new Set());
  const isInitialChatSeedRef = useRef<boolean>(false);

  const dismissTradeToast = () => {
    if (tradeToastTimeoutRef.current) {
      clearTimeout(tradeToastTimeoutRef.current);
      tradeToastTimeoutRef.current = null;
    }
    setTradeToast(null);
  };

  const [session, setSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('cashquake_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.customization) {
          parsed.customization = { ...DEFAULT_SESSION.customization };
        }
        // Gracefully validate diceSkin and fall back to 'dice_classic' if missing or unrecognized
        if (!parsed.customization.diceSkin || !DICE_SKIN_STYLES[parsed.customization.diceSkin]) {
          parsed.customization.diceSkin = 'dice_classic';
        }
        // Ensure unlockedDice contains at least 'dice_classic'
        if (!Array.isArray(parsed.unlockedDice) || !parsed.unlockedDice.includes('dice_classic')) {
          parsed.unlockedDice = Array.from(new Set(['dice_classic', ...(parsed.unlockedDice || [])]));
        }
        // Ensure unlockedThemes contains 'pixel_arcade'
        if (Array.isArray(parsed.unlockedThemes) && !parsed.unlockedThemes.includes('pixel_arcade')) {
          parsed.unlockedThemes.push('pixel_arcade');
        }
        return parsed;
      } catch (e) {}
    }
    return DEFAULT_SESSION;
  });

  useEffect(() => {
    localStorage.setItem('cashquake_session', JSON.stringify(session));
  }, [session]);

  const clearAllTimers = () => {
    if (shuffleIntervalRef.current) {
      clearInterval(shuffleIntervalRef.current);
      shuffleIntervalRef.current = null;
    }
    presentationTimeoutsRef.current.forEach((t) => clearTimeout(t));
    presentationTimeoutsRef.current = [];
  };

  useEffect(() => {
    const s = io(window.location.origin, {
      transports: ['websocket', 'polling'],
    });

    s.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    s.on('disconnect', () => {
      setIsConnected(false);
    });

    s.on('gameStateUpdate', (updatedState: GameState) => {
      const prevState = prevGameStateRef.current;
      prevGameStateRef.current = updatedState;

      // 1. Initial State Initialization
      if (!prevState) {
        const initPos: Record<string, number> = {};
        Object.values(updatedState.players).forEach((p) => {
          initPos[p.id] = p.position;
        });
        setDisplayedPawnPositions(initPos);
        setAnimDice(updatedState.turn.dice);
        setTurnPresentationPhase(updatedState.turn.hasRolled ? 'ACTION' : 'IDLE');
        setGameState(updatedState);
        return;
      }

      // 2. Sound Effects Detection (for remote & bot player events)
      if (updatedState.logs.length > prevState.logs.length) {
        const latest = updatedState.logs[0];
        const isSelfAction = latest.playerId && latest.playerId === myPlayerId;

        if (!isSelfAction) {
          if (latest.type === 'buy') {
            if (latest.message.includes('sold') || latest.message.includes('mortgaged')) {
              audio.playSellProperty();
            } else {
              audio.playCashChaching();
            }
          } else if (latest.type === 'rent') {
            audio.playRentTransfer();
          } else if (latest.type === 'prison') {
            audio.playJailClank();
          } else if (latest.type === 'card') {
            audio.playCardWhoosh();
          } else if (latest.type === 'auction') {
            if (latest.message.includes('won') || latest.message.includes('sold')) {
              audio.playAuctionWin();
            } else {
              audio.playAuctionStart();
            }
          } else if (latest.type === 'chaos') {
            audio.playChaosBoom();
          } else if (latest.type === 'win') {
            audio.playVictoryFanfare();
          } else if (latest.message.includes('Vacation') || latest.message.includes('JACKPOT')) {
            audio.playVacationChime();
          }
        }
      }

      // 3. Incoming Chat Notification Detection (for messages from other players)
      if (updatedState.chatMessages && updatedState.chatMessages.length > 0) {
        if (!isInitialChatSeedRef.current) {
          updatedState.chatMessages.forEach((m) => processedChatIdsRef.current.add(m.id));
          isInitialChatSeedRef.current = true;
        } else {
          updatedState.chatMessages.forEach((m) => {
            if (!processedChatIdsRef.current.has(m.id)) {
              processedChatIdsRef.current.add(m.id);
              if (m.playerId !== myPlayerId) {
                audio.playChatNotification(updatedState.themeId);
              }
            }
          });
        }
      }

      // Trade Resolution Detection for human players (Auto-Dismissing Banner)
      if (prevState.activeTrade && !updatedState.activeTrade) {
        const trade = prevState.activeTrade;
        const isParticipant = trade.fromPlayerId === myPlayerId || trade.toPlayerId === myPlayerId;
        if (isParticipant) {
          const otherPlayerId = trade.fromPlayerId === myPlayerId ? trade.toPlayerId : trade.fromPlayerId;
          const otherName = updatedState.players[otherPlayerId]?.name || 'Player';

          // Check logs for accepted trade
          const acceptedLog = updatedState.logs.find(
            (l) => l.type === 'trade' && l.timestamp >= trade.createdAt && l.message.includes('traded')
          );

          if (acceptedLog) {
            showTradeToast('accepted', `✅ ${otherName} accepted your trade offer!`, 4500);
            audio.playCashChaching();
          } else if (trade.fromPlayerId === myPlayerId) {
            showTradeToast('declined', `❌ ${otherName} rejected your trade offer.`, 4000);
            audio.playErrorBuzz();
          } else {
            showTradeToast('expired', `⏱️ Trade offer expired.`, 3500);
          }
        }
      }

      // 3. Detect New Roll across ALL players (human self, remote players, or bots)
      const prevTurn = prevState.turn;
      const curTurn = updatedState.turn;
      const isNewRoll =
        (!prevTurn.hasRolled && curTurn.hasRolled) ||
        (curTurn.hasRolled &&
          (prevTurn.turnNumber !== curTurn.turnNumber ||
            prevTurn.currentPlayerId !== curTurn.currentPlayerId ||
            prevTurn.dice[0] !== curTurn.dice[0] ||
            prevTurn.dice[1] !== curTurn.dice[1]));

      if (isNewRoll && updatedState.phase !== 'lobby' && updatedState.phase !== 'game_over') {
        clearAllTimers();

        const roller = updatedState.players[curTurn.currentPlayerId];
        const finalDice = curTurn.dice;
        const startPos = displayedPawnPositions[roller.id] ?? prevState.players[roller.id]?.position ?? 0;
        const targetPos = roller.position;

        // PHASE 1: DICE TUMBLE (1200ms)
        setTurnPresentationPhase('ROLLING');
        audio.playDiceRoll();

        shuffleIntervalRef.current = setInterval(() => {
          setAnimDice([
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1,
          ]);
        }, PACING_CONFIG.DICE_SHUFFLE_INTERVAL_MS);

        // Schedule PHASE 2: FINAL RESULT HOLD (1200ms)
        const tHold = setTimeout(() => {
          if (shuffleIntervalRef.current) {
            clearInterval(shuffleIntervalRef.current);
            shuffleIntervalRef.current = null;
          }
          setAnimDice(finalDice);
          setTurnPresentationPhase('ROLL_RESULT');

          // Schedule PHASE 3: PAWN MOVEMENT (200ms per tile)
          const tMoveStart = setTimeout(() => {
            setTurnPresentationPhase('MOVING');
            setIsPawnStepping(true);
            setActiveMovingPlayerId(roller.id);
            setActiveMovingPawnTrail(roller.customization.trailEffect || 'trail_none');

            if (roller.inPrison) {
              // Direct teleportation to detention
              setDisplayedPawnPositions((prev) => ({ ...prev, [roller.id]: targetPos }));
              audio.playJailClank();

              const tArrival = setTimeout(() => {
                setTurnPresentationPhase('ARRIVED');
                const tAction = setTimeout(() => {
                  setIsPawnStepping(false);
                  setActiveMovingPlayerId(null);
                  setTurnPresentationPhase('ACTION');
                  s.emit('pawnLanded');
                }, PACING_CONFIG.ARRIVAL_PAUSE_MS);
                presentationTimeoutsRef.current.push(tAction);
              }, PACING_CONFIG.ARRIVAL_PAUSE_MS);
              presentationTimeoutsRef.current.push(tArrival);
            } else {
              // Compute perimeter hop path
              const path: number[] = [];
              let cur = startPos;
              while (cur !== targetPos) {
                cur = (cur + 1) % 40;
                path.push(cur);
              }

              if (path.length === 0) {
                // Stayed in same spot
                const tArrival = setTimeout(() => {
                  setTurnPresentationPhase('ARRIVED');
                  const tAction = setTimeout(() => {
                    setIsPawnStepping(false);
                    setActiveMovingPlayerId(null);
                    setTurnPresentationPhase('ACTION');
                    s.emit('pawnLanded');
                  }, PACING_CONFIG.ARRIVAL_PAUSE_MS);
                  presentationTimeoutsRef.current.push(tAction);
                }, PACING_CONFIG.ARRIVAL_PAUSE_MS);
                presentationTimeoutsRef.current.push(tArrival);
              } else {
                // Step space-by-space
                path.forEach((step, idx) => {
                  const tStep = setTimeout(() => {
                    setDisplayedPawnPositions((prev) => ({ ...prev, [roller.id]: step }));
                    audio.playTokenHop();

                    if (idx === path.length - 1) {
                      // PHASE 4: ARRIVAL PAUSE (700ms)
                      setTurnPresentationPhase('ARRIVED');
                      const tAction = setTimeout(() => {
                        // PHASE 5: ACTION PRESENTATION (Modals unlocked!)
                        setIsPawnStepping(false);
                        setActiveMovingPlayerId(null);
                        setTurnPresentationPhase('ACTION');
                        s.emit('pawnLanded');
                      }, PACING_CONFIG.ARRIVAL_PAUSE_MS);
                      presentationTimeoutsRef.current.push(tAction);
                    }
                  }, (idx + 1) * PACING_CONFIG.PAWN_STEP_INTERVAL_MS);
                  presentationTimeoutsRef.current.push(tStep);
                });
              }
            }
          }, PACING_CONFIG.DICE_HOLD_RESULT_MS);
          presentationTimeoutsRef.current.push(tMoveStart);
        }, PACING_CONFIG.DICE_TUMBLE_MS);
        presentationTimeoutsRef.current.push(tHold);
      } else if (!curTurn.hasRolled) {
        // Reset when turn switches to new player who hasn't rolled yet
        if (turnPresentationPhase !== 'IDLE') {
          setTurnPresentationPhase('IDLE');
          setAnimDice(curTurn.dice);
          setIsPawnStepping(false);
          setActiveMovingPlayerId(null);
        }
        // Keep pawn positions synchronized
        const syncPos: Record<string, number> = {};
        Object.values(updatedState.players).forEach((p) => {
          syncPos[p.id] = p.position;
        });
        setDisplayedPawnPositions(syncPos);
      }

      setGameState(updatedState);
    });

    setSocket(s);

    return () => {
      clearAllTimers();
      s.disconnect();
    };
  }, []);

  const sendChatMessage = (rawMsg: string) => {
    const clean = rawMsg.trim().substring(0, PACING_CONFIG.CHAT_MAX_LENGTH);
    if (!clean) return;
    socket?.emit('sendChatMessage', { message: clean });
  };

  const clearError = () => setError(null);

  const updateSession = (newSession: Partial<UserSession>) => {
    setSession((prev) => {
      const updated = { ...prev, ...newSession };
      if (newSession.customization && socket) {
        socket.emit('updateCustomization', { customization: newSession.customization });
      }
      return updated;
    });
  };

  const earnCoins = (amount: number) => {
    setSession((prev) => ({
      ...prev,
      quakeCoins: prev.quakeCoins + amount,
      stats: {
        ...prev.stats,
        totalQuakeCoinsEarned: prev.stats.totalQuakeCoinsEarned + amount,
      },
    }));
    audio.playSparkleChime();
  };

  const claimDailyCoins = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const today = new Date().toISOString().slice(0, 10);
      if (session.lastDailyClaimDate === today) {
        setError('Daily 200 free coins have already been claimed today!');
        return resolve(false);
      }
      if (!socket) {
        // Fallback offline session claim
        setSession((prev) => ({
          ...prev,
          quakeCoins: prev.quakeCoins + 200,
          lastDailyClaimDate: today,
          stats: {
            ...prev.stats,
            totalQuakeCoinsEarned: prev.stats.totalQuakeCoinsEarned + 200,
          },
        }));
        audio.playSparkleChime();
        return resolve(true);
      }
      socket.emit('claimDailyCoins', { sessionId: session.sessionId }, (res: any) => {
        if (res && res.success) {
          setSession((prev) => ({
            ...prev,
            quakeCoins: prev.quakeCoins + res.coinsAwarded,
            lastDailyClaimDate: res.claimDate,
            stats: {
              ...prev.stats,
              totalQuakeCoinsEarned: prev.stats.totalQuakeCoinsEarned + res.coinsAwarded,
            },
          }));
          audio.playSparkleChime();
          resolve(true);
        } else {
          setError(res?.error || 'Could not claim daily reward.');
          resolve(false);
        }
      });
    });
  };

  const unlockItem = (itemId: string, category: 'avatar' | 'dice' | 'theme', cost: number): boolean => {
    if (session.quakeCoins < cost) {
      setError(`Not enough QuakeCoins! You need ${cost} 🪙`);
      return false;
    }

    setSession((prev) => {
      const newCoins = prev.quakeCoins - cost;
      if (category === 'avatar') {
        return { ...prev, quakeCoins: newCoins, unlockedSkins: [...prev.unlockedSkins, itemId] };
      } else if (category === 'dice') {
        return { ...prev, quakeCoins: newCoins, unlockedDice: [...prev.unlockedDice, itemId] };
      } else {
        return { ...prev, quakeCoins: newCoins, unlockedThemes: [...prev.unlockedThemes, itemId] };
      }
    });

    audio.playSparkleChime();
    return true;
  };

  const createRoom = (name?: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!socket) return reject(new Error('Socket not connected'));

      const pName = name || session.playerName;
      socket.emit(
        'createRoom',
        {
          sessionId: session.sessionId,
          playerName: pName,
          customization: session.customization,
        },
        (res: any) => {
          if (res.success) {
            setGameState(res.state);
            setMyPlayerId(res.playerId);
            resolve(res.roomCode);
          } else {
            setError(res.error);
            reject(new Error(res.error));
          }
        }
      );
    });
  };

  const joinRoom = (roomCode: RoomCode, isSpectator = false): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!socket) return reject(new Error('Socket not connected'));

      socket.emit(
        'joinRoom',
        {
          roomCode,
          sessionId: session.sessionId,
          playerName: session.playerName,
          customization: session.customization,
          isSpectator,
        },
        (res: any) => {
          if (res.success) {
            setGameState(res.state);
            setMyPlayerId(res.playerId);
            resolve(true);
          } else {
            setError(res.error);
            reject(new Error(res.error));
          }
        }
      );
    });
  };

  const addBot = () => {
    socket?.emit('addBot');
    audio.playButtonTap();
  };

  const updateRules = (preset: PresetType, customRules?: Partial<GameRules>) => {
    socket?.emit('updateRules', { preset, customRules });
    audio.playButtonTap();
  };

  const updateTheme = (themeId: BoardThemeId) => {
    socket?.emit('updateTheme', { themeId });
    audio.playButtonTap();
  };

  const startGame = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      socket?.emit('startGame', {}, (res: any) => {
        if (res.success) {
          audio.playCardWhoosh();
          resolve(true);
        } else {
          setError(res.error);
          reject(new Error(res.error));
        }
      });
    });
  };

  const rollDice = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      audio.playDiceRoll();
      socket?.emit('rollDice', {}, (res: any) => {
        if (res.success) {
          resolve(res.roll);
        } else {
          setError(res.error);
          reject(new Error(res.error));
        }
      });
    });
  };

  const buyProperty = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      socket?.emit('buyProperty', {}, (res: any) => {
        if (res.success) {
          audio.playCashChaching();
          resolve(true);
        } else {
          setError(res.error);
          reject(new Error(res.error));
        }
      });
    });
  };

  const passProperty = () => {
    socket?.emit('passProperty');
    audio.playButtonTap();
  };

  const placeBid = (bidAmount: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      socket?.emit('placeBid', { bidAmount }, (res: any) => {
        if (res.success) {
          audio.playAuctionHammer();
          resolve(true);
        } else {
          setError(res.error);
          reject(new Error(res.error));
        }
      });
    });
  };

  const passAuction = () => {
    socket?.emit('passAuction');
    audio.playButtonTap();
  };

  const buildHouse = (tileId: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      socket?.emit('buildHouse', { tileId }, (res: any) => {
        if (res.success) {
          audio.playCashChaching();
          resolve(true);
        } else {
          setError(res.error);
          reject(new Error(res.error));
        }
      });
    });
  };

  const sellHouse = (tileId: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      socket?.emit('sellHouse', { tileId }, (res: any) => {
        if (res.success) {
          audio.playSellProperty();
          resolve(true);
        } else {
          setError(res.error);
          reject(new Error(res.error));
        }
      });
    });
  };

  const mortgageProperty = (tileId: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      socket?.emit('mortgageProperty', { tileId }, (res: any) => {
        if (res.success) {
          audio.playSellProperty();
          resolve(true);
        } else {
          setError(res.error);
          reject(new Error(res.error));
        }
      });
    });
  };

  const unmortgageProperty = (tileId: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      socket?.emit('unmortgageProperty', { tileId }, (res: any) => {
        if (res.success) {
          audio.playCashChaching();
          resolve(true);
        } else {
          setError(res.error);
          reject(new Error(res.error));
        }
      });
    });
  };

  const sellProperty = (tileId: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      socket?.emit('sellProperty', { tileId }, (res: any) => {
        if (res.success) {
          audio.playSellProperty();
          resolve(true);
        } else {
          setError(res.error);
          reject(new Error(res.error));
        }
      });
    });
  };

  const proposeTrade = (
    offer: Omit<TradeOffer, 'id' | 'createdAt' | 'status' | 'fromPlayerId'>
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      socket?.emit('proposeTrade', offer, (res: any) => {
        if (res.success) {
          audio.playCardWhoosh();
          const targetP = gameState?.players[offer.toPlayerId];
          showTradeToast('sent', `🤝 Trade offer sent to ${targetP?.name || 'Player'}! Awaiting response...`);
          resolve(true);
        } else {
          setError(res.error);
          reject(new Error(res.error));
        }
      });
    });
  };

  const respondTrade = (tradeId: string, action: 'accept' | 'decline' | 'cancel') => {
    socket?.emit('respondTrade', { tradeId, action });
    if (action === 'accept') audio.playCashChaching();
    else audio.playButtonTap();
  };

  const payBail = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      socket?.emit('payBail', {}, (res: any) => {
        if (res.success) {
          audio.playRentTransfer();
          resolve(true);
        } else {
          setError(res.error);
          reject(new Error(res.error));
        }
      });
    });
  };

  const usePrisonCard = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      socket?.emit('usePrisonCard', {}, (res: any) => {
        if (res.success) {
          audio.playCardWhoosh();
          resolve(true);
        } else {
          setError(res.error);
          reject(new Error(res.error));
        }
      });
    });
  };

  const endTurn = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      socket?.emit('endTurn', {}, (res: any) => {
        if (res.success) {
          audio.playButtonTap();
          resolve(true);
        } else {
          setError(res.error);
          reject(new Error(res.error));
        }
      });
    });
  };

  const declareBankruptcy = () => {
    socket?.emit('declareBankruptcy');
    audio.playJailClank();
  };

  const sendEmote = (emote: string) => {
    socket?.emit('sendEmote', { emote });
  };

  const sendAllianceRequest = (toPlayerId: PlayerId): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      socket?.emit('sendAllianceRequest', { toPlayerId }, (res: any) => {
        if (res?.success) {
          audio.playButtonTap();
          resolve(true);
        } else {
          setError(res?.error || 'Failed to send alliance request');
          reject(new Error(res?.error));
        }
      });
    });
  };

  const respondAllianceRequest = (requestId: string, response: 'accept' | 'decline'): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      socket?.emit('respondAllianceRequest', { requestId, response }, (res: any) => {
        if (res?.success) {
          if (response === 'accept') audio.playCashChaching();
          else audio.playButtonTap();
          resolve(true);
        } else {
          setError(res?.error || 'Failed to respond to alliance request');
          reject(new Error(res?.error));
        }
      });
    });
  };

  const proposeAllianceAgreement = (beneficiaryPlayerId: PlayerId, exemptions: Record<string, number>): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      socket?.emit('proposeAllianceAgreement', { beneficiaryPlayerId, exemptions }, (res: any) => {
        if (res?.success) {
          audio.playButtonTap();
          resolve(true);
        } else {
          setError(res?.error || 'Failed to propose alliance agreement');
          reject(new Error(res?.error));
        }
      });
    });
  };

  const respondAllianceAgreement = (agreementId: string, response: 'accept' | 'decline'): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      socket?.emit('respondAllianceAgreement', { agreementId, response }, (res: any) => {
        if (res?.success) {
          if (response === 'accept') audio.playCashChaching();
          else audio.playButtonTap();
          resolve(true);
        } else {
          setError(res?.error || 'Failed to respond to agreement');
          reject(new Error(res?.error));
        }
      });
    });
  };

  const breakAlliance = (targetPlayerId: PlayerId): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      socket?.emit('breakAlliance', { targetPlayerId }, (res: any) => {
        if (res?.success) {
          audio.playErrorBuzz();
          resolve(true);
        } else {
          setError(res?.error || 'Failed to break alliance');
          reject(new Error(res?.error));
        }
      });
    });
  };

  const spinCasinoEvent = () => {
    socket?.emit('spinCasinoEvent');
  };

  const resolveCasinoEvent = () => {
    socket?.emit('resolveCasinoEvent');
  };

  const leaveRoom = () => {
    setGameState(null);
    setMyPlayerId(null);
  };

  return (
    <SocketCtx.Provider
      value={{
        socket,
        isConnected,
        gameState,
        myPlayerId,
        session,
        displayedPawnPositions,
        isPawnStepping,
        turnPresentationPhase,
        animDice,
        activeMovingPlayerId,
        activeMovingPawnTrail,
        inspectedPlayerId,
        setInspectedPlayerId,
        error,
        clearError,
        updateSession,
        earnCoins,
        claimDailyCoins,
        unlockItem,
        createRoom,
        joinRoom,
        addBot,
        updateRules,
        updateTheme,
        startGame,
        rollDice,
        tradeToast,
        dismissTradeToast,
        sendChatMessage,
        buyProperty,
        passProperty,
        placeBid,
        passAuction,
        buildHouse,
        sellHouse,
        mortgageProperty,
        unmortgageProperty,
        sellProperty,
        spinCasinoEvent,
        resolveCasinoEvent,
        sendAllianceRequest,
        respondAllianceRequest,
        proposeAllianceAgreement,
        respondAllianceAgreement,
        breakAlliance,
        proposeTrade,
        respondTrade,
        payBail,
        usePrisonCard,
        endTurn,
        declareBankruptcy,
        sendEmote,
        leaveRoom,
      }}
    >
      {children}
    </SocketCtx.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketCtx);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
