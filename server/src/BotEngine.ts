import { COLOR_GROUPS_ORDER } from '../../shared/constants';
import {
  canBuildHouse,
  canMortgage,
  canSellHouse,
  canUnmortgage,
  getGroupTiles,
  ownsFullSet,
} from '../../shared/gameLogic';
import { BoardTile, ColorGroup, Player } from '../../shared/types';
import { GameRoom } from './GameRoom';

export class BotEngine {
  // Track last turn a bot proposed a trade to avoid spam
  private static lastTradeTurnByBot: Record<string, number> = {};

  public static handleBotTurn(room: GameRoom): void {
    const { state } = room;
    if (state.phase === 'game_over') return;
    if (state.activeCasinoEvent) return; // Block all bot actions while casino minigame is resolving

    // Handle bot auction decisions regardless of whose turn it is
    if (state.phase === 'auction' && state.activeAuction && !state.activeAuction.isFinished) {
      this.handleBotAuction(room);
      return;
    }

    const currentP = room.getCurrentPlayer();
    if (!currentP || !currentP.isBot || currentP.isBankrupt || currentP.isSpectator) return;

    // Bot prison check
    if (currentP.inPrison && !state.turn.hasRolled) {
      if (currentP.inventory.getOutOfJailCards > 0) {
        setTimeout(() => {
          try {
            room.usePrisonCard(currentP.id);
          } catch (e) {}
        }, 600);
        return;
      }
      if (currentP.cash > state.rules.prisonBailAmount * 2.5) {
        setTimeout(() => {
          try {
            room.payBail(currentP.id);
          } catch (e) {}
        }, 600);
        return;
      }
    }

    // Bot roll dice
    if (state.phase === 'rolling' && !state.turn.hasRolled) {
      setTimeout(() => {
        try {
          const roll = room.rollDice(currentP.id);
          const steps = (roll.d1 || 1) + (roll.d2 || 1);
          // Wait for full client presentation: Tumble (1200) + Result Hold (1200) + Movement (steps * 200) + Arrival (700) + Decision Buffer (1000)
          const presentationWaitMs = 1200 + 1200 + (steps * 200) + 700 + 1000;

          setTimeout(() => {
            this.handleBotPostRoll(room, currentP);
          }, presentationWaitMs);
        } catch (e) {}
      }, 700);
      return;
    }

    // Bot pending action
    if (state.phase === 'action_pending') {
      setTimeout(() => {
        this.handleBotPostRoll(room, currentP);
      }, 1000);
    }
  }

  /**
   * Calculates a contextual financial safety buffer based on board hazards and bot personality.
   */
  private static calculateSafetyReserve(room: GameRoom, bot: Player): number {
    let baseReserve = 100;

    // Scan opponents' built properties to evaluate rent threats
    let maxOpponentThreat = 0;
    for (const [pId, opponent] of Object.entries(room.state.players)) {
      if (pId === bot.id || opponent.isBankrupt || opponent.isSpectator) continue;
      for (const propId of opponent.inventory.properties) {
        const houses = opponent.inventory.houses[propId] || 0;
        const tile = room.state.board.find((t) => t.id === propId);
        if (tile && tile.rent && houses > 0) {
          const threatRent = tile.rent[Math.min(houses, 5)] || tile.rent[0] || 0;
          if (threatRent > maxOpponentThreat) {
            maxOpponentThreat = threatRent;
          }
        }
      }
    }

    // Blend in a fraction of the highest threat
    baseReserve += Math.min(Math.round(maxOpponentThreat * 0.4), 150);

    // Personality adjustments
    if (bot.personality === 'conservative') {
      baseReserve += 60;
    } else if (bot.personality === 'aggressive') {
      baseReserve -= 35;
    } else if (bot.personality === 'chaotic') {
      baseReserve -= 50;
    }

    return Math.max(baseReserve, 60);
  }

