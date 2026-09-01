import { v4 as uuidv4 } from 'uuid';
import { BotEngine } from './BotEngine';
import {
  BOT_NAMES,
  CASINO_SLOT_SYMBOLS,
  CHANCE_CARDS,
  FORTUNE_CARDS,
  PRESET_RULES,
  getRouletteColor,
} from '../../shared/constants';
import {
  calculateNetWorth,
  calculateRent,
  canBuildHouse,
  canMortgage,
  canSellHouse,
  canSellProperty,
  canUnmortgage,
  generateBoard,
} from '../../shared/gameLogic';
import {
  ActiveCasinoEvent,
  Alliance,
  AllianceAgreement,
  AllianceRequest,
  BoardThemeId,
  ChaosEvent,
  ChatMessage,
  DrawnCard,
  GameLog,
  GameRules,
  GameState,
  LiveAuction,
  Player,
  PlayerCustomization,
  PlayerId,
  PresetType,
  RoomCode,
  RouletteOutcome,
  SlotsOutcome,
  TradeOffer,
} from '../../shared/types';
import { ChaosEngine } from './ChaosEngine';

export class GameRoom {
  public state: GameState;
  public playerSockets: Map<PlayerId, string> = new Map(); // playerId -> socketId
  public sessionToPlayerId: Map<string, PlayerId> = new Map(); // sessionId -> playerId
  private disconnectTimers: Map<PlayerId, NodeJS.Timeout> = new Map();
  private turnTimer: NodeJS.Timeout | null = null;
  private auctionTimer: NodeJS.Timeout | null = null;
  private movementFallbackTimer: NodeJS.Timeout | null = null;
  private casinoEventTimer: NodeJS.Timeout | null = null;
  private onStateChange: (state: GameState) => void;

  constructor(
    roomCode: RoomCode,
    hostSessionId: string,
    hostName: string,
    hostCustomization: PlayerCustomization,
    onStateChange: (state: GameState) => void
  ) {
    this.onStateChange = onStateChange;

    const hostId = `p_${uuidv4().substring(0, 8)}`;
    this.sessionToPlayerId.set(hostSessionId, hostId);

    const initialRules: GameRules = { ...PRESET_RULES.classic };
    const initialBoard = generateBoard('world_tour');

    const hostPlayer: Player = {
      id: hostId,
      name: hostName || 'Host Jasmine',
      isHost: true,
      isBot: false,
      isSpectator: false,
      isConnected: true,
      cash: initialRules.startingCash,
      position: 0,
      inPrison: false,
      prisonTurns: 0,
      inventory: {
        properties: [],
        houses: {},
        mortgaged: {},
        getOutOfJailCards: 0,
      },
      customization: {
        ...(hostCustomization || {}),
        diceSkin: hostCustomization?.diceSkin || 'dice_classic',
      },
      stats: {
        rentCollected: 0,
        rentPaid: 0,
        tradesCompleted: 0,
        propertiesBought: 0,
        timesInPrison: 0,
        doublesRolled: 0,
        bankruptciesCaused: 0,
        highestCash: initialRules.startingCash,
        totalRolls: 0,
      },
      isBankrupt: false,
    };

    this.state = {
      roomCode,
      hostId,
      phase: 'lobby',
      preset: 'classic',
      themeId: 'world_tour',
      rules: initialRules,
      board: initialBoard,
      players: { [hostId]: hostPlayer },
      playerOrder: [hostId],
      spectators: {},
      turn: {
        currentPlayerId: hostId,
        dice: [1, 1],
        isDouble: false,
        doublesCount: 0,
        hasRolled: false,
        pendingAction: null,
        turnTimerSeconds: 60,
        turnNumber: 0,
      },
      potCash: 0,
      activeAuction: null,
      activeTrade: null,
      activeChaosEvents: [],
      activeAlliances: [],
      activeAllianceAgreements: [],
      pendingAllianceRequests: [],
      pendingAllianceAgreements: [],
      allianceDissolutionNotice: null,
      activeCasinoEvent: null,
      lastCardDrawn: null,
      logs: [],
      chatMessages: [],
      winnerId: null,
      gameStats: {
        startTime: Date.now(),
        totalTurns: 0,
        totalRentExchanged: 0,
        totalBankruptcies: 0,
      },
    };

    this.addLog('chat', `Room ${roomCode} created! Welcome to Cashquake!`);
  }

  // --- Chat Message ---
  public sendChatMessage(playerId: PlayerId, rawMessage: string): void {
    const player = this.state.players[playerId];
    if (!player) return;

    const message = rawMessage.trim().substring(0, 180);
    if (!message) return;

    const chatMsg: ChatMessage = {
      id: uuidv4(),
      playerId,
      playerName: player.name,
      playerColor: player.customization?.color || '#EC4899',
      playerTitle: player.customization?.title,
      avatarId: player.customization?.avatarId || player.customization?.avatarIcon || 'av_star',
      message,
      timestamp: Date.now(),
    };

    this.state.chatMessages.push(chatMsg);
    if (this.state.chatMessages.length > 100) {
      this.state.chatMessages.shift();
    }

    this.broadcast();
  }

  // --- Utility & Logging ---
  public addLog(type: GameLog['type'], message: string, playerId?: PlayerId, meta?: any): void {
    const log: GameLog = {
      id: `log_${uuidv4().substring(0, 8)}`,
      timestamp: Date.now(),
      type,
      message,
      playerId,
      meta,
    };
    this.state.logs.unshift(log);
    if (this.state.logs.length > 80) {
      this.state.logs.pop();
    }
  }

  public broadcast(): void {
    if (typeof this.onStateChange === 'function') {
      this.onStateChange(this.state);
    }
  }

  // --- Lobby Management ---
  private getDistinctColor(preferredColor?: string, excludePlayerId?: string): string {
    const AVAILABLE_COLORS = ['#EC4899', '#38BDF8', '#F97316', '#22C55E', '#A855F7', '#EAB308', '#EF4444', '#14B8A6'];
    const takenColors = new Set(
      Object.values(this.state.players)
        .filter((p) => p.id !== excludePlayerId && !p.isBankrupt)
        .map((p) => (p.customization?.color || '').toUpperCase())
    );

    if (preferredColor && !takenColors.has(preferredColor.toUpperCase())) {
      return preferredColor;
    }
    for (const color of AVAILABLE_COLORS) {
      if (!takenColors.has(color.toUpperCase())) {
        return color;
      }
    }
    return preferredColor || '#EC4899';
  }

  public getState(): GameState {
    return this.state;
  }

  public joinPlayer(
    sessionId: string,
    socketId: string,
    name: string,
    customization: PlayerCustomization,
    isSpectator: boolean = false
  ): PlayerId {
    // Reconnection check
    if (this.sessionToPlayerId.has(sessionId)) {
      const existingPlayerId = this.sessionToPlayerId.get(sessionId)!;
      const existingPlayer = this.state.players[existingPlayerId];
      if (existingPlayer) {
        if (existingPlayer.isBankrupt) {
          // Reconnect window expired or player bankrupted -> join as spectator
          const spectatorId = `spec_${uuidv4().substring(0, 8)}`;
          this.state.spectators[spectatorId] = {
            id: spectatorId,
            name: `${existingPlayer.name} (Spectator)`,
            avatarIcon: customization.avatarIcon || '👁️',
          };
          this.addLog('chat', `${existingPlayer.name} rejoined as a spectator (reconnect window expired).`);
          this.broadcast();
          return spectatorId;
        }

        // Cancel disconnect grace timer if active
        const disconnectTimer = this.disconnectTimers.get(existingPlayerId);
        if (disconnectTimer) {
          clearTimeout(disconnectTimer);
          this.disconnectTimers.delete(existingPlayerId);
        }

        existingPlayer.isConnected = true;
        delete existingPlayer.disconnectedAt;
        delete existingPlayer.reconnectDeadline;
        this.playerSockets.set(existingPlayerId, socketId);
        this.addLog('chat', `🟢 ${existingPlayer.name} reconnected! State restored.`, existingPlayerId);
        this.broadcast();
        return existingPlayerId;
      }
    }

    if (isSpectator || (this.state.phase !== 'lobby' && !this.sessionToPlayerId.has(sessionId))) {
      const spectatorId = `spec_${uuidv4().substring(0, 8)}`;
      this.state.spectators[spectatorId] = {
        id: spectatorId,
        name: name || 'Spectator',
        avatarIcon: customization.avatarIcon || '👁️',
      };
      this.addLog('chat', `${name || 'Spectator'} joined as a spectator.`);
      this.broadcast();
      return spectatorId;
    }

    if (Object.keys(this.state.players).length >= this.state.rules.maxPlayers) {
      throw new Error('Lobby is currently full');
    }

    const playerId = `p_${uuidv4().substring(0, 8)}`;
    this.sessionToPlayerId.set(sessionId, playerId);
    this.playerSockets.set(playerId, socketId);

    const playerCustomization = {
      ...(customization || {}),
      diceSkin: customization?.diceSkin || 'dice_classic',
      color: this.getDistinctColor(customization?.color),
    };

    const newPlayer: Player = {
      id: playerId,
      name: name || `Player ${Object.keys(this.state.players).length + 1}`,
      isHost: false,
      isBot: false,
      isSpectator: false,
      isConnected: true,
      cash: this.state.rules.startingCash,
      position: 0,
      inPrison: false,
      prisonTurns: 0,
      inventory: {
        properties: [],
        houses: {},
        mortgaged: {},
        getOutOfJailCards: 0,
      },
      customization: playerCustomization,
      stats: {
        rentCollected: 0,
        rentPaid: 0,
        tradesCompleted: 0,
        propertiesBought: 0,
        timesInPrison: 0,
        doublesRolled: 0,
        bankruptciesCaused: 0,
        highestCash: this.state.rules.startingCash,
        totalRolls: 0,
      },
      isBankrupt: false,
    };

    this.state.players[playerId] = newPlayer;
    this.state.playerOrder.push(playerId);
    this.addLog('chat', `${newPlayer.name} joined the game!`, playerId);
    this.broadcast();
    return playerId;
  }

  public addBot(): void {
    if (this.state.phase !== 'lobby') return;
    if (Object.keys(this.state.players).length >= this.state.rules.maxPlayers) return;

    const availableBotProfiles = BOT_NAMES.filter(
      (b) => !Object.values(this.state.players).some((p) => p.name.includes(b.name.split(' ')[0]))
    );
    const profile = availableBotProfiles[0] || BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];

    const botId = `bot_${uuidv4().substring(0, 8)}`;
    const botColor = this.getDistinctColor(profile.color);

    const botPlayer: Player = {
      id: botId,
      name: profile.name,
      isHost: false,
      isBot: true,
      isSpectator: false,
      isConnected: true,
      cash: this.state.rules.startingCash,
      position: 0,
      inPrison: false,
      prisonTurns: 0,
      inventory: {
        properties: [],
        houses: {},
        mortgaged: {},
        getOutOfJailCards: 0,
      },
      customization: {
        avatarId: 'bot',
        avatarIcon: profile.avatarIcon,
        color: botColor,
        diceSkin: 'dice_classic',
        trailEffect: 'trail_sparkles',
        title: 'Quake Bot',
      },
      stats: {
        rentCollected: 0,
        rentPaid: 0,
        tradesCompleted: 0,
        propertiesBought: 0,
        timesInPrison: 0,
        doublesRolled: 0,
        bankruptciesCaused: 0,
        highestCash: this.state.rules.startingCash,
        totalRolls: 0,
      },
      isBankrupt: false,
      personality: profile.personality as any,
    };