  private static handleBotPostRoll(room: GameRoom, bot: Player): void {
    const { state } = room;
    if (state.turn.currentPlayerId !== bot.id) return;
    if (state.activeCasinoEvent) return; // Block bot post-roll actions while casino minigame is resolving

    const safetyReserve = this.calculateSafetyReserve(room, bot);

    // 1. Buy property decision with set-completion & blocking intelligence
    if (state.turn.pendingAction === 'buy_property') {
      const tile = state.board[bot.position];
      if (tile && tile.price) {
        const completesMySet = tile.group ? this.wouldCompleteSet(bot, tile.group, room.state.board) : false;
        const blocksOpponentSet = tile.group ? this.wouldBlockOpponentSet(room, tile.group, bot.id) : false;

        // If high strategic value, accept lower cash reserves
        const requiredReserve = completesMySet ? 30 : blocksOpponentSet ? 50 : safetyReserve;

        if (bot.cash >= tile.price + requiredReserve) {
          setTimeout(() => {
            try {
              room.buyProperty(bot.id);
              this.handleBotStrategicActions(room, bot, safetyReserve);
              setTimeout(() => {
                try {
                  room.endTurn(bot.id);
                } catch (e) {}
              }, 1200);
            } catch (e) {
              room.passProperty(bot.id);
            }
          }, 800);
          return;
        } else {
          setTimeout(() => {
            room.passProperty(bot.id);
            setTimeout(() => {
              try {
                this.handleBotStrategicActions(room, bot, safetyReserve);
                room.endTurn(bot.id);
              } catch (e) {}
            }, 1000);
          }, 800);
          return;
        }
      }
    }

    // 2. Debt management if in negative cash
    if (bot.cash < 0) {
      this.handleBotDebtLiquidation(room, bot);
    }

    // 3. Strategic decisions (upgrades, unmortgage, proactive trades)
    this.handleBotStrategicActions(room, bot, safetyReserve);

    // 4. End turn
    if (state.phase === 'action_pending' && !state.turn.pendingAction) {
      setTimeout(() => {
        try {
          if (state.turn.currentPlayerId === bot.id) {
            room.endTurn(bot.id);
          }
        } catch (e) {}
      }, 1200);
    }
  }

  private static handleBotStrategicActions(room: GameRoom, bot: Player, safetyReserve: number): void {
    // A. Unmortgage complete sets when flush with cash
    this.handleBotUnmortgages(room, bot, safetyReserve);

    // B. Construct houses with high ROI (prioritize 3 houses per property)
    this.handleBotHouseUpgrades(room, bot, safetyReserve);

    // C. Intentional Proactive Trading (throttled)
    this.handleBotProactiveTrade(room, bot);
  }

  private static wouldCompleteSet(player: Player, group: ColorGroup, board: BoardTile[]): boolean {
    const groupTiles = getGroupTiles(group, board);
    if (groupTiles.length === 0) return false;
    const ownedInGroup = groupTiles.filter((t) => player.inventory.properties.includes(t.id));
    return ownedInGroup.length === groupTiles.length - 1;
  }

  private static wouldBlockOpponentSet(room: GameRoom, group: ColorGroup, botId: string): boolean {
    const groupTiles = getGroupTiles(group, room.state.board);
    if (groupTiles.length === 0) return false;

    for (const [pId, p] of Object.entries(room.state.players)) {
      if (pId === botId || p.isBankrupt || p.isSpectator) continue;
      const owned = groupTiles.filter((t) => p.inventory.properties.includes(t.id));
      if (owned.length === groupTiles.length - 1) {
        return true;
      }
    }
    return false;
  }

  private static handleBotAuction(room: GameRoom): void {
    const auction = room.state.activeAuction;
    if (!auction || auction.isFinished) return;

    const tile = room.state.board.find((t) => t.id === auction.propertyId);
    if (!tile || !tile.price) return;

    for (const pId of auction.activePlayerIds) {
      const bot = room.state.players[pId];
      if (!bot || !bot.isBot || bot.isBankrupt || bot.isSpectator) continue;
      if (auction.highestBidderId === bot.id) continue;

      const completesMySet = tile.group ? this.wouldCompleteSet(bot, tile.group, room.state.board) : false;
      const blocksOpponent = tile.group ? this.wouldBlockOpponentSet(room, tile.group, bot.id) : false;

      // Higher willingness to pay for key strategic tiles
      const multiplier = completesMySet ? 1.35 : blocksOpponent ? 1.15 : 0.90;
      const maxWillingToBid = Math.round(tile.price * multiplier);
      const nextBid = auction.currentBid + 15;

      const minReserve = completesMySet ? 40 : 80;
      if (nextBid <= maxWillingToBid && bot.cash >= nextBid + minReserve) {
        setTimeout(() => {
          try {
            if (room.state.activeAuction && !room.state.activeAuction.isFinished) {
              room.placeBid(bot.id, nextBid);
            }
          } catch (e) {}
        }, 1000 + Math.random() * 1200);
      } else {
        setTimeout(() => {
          try {
            room.passAuction(bot.id);
          } catch (e) {}
        }, 800);
      }
    }
  }

  private static handleBotHouseUpgrades(room: GameRoom, bot: Player, safetyReserve: number): void {
    for (const propId of bot.inventory.properties) {
      const tile = room.state.board.find((t) => t.id === propId);
      if (!tile || !tile.group || !tile.houseCost) continue;

      if (ownsFullSet(bot, tile.group, room.state.board)) {
        const check = canBuildHouse(bot, propId, room.state.board, room.state.rules);
        // Build if we have enough cash for the house plus our contextual safety reserve
        if (check.canBuild && bot.cash >= check.cost + safetyReserve + 80) {
          try {
            room.buildHouse(bot.id, propId);
          } catch (e) {}
        }
      }
    }
  }

  private static handleBotUnmortgages(room: GameRoom, bot: Player, safetyReserve: number): void {
    const mortgagedIds = Object.keys(bot.inventory.mortgaged || {}).filter(
      (id) => bot.inventory.mortgaged[id]
    );

    for (const propId of mortgagedIds) {
      const tile = room.state.board.find((t) => t.id === propId);
      if (!tile || !tile.price) continue;

      const check = canUnmortgage(bot, propId, room.state.board, room.state.rules);
      if (check.canUnmortgage) {
        const isMonopoly = tile.group ? ownsFullSet(bot, tile.group, room.state.board) : false;
        // Prioritize unmortgaging monopoly sets
        const extraBuffer = isMonopoly ? 100 : 250;
        if (bot.cash >= check.cost + safetyReserve + extraBuffer) {
          try {
            room.unmortgageProperty(bot.id, propId);
          } catch (e) {}
        }
      }
    }
  }

  private static handleBotProactiveTrade(room: GameRoom, bot: Player): void {
    if (room.state.activeTrade) return; // Only one active trade at a time

    const currentTurn = room.state.turn.turnNumber;
    const lastTradeTurn = this.lastTradeTurnByBot[bot.id] || 0;
    // Throttle: Propose trade at most once every 4 turns
    if (currentTurn - lastTradeTurn < 4) return;

    // Check if bot is 1 property away from completing a color group
    for (const group of COLOR_GROUPS_ORDER) {
      const groupTiles = getGroupTiles(group, room.state.board);
      if (groupTiles.length === 0) continue;

      const botOwned = groupTiles.filter((t) => bot.inventory.properties.includes(t.id));
      if (botOwned.length === groupTiles.length - 1) {
        // Find missing tile
        const missingTile = groupTiles.find((t) => !bot.inventory.properties.includes(t.id));
        if (!missingTile || !missingTile.price) continue;

        // Find owner of missing tile
        let targetOwner: Player | null = null;
        for (const player of Object.values(room.state.players)) {
          if (player.id === bot.id || player.isBankrupt || player.isSpectator) continue;
          if (player.inventory.properties.includes(missingTile.id)) {
            targetOwner = player;
            break;
          }
        }

        if (!targetOwner) continue;

        // If target owner already owns the rest of the set, they won't give it up
        if (ownsFullSet(targetOwner, group, room.state.board)) continue;

        // Craft a compelling offer: standalone property + generous cash
        const botDispensableProp = bot.inventory.properties.find((pId) => {
          const t = room.state.board.find((b) => b.id === pId);
          return t && t.group && t.group !== group && !ownsFullSet(bot, t.group, room.state.board);
        });

        const offeredCash = Math.min(Math.max(Math.round(missingTile.price * 1.15), 50), Math.max(bot.cash - 100, 0));

        if (offeredCash > 0 || botDispensableProp) {
          try {
            this.lastTradeTurnByBot[bot.id] = currentTurn;
            room.proposeTrade({
              fromPlayerId: bot.id,
              toPlayerId: targetOwner.id,
              offeredCash: botDispensableProp ? Math.round(offeredCash * 0.5) : offeredCash,
              offeredProperties: botDispensableProp ? [botDispensableProp] : [],
              offeredCards: 0,
              requestedCash: 0,
              requestedProperties: [missingTile.id],
              requestedCards: 0,
            });
            return;
          } catch (e) {}
        }
      }
    }
  }

  private static handleBotDebtLiquidation(room: GameRoom, bot: Player): void {
    // 1. Sell houses first evenly
    for (const propId of bot.inventory.properties) {
      if (bot.cash >= 0) break;
      const houses = bot.inventory.houses[propId] || 0;
      if (houses > 0) {
        const check = canSellHouse(bot, propId, room.state.board, room.state.rules);
        if (check.canSell) {
          try {
            room.sellHouse(bot.id, propId);
          } catch (e) {}
        }
      }
    }

    // 2. Mortgage standalone (non-monopoly) properties first
    for (const propId of bot.inventory.properties) {
      if (bot.cash >= 0) break;
      const tile = room.state.board.find((t) => t.id === propId);
      if (tile && tile.group && !ownsFullSet(bot, tile.group, room.state.board)) {
        const check = canMortgage(bot, propId, room.state.board);
        if (check.canMortgage) {
          try {
            room.mortgageProperty(bot.id, propId);
          } catch (e) {}
        }
      }
    }

    // 3. Mortgage remaining properties if still in debt
    for (const propId of bot.inventory.properties) {
      if (bot.cash >= 0) break;
      const check = canMortgage(bot, propId, room.state.board);
      if (check.canMortgage) {
        try {
          room.mortgageProperty(bot.id, propId);
        } catch (e) {}
      }
    }

    // 4. If all liquidation options exhausted and still in debt, declare bankruptcy
    if (bot.cash < 0) {
      try {
        room.declareBankruptcy(bot.id, null);
      } catch (e) {}
    }
  }
}