    this.state.players[botId] = botPlayer;
    this.state.playerOrder.push(botId);
    this.addLog('chat', `${botPlayer.name} entered the lobby!`);
    this.broadcast();
  }

  public removePlayer(playerId: PlayerId): void {
    if (this.state.phase === 'lobby') {
      delete this.state.players[playerId];
      this.state.playerOrder = this.state.playerOrder.filter((id) => id !== playerId);
      delete this.state.spectators[playerId];
      this.broadcast();
    } else {
      const player = this.state.players[playerId];
      if (player && !player.isBankrupt) {
        player.isConnected = false;
        player.disconnectedAt = Date.now();
        player.reconnectDeadline = Date.now() + 120000; // 2 minutes grace window
        this.addLog('chat', `⚠️ ${player.name} disconnected. Reconnect grace period: 2:00.`);

        // Clear any previous timer
        const prevTimer = this.disconnectTimers.get(playerId);
        if (prevTimer) clearTimeout(prevTimer);

        // Schedule 2-minute server-authoritative forfeit
        const timer = setTimeout(() => {
          this.handleDisconnectExpiry(playerId);
        }, 120000);
        this.disconnectTimers.set(playerId, timer);

        this.broadcast();
      }
    }
  }

  private handleDisconnectExpiry(playerId: PlayerId): void {
    const player = this.state.players[playerId];
    if (!player || player.isConnected || player.isBankrupt) return;

    this.addLog('bankrupt', `⏱️ ${player.name}'s 2-minute reconnect window expired. Forfeited match.`);
    this.declareBankruptcy(playerId, null);
    this.disconnectTimers.delete(playerId);
  }

  public updateRules(preset: PresetType, customRules?: Partial<GameRules>): void {
    if (this.state.phase !== 'lobby') return;
    this.state.preset = preset;
    if (preset === 'custom' && customRules) {
      this.state.rules = { ...this.state.rules, ...customRules };
    } else if (PRESET_RULES[preset]) {
      this.state.rules = { ...PRESET_RULES[preset] };
    }
    // Update player starting cash
    for (const p of Object.values(this.state.players)) {
      p.cash = this.state.rules.startingCash;
      p.stats.highestCash = this.state.rules.startingCash;
    }

    const logMsg = `Game rules updated: Preset [${preset.toUpperCase()}]`;
    // Prevent repetitive duplicate spam in lobby logs
    const latestLog = this.state.logs[0];
    if (latestLog && latestLog.message.startsWith('Game rules updated')) {
      latestLog.message = logMsg;
      latestLog.timestamp = Date.now();
    } else {
      this.addLog('chat', logMsg);
    }
    this.broadcast();
  }

  public updateTheme(themeId: BoardThemeId): void {
    if (this.state.phase !== 'lobby') return;
    this.state.themeId = themeId;
    this.state.board = generateBoard(themeId);
    const themeName = this.state.board[0].name.split(' ')[0] || themeId;
    const logMsg = `Board theme changed to: ${themeName}`;
    const latestLog = this.state.logs[0];
    if (latestLog && latestLog.message.startsWith('Board theme changed')) {
      latestLog.message = logMsg;
      latestLog.timestamp = Date.now();
    } else {
      this.addLog('chat', logMsg);
    }
    this.broadcast();
  }

  public updatePlayerCustomization(playerId: PlayerId, customization: Partial<PlayerCustomization>): void {
    const player = this.state.players[playerId];
    if (player) {
      if (customization.color) {
        customization.color = this.getDistinctColor(customization.color, playerId);
      }
      player.customization = { ...player.customization, ...customization };
      this.broadcast();
    }
  }

  public startGame(): void {
    if (this.state.phase !== 'lobby') return;
    const playerIds = Object.keys(this.state.players);
    if (playerIds.length < 2) {
      throw new Error('At least 2 players are required to start the game.');
    }

    // Authoritatively re-assert starting cash for all active players
    for (const p of Object.values(this.state.players)) {
      p.cash = this.state.rules.startingCash;
      p.stats.highestCash = this.state.rules.startingCash;
      p.position = 0;
      p.inPrison = false;
      p.prisonTurns = 0;
    }

    // Shuffle player order for fairness
    this.state.playerOrder = [...playerIds].sort(() => Math.random() - 0.5);
    this.state.board = generateBoard(this.state.themeId);
    this.state.phase = 'rolling';
    this.state.turn.currentPlayerId = this.state.playerOrder[0];
    this.state.turn.turnNumber = 1;
    this.state.turn.hasRolled = false;
    this.state.turn.pendingAction = null;
    this.state.gameStats.startTime = Date.now();

    this.addLog('roll', `Game started! ${this.state.players[this.state.turn.currentPlayerId].name} takes the first turn!`);
    this.checkAndDissolveAlliancesFor1v1();
    this.startTurnCountdown();
    this.broadcast();
  }

  // --- Turn Lifecycle ---
  private startTurnCountdown(): void {
    if (this.turnTimer) clearInterval(this.turnTimer);
    const currentP = this.getCurrentPlayer();
    const isDisconnectedTurn = currentP && !currentP.isConnected;
    let durationSec = this.state.rules.turnTimeLimitSeconds;

    if (durationSec <= 0) {
      if (isDisconnectedTurn) {
        durationSec = 20; // 20s fallback turn timeout for disconnected player
      } else {
        this.state.turn.turnTimerSeconds = 0;
        this.state.turn.turnEndsAt = 0;
        return;
      }
    }
    this.state.turn.turnTimerSeconds = durationSec;
    this.state.turn.turnEndsAt = Date.now() + durationSec * 1000;

    this.turnTimer = setInterval(() => {
      if (!this.state.turn.turnEndsAt) return;
      const remainingMs = this.state.turn.turnEndsAt - Date.now();
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
      this.state.turn.turnTimerSeconds = remainingSec;

      if (remainingSec <= 0) {
        if (this.turnTimer) clearInterval(this.turnTimer);
        this.handleTurnTimeout();
      }
    }, 1000);
  }

  private handleTurnTimeout(): void {
    if (this.state.phase === 'auction' || this.state.phase === 'game_over') {
      return;
    }
    const currentP = this.getCurrentPlayer();
    if (!currentP) return;

    this.addLog('chat', `${currentP.name}'s turn timed out! Auto-ending turn.`);
    if (this.state.phase === 'rolling' && !this.state.turn.hasRolled) {
      try {
        this.rollDice(currentP.id);
      } catch (err) {
        // Ignored
      }
    }
    // Auto-resolve pending actions
    if (this.state.turn.pendingAction === 'buy_property') {
      this.passProperty(currentP.id);
    } else {
      this.endTurn(currentP.id);
    }
  }

  public getCurrentPlayer(): Player | undefined {
    return this.state.players[this.state.turn.currentPlayerId];
  }

  public rollDice(playerId: PlayerId): { d1: number; d2: number; isDouble: boolean } {
    if (this.state.phase !== 'rolling' || this.state.turn.currentPlayerId !== playerId) {
      throw new Error('Not your turn to roll');
    }
    if (this.state.turn.hasRolled) {
      throw new Error('Already rolled this turn');
    }

    const player = this.state.players[playerId];
    if (!player || player.isBankrupt) {
      throw new Error('Invalid player');
    }

    if (player.cash < 0) {
      throw new Error(`You have an outstanding debt of $${Math.abs(player.cash)}. Resolve your debt or declare bankruptcy before rolling.`);
    }

    const diceSides = this.state.rules.diceMode === '2d12' ? 12 : 6;
    const d1 = Math.floor(Math.random() * diceSides) + 1;
    const d2 = Math.floor(Math.random() * diceSides) + 1;
    const isDouble = d1 === d2;

    this.state.turn.dice = [d1, d2];
    this.state.turn.isDouble = isDouble;
    this.state.turn.hasRolled = true;
    player.stats.totalRolls += 1;

    // Snake eyes bonus
    if (d1 === 1 && d2 === 1 && this.state.rules.snakeEyesBonusCash > 0) {
      player.cash += this.state.rules.snakeEyesBonusCash;
      this.addLog('rent', `🎲 SNAKE EYES! ${player.name} collected +$${this.state.rules.snakeEyesBonusCash} bonus cash!`, playerId);
    }

    if (isDouble) {
      player.stats.doublesRolled += 1;
      this.state.turn.doublesCount += 1;

      // Check 3 doubles in a row penalty
      if (this.state.turn.doublesCount >= this.state.rules.maxDoublesBeforePrison) {
        this.addLog('prison', `🚨 Speeding violation! ${player.name} rolled 3 doubles in a row and was sent to Detention!`, playerId);
        this.sendToPrison(player);
        this.broadcast();
        return { d1, d2, isDouble };
      }
    } else {
      this.state.turn.doublesCount = 0;
    }

    // If player is in prison
    if (player.inPrison) {
      if (isDouble) {
        player.inPrison = false;
        player.prisonTurns = 0;
        this.addLog('prison', `🔓 ${player.name} rolled doubles and escaped Detention!`, playerId);
        this.startMovement(player, d1 + d2);
      } else {
        player.prisonTurns += 1;
        if (player.prisonTurns >= this.state.rules.prisonTurnsMax) {
          // Force bail
          player.cash -= this.state.rules.prisonBailAmount;
          player.inPrison = false;
          player.prisonTurns = 0;
          this.addLog('prison', `💸 Maximum time served. ${player.name} paid $${this.state.rules.prisonBailAmount} bail and was released.`, playerId);
          this.startMovement(player, d1 + d2);
        } else {
          this.state.phase = 'action_pending';
          this.state.turn.pendingAction = null;
        }
      }
    } else {
      // Normal movement
      this.startMovement(player, d1 + d2);
    }

    this.broadcast();
    return { d1, d2, isDouble };
  }

  public startMovement(player: Player, steps: number): void {
    if (this.movementFallbackTimer) {
      clearTimeout(this.movementFallbackTimer);
      this.movementFallbackTimer = null;
    }

    const startPos = player.position;
    const targetPos = (startPos + steps + 40) % 40;
    const passedGo = targetPos < startPos && steps > 0;

    // Update player position to target for client sync
    player.position = targetPos;

    this.state.phase = 'moving';
    this.state.turn.movement = {
      playerId: player.id,
      startPos,
      targetPos,
      steps,
      passedGo,
    };

    // Resilient safety timeout fallback in case of network drop or delayed client:
    // Tumble (1200ms) + Result Hold (1200ms) + Steps (steps * 200ms) + Arrival Pause (700ms) + Buffer (1500ms)
    const presentationWaitMs = 1200 + 1200 + (steps * 200) + 700 + 1500;
    this.movementFallbackTimer = setTimeout(() => {
      this.resolvePawnLanding(player.id);
    }, presentationWaitMs);
  }

  public movePlayer(player: Player, steps: number): void {
    this.startMovement(player, steps);
  }

  public resolvePawnLanding(playerId: PlayerId): void {
    if (this.state.phase !== 'moving' || this.state.turn.currentPlayerId !== playerId) {
      return;
    }

    if (this.movementFallbackTimer) {
      clearTimeout(this.movementFallbackTimer);
      this.movementFallbackTimer = null;
    }

    const player = this.state.players[playerId];
    if (!player || player.isBankrupt) return;

    const movement = this.state.turn.movement;
    const targetPos = movement ? movement.targetPos : player.position;
    player.position = targetPos;

    // Passing GO check & reward (Executed ONLY on landing/arrival!)
    if (movement?.passedGo) {
      let goReward = this.state.rules.goReward;
      if (targetPos === 0 && this.state.rules.exactGoBonus) {
        goReward *= 2;
        this.addLog('rent', `🎯 EXACT GO LANDING! ${player.name} collected DOUBLE reward: $${goReward}!`, player.id);
      } else {
        this.addLog('rent', `🚩 ${player.name} passed GO and collected $${goReward}!`, player.id);
      }
      player.cash += goReward;
      if (player.cash > player.stats.highestCash) player.stats.highestCash = player.cash;
    }

    this.state.turn.movement = null;
    this.handleTileLanding(player, targetPos);
    this.broadcast();
  }

  private handleTileLanding(player: Player, tileIndex: number): void {
    const tile = this.state.board[tileIndex];
    if (!tile) return;

    // 1. Unowned Property / Railroad / Utility
    if (tile.type === 'property' || tile.type === 'railroad' || tile.type === 'utility') {
      const owner = this.getPropertyOwner(tile.id);
      if (!owner) {
        // Can buy
        this.state.phase = 'action_pending';
        this.state.turn.pendingAction = 'buy_property';
      } else if (owner.id !== player.id) {
        // Pay rent
        const diceTotal = this.state.turn.dice[0] + this.state.turn.dice[1];
        const normalRent = calculateRent(
          tile,
          owner,
          this.state.board,
          this.state.rules,
          this.state.activeChaosEvents,
          diceTotal
        );

        let finalRent = normalRent;
        let exemptionPct = 0;

        // Check for active directional alliance agreement (owner granting discount to landing player)
        if (this.state.rules.alliancesEnabled && normalRent > 0) {
          const agreement = this.getActiveAgreement(owner.id, player.id);
          if (agreement && agreement.exemptions[tile.id] !== undefined) {
            exemptionPct = Math.min(100, Math.max(0, agreement.exemptions[tile.id]));
            if (exemptionPct > 0) {
              finalRent = Math.round(normalRent * (1 - exemptionPct / 100));
            }
          }
        }

        if (finalRent > 0) {
          this.executeRentPayment(player, owner, finalRent, tile.name);
        } else if (normalRent > 0 && exemptionPct === 100) {
          this.addLog('rent', `🛡️ Alliance Exemption: ${player.name} paid $0 rent on ${tile.name} (100% exemption from ${owner.name}).`, player.id);
        }
        this.state.phase = 'action_pending';
        this.state.turn.pendingAction = null;
      } else {
        // Owns property
        this.state.phase = 'action_pending';
        this.state.turn.pendingAction = null;
      }
    }
    // 2. Tax Space
    else if (tile.type === 'tax') {
      const tax = tile.taxAmount || 100;
      let actualTax = tax;
      const isDoubleTax = this.state.activeChaosEvents.some((e) => e.effectType === 'double_tax');
      if (isDoubleTax) actualTax *= 2;

      player.cash -= actualTax;
      if (this.state.rules.vacationCashPot) {
        this.state.potCash += actualTax;
        this.addLog('rent', `🏛️ ${player.name} paid $${actualTax} tax into the Vacation Pot!`, player.id);
      } else {
        this.addLog('rent', `🏛️ ${player.name} paid $${actualTax} tax to the bank.`, player.id);
      }
      this.checkBankruptcy(player, null);
      this.state.phase = 'action_pending';
      this.state.turn.pendingAction = null;
    }
    // 3. Vacation / Free Parking Pot
    else if (tile.type === 'vacation') {
      if (this.state.rules.vacationCashPot && this.state.potCash > 0) {
        const pot = this.state.potCash;
        player.cash += pot;
        this.state.potCash = 0;
        this.addLog('buy', `🏖️ JACKPOT! ${player.name} landed on Vacation and swept the $${pot} Cash Pot!`, player.id);
      }
      this.state.phase = 'action_pending';
      this.state.turn.pendingAction = null;
    }
    // 4. Go To Prison
    else if (tile.type === 'go_to_prison') {
      this.addLog('prison', `🚨 ARRESTED! ${player.name} was sent directly to Detention!`, player.id);
      this.sendToPrison(player);
    }
    // 5. Chance Card (or Lucky Roulette in Casino theme)
    else if (tile.type === 'chance') {
      if (this.state.themeId === 'casino_royale') {
        this.triggerCasinoEvent(player, 'roulette');
      } else {
        this.drawCard(player, 'chance');
      }
    }
    // 6. Fortune Card (or Quake Slots in Casino theme)
    else if (tile.type === 'fortune') {
      if (this.state.themeId === 'casino_royale') {
        this.triggerCasinoEvent(player, 'slots');
      } else {
        this.drawCard(player, 'fortune');
      }
    }
    // 7. Start / Prison visiting
    else {
      this.state.phase = 'action_pending';
      this.state.turn.pendingAction = null;
    }
  }

  public getPropertyOwner(tileId: string): Player | undefined {
    return Object.values(this.state.players).find(
      (p) => !p.isBankrupt && p.inventory.properties.includes(tileId)
    );
  }

  private executeRentPayment(payer: Player, payee: Player, amount: number, tileName?: string): void {
    const isBloodMoney = this.state.activeChaosEvents.some((e) => e.effectType === 'blood_money');

    if (isBloodMoney) {
      const redirected = Math.round(amount * 0.3);
      const direct = amount - redirected;
      payer.cash -= amount;
      payee.cash += direct;

      // Find poorest player
      const activePlayers = Object.values(this.state.players).filter((p) => !p.isBankrupt);
      if (activePlayers.length > 0) {
        let poorest = activePlayers[0];
        for (const p of activePlayers) {
          if (p.cash < poorest.cash) poorest = p;
        }
        poorest.cash += redirected;
        this.addLog('chaos', `🩸 Blood Money: $${redirected} of rent was redistributed to ${poorest.name}!`);
      }
    } else {
      payer.cash -= amount;
      payee.cash += amount;
    }

    payer.stats.rentPaid += amount;
    payee.stats.rentCollected += amount;
    this.state.gameStats.totalRentExchanged += amount;

    if (payee.cash > payee.stats.highestCash) payee.stats.highestCash = payee.cash;

    this.addLog('rent', `💵 ${payer.name} paid ${payee.name} $${amount} rent${tileName ? ` for ${tileName}` : ''}.`, payer.id);
    this.checkBankruptcy(payer, payee);
  }

  private sendToPrison(player: Player): void {
    player.position = 10; // Detention tile
    player.inPrison = true;
    player.prisonTurns = 0;
    player.stats.timesInPrison += 1;
    this.state.turn.isDouble = false;
    this.state.turn.doublesCount = 0;
    this.state.phase = 'action_pending';
    this.state.turn.pendingAction = null;
  }

  // --- Interactive Casino Minigames (Casino Royale Theme) ---
  public triggerCasinoEvent(player: Player, eventType: 'roulette' | 'slots'): void {
    if (this.casinoEventTimer) {
      clearTimeout(this.casinoEventTimer);
      this.casinoEventTimer = null;
    }

    let outcome: RouletteOutcome | SlotsOutcome;

    if (eventType === 'roulette') {
      const number = Math.floor(Math.random() * 37); // 0 to 36
      const color = getRouletteColor(number);

      if (number === 0) {
        const rand = Math.random();
        if (rand < 0.25) {
          // Green Zero Mega Jackpot! ($350)
          outcome = {
            number,
            color: 'green',
            payout: 350,
            multiplier: 8,
            title: '🟢 GREEN ZERO JACKPOT!',
            description: 'Landed directly on Green #0! The house pays the maximum jackpot of $350!',
            isJackpot: true,
          };
        } else {
          // Green Zero House Rake (-$75)
          outcome = {
            number,
            color: 'green',
            payout: -75,
            multiplier: 0,
            title: '🟢 GREEN ZERO HOUSE RAKE',
            description: 'Landed on Green #0! The house takes a $75 table rake.',
            isJackpot: false,
          };
        }
      } else {
        // Red / Black spin
        const isRed = color === 'red';
        const rand = Math.random();
        let payout = 100;
        let multiplier = 2;
        let title = `${isRed ? '🔴 RED' : '⚫ BLACK'} #${number} HIT!`;
        let description = `The roulette ball stopped on ${isRed ? 'Red' : 'Black'} #${number}! Collected $100 chips.`;

        if (rand < 0.15) {
          // Lucky Straight Hit (+$200, 4x)
          payout = 200;
          multiplier = 4;
          title = `🎯 STRAIGHT NUMBER #${number} (${isRed ? 'RED' : 'BLACK'})!`;
          description = `Straight bet victory on #${number}! The dealer awards $200!`;
        } else if (rand < 0.40) {
          // Color Hit (+$100)
          payout = 100;
          multiplier = 2;
          title = `${isRed ? '🔴 RED' : '⚫ BLACK'} #${number} WIN!`;
          description = `Landed on ${isRed ? 'Red' : 'Black'} #${number}! Won $100 chips!`;
        } else if (rand < 0.60) {
          // High / Low or Split (+$50)
          payout = 50;
          multiplier = 1.5;
          title = `🎲 TABLE #${number} (${isRed ? 'RED' : 'BLACK'}) WIN!`;
          description = `Landed on #${number}! The table paid out $50.`;
        } else if (rand < 0.80) {
          // Push / Neutral ($0)
          payout = 0;
          multiplier = 1;
          title = `🔄 PUSH #${number} (${isRed ? 'RED' : 'BLACK'})`;
          description = `Landed on #${number}. Bets returned — no gain, no loss.`;
        } else if (rand < 0.95) {
          // House win (-$50)
          payout = -50;
          multiplier = 0;
          title = `💸 HOUSE WIN #${number} (${isRed ? 'RED' : 'BLACK'})`;
          description = `Landed on #${number}. The house takes the $50 table bet.`;
        } else {
          // Table bust (-$100)
          payout = -100;
          multiplier = 0;
          title = `💥 TABLE BUST #${number} (${isRed ? 'RED' : 'BLACK'})`;
          description = `Tough break on #${number}! The dealer sweeps the table for -$100.`;
        }

        outcome = {
          number,
          color,
          payout,
          multiplier,
          title,
          description,
          isJackpot: payout >= 300,
        };
      }
    } else {
      // 3-Reel Mechanical Slots
      const rand = Math.random();
      let reels: [string, string, string];
      let combinationName = '';
      let payout = 75;
      let multiplier = 2;
      let title = '';
      let description = '';
      let isJackpot = false;

      if (rand < 0.08) {
        // 777 MEGA JACKPOT
        reels = ['7️⃣', '7️⃣', '7️⃣'];
        combinationName = '777 TRIPLE SEVENS';
        payout = 500;
        multiplier = 10;
        isJackpot = true;
        title = '🎰 777 MEGA JACKPOT!';
        description = 'TRIPLE SEVENS! The slot machine explodes in gold! Collect $500!';
      } else if (rand < 0.18) {
        // DIAMOND VAULT
        reels = ['💎', '💎', '💎'];
        combinationName = 'TRIPLE DIAMONDS';
        payout = 300;
        multiplier = 6;
        isJackpot = true;
        title = '💎 DIAMOND VAULT HIT!';
        description = 'Triple sparkling diamonds! The vault unlocks for $300!';
      } else if (rand < 0.32) {
        // STAR BURST
        reels = ['⭐', '⭐', '⭐'];
        combinationName = 'TRIPLE STARS';
        payout = 200;
        multiplier = 4;
        title = '⭐ STAR BURST WIN!';
        description = 'Triple gold stars aligned! Awarded $200!';
      } else if (rand < 0.48) {
        // BELL CHIME
        reels = ['🔔', '🔔', '🔔'];
        combinationName = 'TRIPLE BELLS';
        payout = 150;
        multiplier = 3;
        title = '🔔 BELL CHIME PAYOUT!';
        description = 'Triple golden bells chime across the casino! Awarded $150!';
      } else if (rand < 0.65) {
        // CHERRIES
        reels = ['🍒', '🍒', '🍒'];
        combinationName = 'TRIPLE CHERRIES';
        payout = 100;
        multiplier = 2;
        title = '🍒 SWEET CHERRY LINE!';
        description = 'Triple juicy cherries on the payline! Won $100!';
      } else if (rand < 0.82) {
        // BARS / LEMONS
        const symbol = Math.random() > 0.5 ? 'BAR' : '🍋';
        reels = [symbol, symbol, symbol];
        combinationName = symbol === 'BAR' ? 'TRIPLE BARS' : 'TRIPLE LEMONS';
        payout = symbol === 'BAR' ? 80 : 65;
        multiplier = 1.5;
        title = `🍫 ${combinationName}!`;
        description = `Aligned 3 matching ${symbol} symbols! Collected $${payout}!`;
      } else if (rand < 0.94) {
        // DOUBLE MATCH
        const sym1 = CASINO_SLOT_SYMBOLS[Math.floor(Math.random() * CASINO_SLOT_SYMBOLS.length)];
        const remaining = CASINO_SLOT_SYMBOLS.filter((s) => s !== sym1);
        const sym2 = remaining[Math.floor(Math.random() * remaining.length)];
        reels = [sym1, sym1, sym2];
        combinationName = `DOUBLE ${sym1}`;
        payout = 35;
        multiplier = 1;
        title = `🍀 LUCKY PAIR (${sym1} ${sym1})!`;
        description = `Hit a matching pair of ${sym1}! Won $35 chips!`;
      } else {
        // NO MATCH
        reels = ['🍒', '🍋', '🔔'];
        combinationName = 'HOUSE SPIN';
        payout = -20;
        multiplier = 0;
        title = '💨 HOUSE SPIN';
        description = 'No payline match. Paid $20 dealer fee.';
      }

      outcome = {
        reels,
        combinationName,
        payout,
        multiplier,
        title,
        description,
        isJackpot,
      };
    }

    this.state.activeCasinoEvent = {
      id: `casino_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      playerId: player.id,
      eventType,
      outcome,
      status: 'ready',
      createdAt: Date.now(),
    };

    this.state.phase = 'action_pending';
    this.state.turn.pendingAction = null;

    if (player.isBot) {
      // 1. Short anticipation (400ms) -> trigger spin/lever pull
      setTimeout(() => {
        if (this.state.activeCasinoEvent && this.state.activeCasinoEvent.playerId === player.id) {
          this.spinCasinoEvent(player.id);
        }
      }, 400);

      // 2. Allow full client animation (~2.6-2.9s spin + ~1.3-1.5s outcome reveal) -> auto-resolve
      const botAnimationDurationMs = eventType === 'slots' ? 4400 : 5000;
      this.casinoEventTimer = setTimeout(() => {
        if (this.state.activeCasinoEvent && this.state.activeCasinoEvent.playerId === player.id) {
          this.resolveCasinoEvent(player.id);
          // Resume bot turn progression after resolving casino event
          setTimeout(() => {
            BotEngine.handleBotTurn(this);
          }, 600);
        }
      }, botAnimationDurationMs);
    } else {
      // Human player safety fallback auto-resolution after 25s in case of disconnection
      this.casinoEventTimer = setTimeout(() => {
        this.resolveCasinoEvent(player.id);
      }, 25000);
    }
  }

  public spinCasinoEvent(playerId: PlayerId): void {
    if (!this.state.activeCasinoEvent || this.state.activeCasinoEvent.playerId !== playerId) {
      return;
    }
    this.state.activeCasinoEvent.status = 'spinning';
    this.broadcast();
  }

  public resolveCasinoEvent(playerId: PlayerId): void {
    if (!this.state.activeCasinoEvent || this.state.activeCasinoEvent.playerId !== playerId) {
      return;
    }

    if (this.casinoEventTimer) {
      clearTimeout(this.casinoEventTimer);
      this.casinoEventTimer = null;
    }

    const event = this.state.activeCasinoEvent;
    const player = this.state.players[playerId];
    const outcome = event.outcome;

    if (player && !player.isBankrupt) {
      if (outcome.payout !== 0) {
        player.cash += outcome.payout;
        if (player.cash > player.stats.highestCash) player.stats.highestCash = player.cash;
      }

      // Log clean single high-value summary (concise Activity Log philosophy)
      if (event.eventType === 'slots') {
        const slotsOut = outcome as SlotsOutcome;
        if (slotsOut.isJackpot) {
          this.addLog('buy', `🎰 JACKPOT! ${player.name} hit ${slotsOut.reels.join(' ')} on the Slots and won $${slotsOut.payout}!`, player.id);
        } else if (slotsOut.payout > 0) {
          this.addLog('buy', `🎰 ${player.name} hit ${slotsOut.reels.join(' ')} on the Slots and won $${slotsOut.payout}!`, player.id);
        } else if (slotsOut.payout < 0) {
          this.addLog('rent', `🎰 ${player.name} spun the Slots and paid $${Math.abs(slotsOut.payout)} house rake.`, player.id);
        } else {
          this.addLog('buy', `🎰 ${player.name} spun the Slots and broke even.`, player.id);
        }
      } else {
        const rOut = outcome as RouletteOutcome;
        if (rOut.isJackpot) {
          this.addLog('buy', `🎡 MEGA JACKPOT! ${player.name} landed on #${rOut.number} (${rOut.color.toUpperCase()}) on Roulette and won $${rOut.payout}!`, player.id);
        } else if (rOut.payout > 0) {
          this.addLog('buy', `🎡 ${player.name} spun #${rOut.number} (${rOut.color.toUpperCase()}) on Roulette and won $${rOut.payout}!`, player.id);
        } else if (rOut.payout < 0) {
          this.addLog('rent', `🎡 ${player.name} spun #${rOut.number} (${rOut.color.toUpperCase()}) on Roulette and paid $${Math.abs(rOut.payout)} dealer rake.`, player.id);
        } else {
          this.addLog('buy', `🎡 ${player.name} spun #${rOut.number} (${rOut.color.toUpperCase()}) on Roulette and broke even.`, player.id);
        }
      }

      this.checkBankruptcy(player, null);
    }

    this.state.activeCasinoEvent = null;
    this.state.phase = 'action_pending';
    this.state.turn.pendingAction = null;
    this.broadcast();
  }

  private drawCard(player: Player, type: 'chance' | 'fortune'): void {
    const deck = type === 'chance' ? CHANCE_CARDS : FORTUNE_CARDS;
    const card = deck[Math.floor(Math.random() * deck.length)];

    this.state.lastCardDrawn = {
      id: `draw_${uuidv4().substring(0, 8)}`,
      card,
      drawnByPlayerId: player.id,
      timestamp: Date.now(),
    };
    
    // Privacy-aware logging: Keep secret pass cards discreet to other players in the feed
    if (card.effect.action === 'get_out_of_prison') {
      this.addLog('card', `🎴 ${player.name} received a special pass card.`, player.id);
    } else {
      this.addLog('card', `🃏 ${player.name} drew [${card.title}]: ${card.description}`, player.id);
    }

    // Apply Card Effect
    const { effect } = card;
    if (effect.action === 'gain_cash' && effect.amount) {
      player.cash += effect.amount;
    } else if (effect.action === 'lose_cash' && effect.amount) {
      player.cash -= effect.amount;
      if (this.state.rules.vacationCashPot) {
        this.state.potCash += effect.amount;
      }
      this.checkBankruptcy(player, null);
    } else if (effect.action === 'move_to' && effect.targetIndex !== undefined) {
      const diff = (effect.targetIndex - player.position + 40) % 40;
      this.movePlayer(player, diff);
      return;
    } else if (effect.action === 'move_relative' && effect.amount) {
      this.movePlayer(player, effect.amount);
      return;
    } else if (effect.action === 'go_to_prison') {
      this.sendToPrison(player);
    } else if (effect.action === 'get_out_of_prison') {
      player.inventory.getOutOfJailCards += 1;
    } else if (effect.action === 'all_pay_player' && effect.amount) {
      for (const other of Object.values(this.state.players)) {
        if (other.id !== player.id && !other.isBankrupt) {
          other.cash -= effect.amount;
          player.cash += effect.amount;
          this.checkBankruptcy(other, player);
        }
      }
    } else if (effect.action === 'player_pay_all' && effect.amount) {
      for (const other of Object.values(this.state.players)) {
        if (other.id !== player.id && !other.isBankrupt) {
          player.cash -= effect.amount;
          other.cash += effect.amount;
        }
      }
      this.checkBankruptcy(player, null);
    } else if (effect.action === 'pay_per_building') {
      let repairBill = 0;
      for (const propId of player.inventory.properties) {
        const houses = player.inventory.houses[propId] || 0;
        if (houses === 5) {
          repairBill += effect.hotelAmount || 100;
        } else if (houses > 0) {
          repairBill += houses * (effect.houseAmount || 25);
        }
      }
      player.cash -= repairBill;
      this.addLog('rent', `🛠️ ${player.name} paid $${repairBill} for property renovations!`, player.id);
      this.checkBankruptcy(player, null);
    } else if (effect.action === 'chaos_trigger') {
      const chaosEvent = ChaosEngine.triggerRandomEvent(this.state);
      if (chaosEvent) {
        this.addLog('chaos', `🧨 CHAOS TRIGGERED: ${chaosEvent.title} - ${chaosEvent.description}`);
      }
    }

    this.state.phase = 'action_pending';
    this.state.turn.pendingAction = null;
  }

  // --- Property Interactions ---
  public buyProperty(playerId: PlayerId): void {
    if (this.state.turn.currentPlayerId !== playerId || this.state.turn.pendingAction !== 'buy_property') {
      throw new Error('Cannot buy property right now');
    }

    const player = this.state.players[playerId];
    if (!player || player.isBankrupt || player.isSpectator) {
      throw new Error('Bankrupt or spectating players cannot buy properties');
    }

    const tile = this.state.board[player.position];
    if (!tile || !tile.price) {
      throw new Error('Tile is not for sale');
    }

    if (player.cash < tile.price) {
      throw new Error(`Insufficient funds ($${player.cash} < $${tile.price})`);
    }

    player.cash -= tile.price;
    player.inventory.properties.push(tile.id);
    player.stats.propertiesBought += 1;

    this.addLog('buy', `🏡 ${player.name} purchased ${tile.name} for $${tile.price}!`, playerId);
    this.state.turn.pendingAction = null;
    this.broadcast();
  }

  public passProperty(playerId: PlayerId): void {
    if (this.state.turn.currentPlayerId !== playerId || this.state.turn.pendingAction !== 'buy_property') {
      return;
    }

    const player = this.state.players[playerId];
    if (!player || player.isBankrupt || player.isSpectator) {
      this.state.turn.pendingAction = null;
      return;
    }

    const tile = this.state.board[player.position];
    this.state.turn.pendingAction = null;

    const isOwned = Object.values(this.state.players).some(
      (p) => !p.isBankrupt && p.inventory.properties.includes(tile?.id || '')
    );

    if (this.state.rules.allowAuctions && tile && tile.price && !isOwned) {
      this.startAuction(tile.id);
    } else {
      this.broadcast();
    }
  }

  // --- Live Auctions ---
  public startAuction(propertyId: string): void {
    const tile = this.state.board.find((t) => t.id === propertyId);
    if (!tile || !tile.price) return;

    const activePlayerIds = Object.keys(this.state.players).filter(
      (id) => !this.state.players[id].isBankrupt && !this.state.players[id].isSpectator
    );

    this.state.phase = 'auction';
    this.state.activeAuction = {
      propertyId,
      currentBid: 10,
      highestBidderId: null,
      activePlayerIds,
      timeLeftSeconds: this.state.rules.auctionCountdown || 15,
      history: [],
      isFinished: false,
    };

    this.addLog('auction', `🔨 Auction started for ${tile.name}! Starting bid: $10`);

    if (this.turnTimer) clearInterval(this.turnTimer);
    if (this.auctionTimer) clearInterval(this.auctionTimer);
    this.auctionTimer = setInterval(() => {
      if (!this.state.activeAuction) return;

      this.state.activeAuction.timeLeftSeconds -= 1;
      if (this.state.activeAuction.timeLeftSeconds <= 0) {
        if (this.auctionTimer) clearInterval(this.auctionTimer);
        this.resolveAuction();
      }
      this.broadcast();
    }, 1000);

    this.broadcast();
  }

  public placeBid(playerId: PlayerId, bidAmount: number): void {
    const auction = this.state.activeAuction;
    if (!auction || auction.isFinished) throw new Error('No active auction');

    const player = this.state.players[playerId];
    if (!player || player.isBankrupt || player.isSpectator) throw new Error('Invalid bidder');

    if (bidAmount <= auction.currentBid) {
      throw new Error(`Bid must exceed current bid ($${auction.currentBid})`);
    }

    if (player.cash < bidAmount) {
      throw new Error(`You only have $${player.cash}`);
    }

    auction.currentBid = bidAmount;
    auction.highestBidderId = playerId;
    auction.timeLeftSeconds = Math.max(auction.timeLeftSeconds, 8); // Anti-sniping extension
    auction.history.push({ playerId, bid: bidAmount, timestamp: Date.now() });

    this.broadcast();
  }

  public passAuction(playerId: PlayerId): void {
    const auction = this.state.activeAuction;
    if (!auction || auction.isFinished) return;

    auction.activePlayerIds = auction.activePlayerIds.filter((id) => id !== playerId);

    if (auction.activePlayerIds.length <= 1 && auction.highestBidderId) {
      this.resolveAuction();
    } else {
      this.broadcast();
    }
  }

  private resolveAuction(): void {
    const auction = this.state.activeAuction;
    if (!auction) return;

    if (this.auctionTimer) clearInterval(this.auctionTimer);
    auction.isFinished = true;

    const tile = this.state.board.find((t) => t.id === auction.propertyId);
    if (auction.highestBidderId && tile) {
      const winner = this.state.players[auction.highestBidderId];
      if (winner && winner.cash >= auction.currentBid && !winner.isBankrupt && !winner.isSpectator) {
        winner.cash -= auction.currentBid;
        winner.inventory.properties.push(tile.id);
        winner.stats.propertiesBought += 1;
        this.addLog('auction', `🏆 ${winner.name} won the auction for ${tile.name} for $${auction.currentBid}!`, winner.id);
      }
    } else {
      this.addLog('auction', `❌ Auction closed with no winning bids for ${tile?.name || 'property'}.`);
    }

    this.state.activeAuction = null;
    this.state.phase = 'action_pending';
    this.broadcast();
  }

  // --- Upgrades, Mortgages, Trading ---
  public buildHouse(playerId: PlayerId, tileId: string): void {
    if (this.state.turn.currentPlayerId !== playerId) {
      throw new Error('You can only construct buildings during your turn');
    }

    const player = this.state.players[playerId];
    if (!player || player.isBankrupt || player.isSpectator) {
      throw new Error('Bankrupt or spectating players cannot construct buildings');
    }

    const check = canBuildHouse(player, tileId, this.state.board, this.state.rules, this.state.turn.currentPlayerId);
    if (!check.canBuild) {
      throw new Error(check.reason || 'Cannot build house');
    }

    player.cash -= check.cost;
    player.inventory.houses[tileId] = (player.inventory.houses[tileId] || 0) + 1;

    const tile = this.state.board.find((t) => t.id === tileId);
    const buildingType = player.inventory.houses[tileId] === 5 ? 'HOTEL 🏨' : 'HOUSE 🏠';
    this.addLog('buy', `🏗️ ${player.name} built a ${buildingType} on ${tile?.name} for $${check.cost}!`, playerId);
    this.broadcast();
  }

  public sellHouse(playerId: PlayerId, tileId: string): void {
    if (this.state.turn.currentPlayerId !== playerId) {
      throw new Error('You can only sell buildings during your turn');
    }

    const player = this.state.players[playerId];
    if (!player || player.isBankrupt || player.isSpectator) {
      throw new Error('Bankrupt or spectating players cannot sell buildings');
    }

    const check = canSellHouse(player, tileId, this.state.board, this.state.rules, this.state.turn.currentPlayerId);
    if (!check.canSell) {
      throw new Error(check.reason || 'Cannot sell house');
    }

    player.cash += check.refund;
    player.inventory.houses[tileId] = (player.inventory.houses[tileId] || 1) - 1;

    const tile = this.state.board.find((t) => t.id === tileId);
    this.addLog('buy', `🏚️ ${player.name} sold a building on ${tile?.name} for +$${check.refund}!`, playerId);
    this.broadcast();
  }

  public mortgageProperty(playerId: PlayerId, tileId: string): void {
    const player = this.state.players[playerId];
    if (!player || player.isBankrupt || player.isSpectator) {
      throw new Error('Bankrupt or spectating players cannot mortgage properties');
    }

    const check = canMortgage(player, tileId, this.state.board);
    if (!check.canMortgage) {
      throw new Error(check.reason || 'Cannot mortgage property');
    }

    player.inventory.mortgaged[tileId] = true;
    player.cash += check.value;

    const tile = this.state.board.find((t) => t.id === tileId);
    this.addLog('buy', `📜 ${player.name} mortgaged ${tile?.name} for +$${check.value}.`, playerId);
    this.broadcast();
  }

  public unmortgageProperty(playerId: PlayerId, tileId: string): void {
    const player = this.state.players[playerId];
    if (!player || player.isBankrupt || player.isSpectator) {
      throw new Error('Bankrupt or spectating players cannot unmortgage properties');
    }

    const check = canUnmortgage(player, tileId, this.state.board, this.state.rules);
    if (!check.canUnmortgage) {
      throw new Error(check.reason || 'Cannot unmortgage property');
    }

    player.cash -= check.cost;
    player.inventory.mortgaged[tileId] = false;

    const tile = this.state.board.find((t) => t.id === tileId);
    this.addLog('buy', `✨ ${player.name} unmortgaged ${tile?.name} for $${check.cost}!`, playerId);
    this.broadcast();
  }

  public sellProperty(playerId: PlayerId, tileId: string): void {
    const player = this.state.players[playerId];
    if (!player || player.isBankrupt || player.isSpectator) {
      throw new Error('Bankrupt or spectating players cannot sell properties');
    }

    const check = canSellProperty(player, tileId, this.state.board);
    if (!check.canSell) {
      throw new Error(check.reason || 'Cannot sell property');
    }

    player.inventory.properties = player.inventory.properties.filter((id) => id !== tileId);
    delete player.inventory.houses[tileId];
    delete player.inventory.mortgaged[tileId];

    player.cash += check.value;
    const tile = this.state.board.find((t) => t.id === tileId);
    this.addLog('buy', `🏷️ ${player.name} sold ${tile?.name} for +$${check.value}.`, playerId);
    this.broadcast();
  }

  public proposeTrade(offer: Omit<TradeOffer, 'id' | 'createdAt' | 'status'>): void {
    const fromP = this.state.players[offer.fromPlayerId];
    const toP = this.state.players[offer.toPlayerId];

    if (!fromP || !toP || fromP.isBankrupt || fromP.isSpectator || toP.isBankrupt || toP.isSpectator) {
      throw new Error('Bankrupt or spectating players cannot trade');
    }

    const trade: TradeOffer = {
      ...offer,
      id: `trade_${uuidv4().substring(0, 8)}`,
      createdAt: Date.now(),
      status: 'pending',
    };

    this.state.activeTrade = trade;

    this.addLog('trade', `🤝 ${fromP.name} offered ${toP.name} a trade.`);
    this.broadcast();

    // If target player is a BOT, autonomously evaluate and respond after a brief deliberation delay
    if (toP?.isBot) {
      setTimeout(() => {
        // Ensure trade is still pending
        if (!this.state.activeTrade || this.state.activeTrade.id !== trade.id) return;

        // Cash validation
        if (toP.cash < trade.requestedCash) {
          this.respondTrade(trade.id, 'decline');
          return;
        }

        // Calculate economic valuation
        const getTileCost = (id: string) => this.state.board.find((t) => t.id === id)?.price || 150;
        const offeredValue =
          trade.offeredCash +
          trade.offeredProperties.reduce((acc, id) => acc + getTileCost(id), 0) +
          trade.offeredCards * 50;
        const requestedValue =
          trade.requestedCash +
          trade.requestedProperties.reduce((acc, id) => acc + getTileCost(id), 0) +
          trade.requestedCards * 50;

        // Personality valuation adjustments
        let threshold = 0.95; // Balanced
        if (toP.personality === 'aggressive') threshold = 1.15;
        if (toP.personality === 'conservative') threshold = 1.05;
        if (toP.personality === 'chaotic') threshold = 0.80;

        const shouldAccept = offeredValue >= requestedValue * threshold;
        this.respondTrade(trade.id, shouldAccept ? 'accept' : 'decline');
      }, 1200);
    }
  }

  public respondTrade(tradeId: string, action: 'accept' | 'decline' | 'cancel'): void {
    const trade = this.state.activeTrade;
    if (!trade || trade.id !== tradeId) return;

    const fromP = this.state.players[trade.fromPlayerId];
    const toP = this.state.players[trade.toPlayerId];

    if (!fromP || !toP || fromP.isBankrupt || fromP.isSpectator || toP.isBankrupt || toP.isSpectator) {
      this.state.activeTrade = null;
      this.broadcast();
      return;
    }

    if (action === 'accept') {
      // Validate both parties have offered items & cash
      if (fromP.cash < trade.offeredCash || toP.cash < trade.requestedCash) {
        throw new Error('Insufficient cash for trade');
      }

      // Execute trade
      fromP.cash = fromP.cash - trade.offeredCash + trade.requestedCash;
      toP.cash = toP.cash - trade.requestedCash + trade.offeredCash;

      // Transfer properties
      for (const pId of trade.offeredProperties) {
        fromP.inventory.properties = fromP.inventory.properties.filter((id) => id !== pId);
        toP.inventory.properties.push(pId);
      }
      for (const pId of trade.requestedProperties) {
        toP.inventory.properties = toP.inventory.properties.filter((id) => id !== pId);
        fromP.inventory.properties.push(pId);
      }

      // Transfer cards
      fromP.inventory.getOutOfJailCards -= trade.offeredCards;
      toP.inventory.getOutOfJailCards += trade.offeredCards;
      toP.inventory.getOutOfJailCards -= trade.requestedCards;
      fromP.inventory.getOutOfJailCards += trade.requestedCards;

      fromP.stats.tradesCompleted += 1;
      toP.stats.tradesCompleted += 1;

      this.addLog('trade', `✅ ${toP.name} accepted ${fromP.name}'s trade.`);
    } else if (action === 'decline') {
      this.addLog('trade', `❌ ${toP?.name || 'Player'} rejected ${fromP?.name || 'Player'}'s trade.`);
    } else {
      this.addLog('trade', `⏱️ Trade offer between ${fromP?.name || 'Player'} and ${toP?.name || 'Player'} expired / cancelled.`);
    }

    this.state.activeTrade = null;
    this.broadcast();
  }

  // --- Alliance System (Negotiated Diplomacy & Exemption Agreements) ---
  public isAlliedWith(p1Id: PlayerId, p2Id: PlayerId): boolean {
    if (p1Id === p2Id) return false;
    return this.state.activeAlliances.some(
      (a) => a.memberIds.includes(p1Id) && a.memberIds.includes(p2Id)
    );
  }

  public getActiveAgreement(grantorId: PlayerId, beneficiaryId: PlayerId): AllianceAgreement | undefined {
    return this.state.activeAllianceAgreements.find(
      (agr) => agr.grantorPlayerId === grantorId && agr.beneficiaryPlayerId === beneficiaryId && agr.status === 'active'
    );
  }

  public sendAllianceRequest(fromPlayerId: PlayerId, toPlayerId: PlayerId): void {
    if (!this.state.rules.alliancesEnabled) {
      throw new Error('Alliances are disabled for this match');
    }

    const activePlayers = Object.values(this.state.players).filter((p) => !p.isBankrupt && !p.isSpectator);
    if (activePlayers.length <= 2) {
      throw new Error('Alliances are only available with 3 or more active players');
    }

    const fromP = this.state.players[fromPlayerId];
    const toP = this.state.players[toPlayerId];
    if (!fromP || !toP || fromP.isBankrupt || fromP.isSpectator || toP.isBankrupt || toP.isSpectator) {
      throw new Error('Invalid player for alliance request');
    }

    if (fromPlayerId === toPlayerId) {
      throw new Error('Cannot form an alliance with yourself');
    }

    if (this.isAlliedWith(fromPlayerId, toPlayerId)) {
      throw new Error('Already allied with this player');
    }

    const existingPending = this.state.pendingAllianceRequests.find(
      (r) =>
        (r.fromPlayerId === fromPlayerId && r.toPlayerId === toPlayerId) ||
        (r.fromPlayerId === toPlayerId && r.toPlayerId === fromPlayerId)
    );
    if (existingPending) {
      throw new Error('An alliance request is already pending between these players');
    }

    const request: AllianceRequest = {
      id: `allreq_${uuidv4().substring(0, 8)}`,
      fromPlayerId,
      toPlayerId,
      createdAt: Date.now(),
      status: 'pending',
    };

    this.state.pendingAllianceRequests.push(request);
    this.broadcast();

    // If toPlayer is a BOT, autonomously evaluate and respond after short delay
    if (toP.isBot) {
      setTimeout(() => {
        const stillPending = this.state.pendingAllianceRequests.find((r) => r.id === request.id);
        if (!stillPending) return;

        let accept = true;
        if (toP.personality === 'aggressive') {
          const sorted = Object.values(this.state.players).filter((p) => !p.isBankrupt).sort((a, b) => b.cash - a.cash);
          if (sorted[0]?.id === fromPlayerId) accept = false;
        } else if (toP.personality === 'chaotic') {
          accept = Math.random() > 0.3;
        }

        this.respondAllianceRequest(toP.id, request.id, accept ? 'accept' : 'decline');
      }, 1000);
    }
  }

  public respondAllianceRequest(toPlayerId: PlayerId, requestId: string, response: 'accept' | 'decline'): void {
    const req = this.state.pendingAllianceRequests.find((r) => r.id === requestId);
    if (!req || req.toPlayerId !== toPlayerId) return;

    const fromP = this.state.players[req.fromPlayerId];
    const toP = this.state.players[req.toPlayerId];

    if (response === 'accept' && fromP && toP && !fromP.isBankrupt && !toP.isBankrupt) {
      const activePlayers = Object.values(this.state.players).filter((p) => !p.isBankrupt && !p.isSpectator);
      if (activePlayers.length > 2 && this.state.rules.alliancesEnabled) {
        const alliance: Alliance = {
          id: `all_${uuidv4().substring(0, 8)}`,
          memberIds: [req.fromPlayerId, req.toPlayerId],
          createdAt: Date.now(),
        };
        this.state.activeAlliances.push(alliance);
        this.addLog('alliance', `🤝 ${fromP.name} and ${toP.name} formed an Alliance!`);
      }
    }

    this.state.pendingAllianceRequests = this.state.pendingAllianceRequests.filter((r) => r.id !== requestId);
    this.broadcast();
  }

  public proposeAllianceAgreement(
    grantorPlayerId: PlayerId,
    beneficiaryPlayerId: PlayerId,
    exemptions: Record<string, number>
  ): void {
    if (!this.state.rules.alliancesEnabled) {
      throw new Error('Alliances are disabled for this match');
    }

    const activePlayers = Object.values(this.state.players).filter((p) => !p.isBankrupt && !p.isSpectator);
    if (activePlayers.length <= 2) {
      throw new Error('Alliances are only available with 3 or more active players');
    }

    const grantor = this.state.players[grantorPlayerId];
    const beneficiary = this.state.players[beneficiaryPlayerId];
    if (!grantor || !beneficiary || grantor.isBankrupt || beneficiary.isBankrupt) {
      throw new Error('Invalid players for agreement');
    }

    if (!this.isAlliedWith(grantorPlayerId, beneficiaryPlayerId)) {
      throw new Error('Can only create agreements with allied players');
    }

    // Validate that grantor owns all properties specified
    const sanitizedExemptions: Record<string, number> = {};
    for (const [propId, pct] of Object.entries(exemptions)) {
      if (grantor.inventory.properties.includes(propId)) {
        const validPct = Math.min(100, Math.max(0, Math.round(Number(pct) || 0)));
        if (validPct > 0) {
          sanitizedExemptions[propId] = validPct;
        }
      }
    }

    // Cancel prior pending agreement from grantor to beneficiary
    this.state.pendingAllianceAgreements = this.state.pendingAllianceAgreements.filter(
      (a) => !(a.grantorPlayerId === grantorPlayerId && a.beneficiaryPlayerId === beneficiaryPlayerId)
    );

    const agreement: AllianceAgreement = {
      id: `agr_${uuidv4().substring(0, 8)}`,
      grantorPlayerId,
      beneficiaryPlayerId,
      exemptions: sanitizedExemptions,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.state.pendingAllianceAgreements.push(agreement);
    this.broadcast();

    // If beneficiary is a BOT, bots always accept rent exemptions offered to them
    if (beneficiary.isBot) {
      setTimeout(() => {
        const stillPending = this.state.pendingAllianceAgreements.find((a) => a.id === agreement.id);
        if (stillPending) {
          this.respondAllianceAgreement(beneficiary.id, agreement.id, 'accept');
        }
      }, 1000);
    }
  }

  public respondAllianceAgreement(
    beneficiaryPlayerId: PlayerId,
    agreementId: string,
    response: 'accept' | 'decline'
  ): void {
    const agr = this.state.pendingAllianceAgreements.find((a) => a.id === agreementId);
    if (!agr || agr.beneficiaryPlayerId !== beneficiaryPlayerId) return;

    const grantor = this.state.players[agr.grantorPlayerId];
    const beneficiary = this.state.players[agr.beneficiaryPlayerId];

    if (response === 'accept' && grantor && beneficiary && !grantor.isBankrupt && !beneficiary.isBankrupt) {
      if (this.isAlliedWith(agr.grantorPlayerId, agr.beneficiaryPlayerId)) {
        // Remove prior active agreement in this direction
        this.state.activeAllianceAgreements = this.state.activeAllianceAgreements.filter(
          (a) => !(a.grantorPlayerId === agr.grantorPlayerId && a.beneficiaryPlayerId === agr.beneficiaryPlayerId)
        );

        agr.status = 'active';
        agr.updatedAt = Date.now();
        this.state.activeAllianceAgreements.push(agr);

        const count = Object.keys(agr.exemptions).length;
        if (count > 0) {
          const propNames = Object.keys(agr.exemptions)
            .map((pId) => this.state.board.find((t) => t.id === pId)?.name || pId)
            .slice(0, 2)
            .join(', ');
          const moreSuffix = count > 2 ? ` (+${count - 2} more)` : '';
          this.addLog(
            'alliance',
            `🛡️ ${grantor.name} granted ${beneficiary.name} rent exemption on ${propNames}${moreSuffix}.`
          );
        }
      }
    }

    this.state.pendingAllianceAgreements = this.state.pendingAllianceAgreements.filter((a) => a.id !== agreementId);
    this.broadcast();
  }

  public breakAlliance(playerId: PlayerId, targetPlayerId: PlayerId): void {
    const p1 = this.state.players[playerId];
    const p2 = this.state.players[targetPlayerId];

    this.state.activeAlliances = this.state.activeAlliances.filter(
      (a) => !(a.memberIds.includes(playerId) && a.memberIds.includes(targetPlayerId))
    );

    this.state.activeAllianceAgreements = this.state.activeAllianceAgreements.filter(
      (a) =>
        !(
          (a.grantorPlayerId === playerId && a.beneficiaryPlayerId === targetPlayerId) ||
          (a.grantorPlayerId === targetPlayerId && a.beneficiaryPlayerId === playerId)
        )
    );
    this.state.pendingAllianceAgreements = this.state.pendingAllianceAgreements.filter(
      (a) =>
        !(
          (a.grantorPlayerId === playerId && a.beneficiaryPlayerId === targetPlayerId) ||
          (a.grantorPlayerId === targetPlayerId && a.beneficiaryPlayerId === playerId)
        )
    );

    if (p1 && p2) {
      this.addLog('alliance', `💔 ${p1.name} and ${p2.name} ended their Alliance.`);
    }
    this.broadcast();
  }

  public checkAndDissolveAlliancesFor1v1(): void {
    if (!this.state.rules.alliancesEnabled) return;

    const activePlayers = Object.values(this.state.players).filter((p) => !p.isBankrupt && !p.isSpectator);
    if (activePlayers.length <= 2) {
      const hadAlliances =
        this.state.activeAlliances.length > 0 ||
        this.state.activeAllianceAgreements.length > 0 ||
        this.state.pendingAllianceRequests.length > 0 ||
        this.state.pendingAllianceAgreements.length > 0;

      this.state.activeAlliances = [];
      this.state.activeAllianceAgreements = [];
      this.state.pendingAllianceRequests = [];
      this.state.pendingAllianceAgreements = [];

      if (hadAlliances) {
        this.state.allianceDissolutionNotice = {
          message: '⚔️ ALLIANCES DISSOLVED: Only two players remain. Alliances are no longer available during the final 1v1.',
          timestamp: Date.now(),
        };
        this.addLog('alliance', `⚔️ Alliances dissolved — only two players remain in 1v1 combat.`);
      }
    }
  }

  // --- Prison Actions ---
  public payBail(playerId: PlayerId): void {
    const player = this.state.players[playerId];
    if (!player || player.isBankrupt || player.isSpectator || !player.inPrison) return;

    const bail = this.state.rules.prisonBailAmount;
    if (player.cash < bail) {
      throw new Error(`Need $${bail} to pay bail`);
    }

    player.cash -= bail;
    player.inPrison = false;
    player.prisonTurns = 0;
    this.addLog('prison', `💸 ${player.name} paid $${bail} bail and walked out of Detention.`, playerId);
    this.broadcast();
  }

  public usePrisonCard(playerId: PlayerId): void {
    const player = this.state.players[playerId];
    if (!player || player.isBankrupt || player.isSpectator || !player.inPrison || player.inventory.getOutOfJailCards <= 0) return;

    player.inventory.getOutOfJailCards -= 1;
    player.inPrison = false;
    player.prisonTurns = 0;
    this.addLog('prison', `🎫 ${player.name} used a Get Out of Jail Free Card!`, playerId);
    this.broadcast();
  }

  // --- Turn Progression & End Game ---
  public endTurn(playerId: PlayerId): void {
    const player = this.state.players[playerId];
    if (!player || player.isBankrupt || player.isSpectator) {
      throw new Error('Bankrupt or spectating players cannot end turn');
    }

    if (this.state.turn.currentPlayerId !== playerId) {
      throw new Error('Not your turn');
    }

    if (this.state.activeCasinoEvent) {
      throw new Error('Cannot end turn during an active casino minigame');
    }

    if (this.movementFallbackTimer) {
      clearTimeout(this.movementFallbackTimer);
      this.movementFallbackTimer = null;
    }
    this.state.turn.movement = null;

    if (player.cash < 0) {
      throw new Error(`You have an outstanding debt of $${Math.abs(player.cash)}. Mortgage properties, sell buildings, trade with players, or declare bankruptcy.`);
    }

    // If double was rolled and player is not in prison, allow re-roll
    if (this.state.turn.isDouble && !player.inPrison && this.state.turn.doublesCount < this.state.rules.maxDoublesBeforePrison) {
      this.state.phase = 'rolling';
      this.state.turn.hasRolled = false;
      this.state.turn.pendingAction = null;
      this.startTurnCountdown();
      this.broadcast();
      return;
    }

    // Advance to next active player
    const activePlayerOrder = this.state.playerOrder.filter((id) => !this.state.players[id].isBankrupt);
    if (activePlayerOrder.length <= 1) {
      this.handleGameVictory(activePlayerOrder[0]);
      return;
    }

    const currentIndex = activePlayerOrder.indexOf(playerId);
    const nextIndex = (currentIndex + 1) % activePlayerOrder.length;
    const nextPlayerId = activePlayerOrder[nextIndex];

    this.state.turn.currentPlayerId = nextPlayerId;
    this.state.turn.hasRolled = false;
    this.state.turn.isDouble = false;
    this.state.turn.doublesCount = 0;
    this.state.turn.pendingAction = null;
    this.state.turn.turnNumber += 1;
    this.state.phase = 'rolling';

    // Check chaos event frequency & expiry
    ChaosEngine.checkExpiredEvents(this.state);
    if (
      this.state.rules.chaosEventsEnabled &&
      this.state.turn.turnNumber % (this.state.rules.chaosEventFrequencyTurns || 5) === 0
    ) {
      const chaos = ChaosEngine.triggerRandomEvent(this.state);
      if (chaos) {
        this.addLog('chaos', `🌋 CHAOS STRIKES! [${chaos.title}]: ${chaos.description}`);
      }
    }

    this.startTurnCountdown();
    this.broadcast();
  }

  public checkBankruptcy(player: Player, creditor: Player | null): void {
    if (player.cash >= 0) return;

    const netWorth = calculateNetWorth(player, this.state.board);
    if (netWorth < 0 || (player.inventory.properties.length === 0 && Object.keys(player.inventory.houses).length === 0)) {
      // Immediate bankruptcy
      this.declareBankruptcy(player.id, creditor ? creditor.id : null);
    } else {
      this.addLog('bankrupt', `⚠️ ${player.name} is in debt ($${player.cash})! Liquidate or mortgage assets to survive!`, player.id);
    }
  }

  public declareBankruptcy(playerId: PlayerId, creditorId?: PlayerId | null): void {
    const player = this.state.players[playerId];
    if (!player || player.isBankrupt) return;

    player.isBankrupt = true;
    player.isSpectator = true;
    player.eliminatedOrder = Object.values(this.state.players).filter((p) => p.isBankrupt).length;
    this.state.gameStats.totalBankruptcies += 1;

    // Reset all properties owned by the bankrupt player to the unowned bank state
    // (Per game rules: All owned properties immediately return to the unowned state. No transfer to creditor.)
    const surrenderedProperties = [...player.inventory.properties];
    for (const propId of surrenderedProperties) {
      delete player.inventory.houses[propId];
      delete player.inventory.mortgaged[propId];
    }
    player.inventory.properties = [];
    player.inventory.houses = {};
    player.inventory.mortgaged = {};
    player.inventory.getOutOfJailCards = 0;
    player.cash = 0;

    const creditor = creditorId ? this.state.players[creditorId] : null;
    if (creditor) {
      creditor.stats.bankruptciesCaused += 1;
      this.addLog('bankrupt', `💀 BANKRUPT! ${player.name} was bankrupted by ${creditor.name}. All ${surrenderedProperties.length} properties returned to the Bank as unowned!`, playerId);
    } else {
      this.addLog('bankrupt', `💀 BANKRUPT! ${player.name} surrendered from the match. All ${surrenderedProperties.length} properties returned to the Bank as unowned.`, playerId);
    }

    // Cancel any active trade involving this player
    if (this.state.activeTrade) {
      if (this.state.activeTrade.fromPlayerId === playerId || this.state.activeTrade.toPlayerId === playerId) {
        this.state.activeTrade = null;
        this.addLog('trade', `🚫 Active trade cancelled due to player bankruptcy.`);
      }
    }

    // If auction is in progress, clean up player from auction
    if (this.state.activeAuction && !this.state.activeAuction.isFinished) {
      this.state.activeAuction.activePlayerIds = this.state.activeAuction.activePlayerIds.filter((id) => id !== playerId);
      if (this.state.activeAuction.highestBidderId === playerId) {
        this.state.activeAuction.highestBidderId = null;
      }
      if (this.state.activeAuction.activePlayerIds.length === 0) {
        this.resolveAuction();
      }
    }

    // Clean up bankrupt player from alliances and agreements
    this.state.activeAlliances = this.state.activeAlliances
      .map((a) => ({ ...a, memberIds: a.memberIds.filter((id) => id !== playerId) as [PlayerId, PlayerId] }))
      .filter((a) => a.memberIds.length >= 2);
    this.state.activeAllianceAgreements = this.state.activeAllianceAgreements.filter(
      (a) => a.grantorPlayerId !== playerId && a.beneficiaryPlayerId !== playerId
    );
    this.state.pendingAllianceRequests = this.state.pendingAllianceRequests.filter(
      (r) => r.fromPlayerId !== playerId && r.toPlayerId !== playerId
    );
    this.state.pendingAllianceAgreements = this.state.pendingAllianceAgreements.filter(
      (a) => a.grantorPlayerId !== playerId && a.beneficiaryPlayerId !== playerId
    );

    // Check remaining active players
    const activePlayers = Object.values(this.state.players).filter((p) => !p.isBankrupt && !p.isSpectator);
    if (activePlayers.length <= 1) {
      this.handleGameVictory(activePlayers[0]?.id);
    } else {
      if (activePlayers.length === 2) {
        this.checkAndDissolveAlliancesFor1v1();
      }
      // If it was the bankrupt player's turn, advance turn cleanly to next active player!
      if (this.state.turn.currentPlayerId === playerId) {
        this.state.turn.hasRolled = false;
        this.state.turn.isDouble = false;
        this.state.turn.doublesCount = 0;
        this.state.turn.pendingAction = null;

        const activePlayerOrder = this.state.playerOrder.filter(
          (id) => !this.state.players[id]?.isBankrupt && !this.state.players[id]?.isSpectator
        );
        const currentIndex = this.state.playerOrder.indexOf(playerId);
        let nextPlayerId = activePlayerOrder[0];
        for (let i = 1; i <= this.state.playerOrder.length; i++) {
          const candId = this.state.playerOrder[(currentIndex + i) % this.state.playerOrder.length];
          const cand = this.state.players[candId];
          if (cand && !cand.isBankrupt && !cand.isSpectator) {
            nextPlayerId = candId;
            break;
          }
        }

        this.state.turn.currentPlayerId = nextPlayerId;
        this.state.turn.turnNumber += 1;
        this.state.phase = 'rolling';
        this.startTurnCountdown();
      }
      this.broadcast();
    }
  }

  private handleGameVictory(winnerId?: PlayerId): void {
    if (this.turnTimer) clearInterval(this.turnTimer);
    if (this.auctionTimer) clearInterval(this.auctionTimer);
    this.disconnectTimers.forEach((t) => clearTimeout(t));
    this.disconnectTimers.clear();

    this.state.phase = 'game_over';
    this.state.winnerId = winnerId || null;
    this.state.gameStats.endTime = Date.now();

    const winner = winnerId ? this.state.players[winnerId] : null;
    if (winner) {
      this.addLog('win', `👑 GAME OVER! ${winner.name} CONQUERED CASHQUAKE WITH A NET WORTH OF $${calculateNetWorth(winner, this.state.board)}! 🏆`, winnerId);
    }

    this.broadcast();
  }

  public cleanup(): void {
    if (this.turnTimer) clearInterval(this.turnTimer);
    if (this.auctionTimer) clearInterval(this.auctionTimer);
    this.disconnectTimers.forEach((t) => clearTimeout(t));
    this.disconnectTimers.clear();
  }
}
