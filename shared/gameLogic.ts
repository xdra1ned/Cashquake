import {
  COLOR_GROUP_HEX,
  COLOR_GROUPS,
  COLOR_GROUPS_ORDER,
  THEME_NAMES,
  TILE_BLUEPRINTS,
} from './constants';
import {
  BoardThemeId,
  BoardTile,
  ChaosEvent,
  ColorGroup,
  GameRules,
  Player,
} from './types';

export { COLOR_GROUPS, COLOR_GROUPS_ORDER };

export function generateBoard(themeId: BoardThemeId): BoardTile[] {
  const theme = THEME_NAMES[themeId] || THEME_NAMES.world_tour;
  const themeTileNames = theme.tiles;

  return TILE_BLUEPRINTS.map((bp, index) => {
    const tileName = themeTileNames[index] || `Space ${index}`;
    const tile: BoardTile = {
      index,
      id: `tile_${index}`,
      name: tileName,
      type: bp.type,
      group: bp.group,
      price: bp.price,
      rent: bp.rent,
      houseCost: bp.houseCost,
      mortgageValue: bp.mortgageValue,
      taxAmount: bp.taxAmount,
      subText: bp.defaultSubText,
      color: bp.group ? COLOR_GROUP_HEX[bp.group] : undefined,
    };

    // Assign icons for special tiles
    if (bp.type === 'start') tile.icon = '🚩';
    else if (bp.type === 'prison') tile.icon = '🚔';
    else if (bp.type === 'vacation') tile.icon = '🏖️';
    else if (bp.type === 'go_to_prison') tile.icon = '🚨';
    else if (bp.type === 'chance') tile.icon = '❓';
    else if (bp.type === 'fortune') tile.icon = '💎';
    else if (bp.type === 'tax') tile.icon = '🏛️';
    else if (bp.type === 'railroad') tile.icon = '🚆';
    else if (bp.type === 'utility') tile.icon = '⚡';

    return tile;
  });
}

export function getGroupTiles(group: ColorGroup, board: BoardTile[]): BoardTile[] {
  return board.filter((t) => t.group === group);
}

export function ownsFullSet(player: Player, group: ColorGroup, board: BoardTile[]): boolean {
  if (!group || group === 'railroad' || group === 'utility') return false;
  const groupTiles = getGroupTiles(group, board);
  if (groupTiles.length === 0) return false;
  return groupTiles.every((t) => player.inventory.properties.includes(t.id));
}

export function countOwnedInGroup(player: Player, group: ColorGroup, board: BoardTile[]): number {
  const groupTiles = getGroupTiles(group, board);
  return groupTiles.filter((t) => player.inventory.properties.includes(t.id)).length;
}

export function calculateRent(
  tile: BoardTile,
  owner: Player,
  board: BoardTile[],
  rules: GameRules,
  activeChaosEvents: ChaosEvent[],
  diceTotal: number = 7
): number {
  if (!tile || !owner) return 0;
  const tileId = tile.id;

  // If mortgaged, no rent
  if (owner.inventory.mortgaged[tileId]) {
    return 0;
  }

  // If owner is in prison and rule disables rent in prison
  if (owner.inPrison && !rules.collectRentInPrison) {
    return 0;
  }

  let rent = 0;

  if (tile.type === 'property' && tile.group && tile.rent) {
    const houseCount = owner.inventory.houses[tileId] || 0;
    if (houseCount > 0) {
      // 1 to 5 (5 is hotel)
      rent = tile.rent[houseCount] || tile.rent[0];
    } else {
      // Base rent
      const hasSet = ownsFullSet(owner, tile.group, board);
      if (hasSet && rules.doubleRentFullSet) {
        rent = tile.rent[0] * 2;
      } else {
        rent = tile.rent[0];
      }
    }
  } else if (tile.type === 'railroad') {
    const ownedStations = countOwnedInGroup(owner, 'railroad', board);
    const stationRents = [0, 25, 50, 100, 200];
    rent = stationRents[Math.min(ownedStations, 4)] || 25;
  } else if (tile.type === 'utility') {
    const ownedUtilities = countOwnedInGroup(owner, 'utility', board);
    const multiplier = ownedUtilities >= 2 ? 10 : 4;
    rent = diceTotal * multiplier;
  }

  // Apply general rule rent multiplier
  rent = Math.round(rent * (rules.rentMultiplier || 1.0));

  // Apply Chaos Modifiers
  for (const event of activeChaosEvents) {
    if (event.effectType === 'market_crash') {
      rent = Math.round(rent * 0.6);
    } else if (event.effectType === 'rent_roulette') {
      rent = Math.round(rent * 3.0);
    }
  }

  return Math.max(0, rent);
}

export function calculateNetWorth(player: Player, board: BoardTile[]): number {
  if (!player) return 0;
  let total = player.cash;

  for (const propId of player.inventory.properties) {
    const tile = board.find((t) => t.id === propId);
    if (!tile) continue;

    const isMortgaged = player.inventory.mortgaged[propId];
    if (isMortgaged) {
      total += Math.round((tile.price || 0) / 2);
    } else {
      total += tile.price || 0;
    }

    const houses = player.inventory.houses[propId] || 0;
    if (houses > 0 && tile.houseCost) {
      total += houses * tile.houseCost;
    }
  }

  return total;
}

export function canBuildHouse(
  player: Player,
  tileId: string,
  board: BoardTile[],
  rules: GameRules,
  currentTurnPlayerId?: string
): { canBuild: boolean; reason?: string; cost: number } {
  const tile = board.find((t) => t.id === tileId);
  if (!tile || tile.type !== 'property' || !tile.group || !tile.houseCost) {
    return { canBuild: false, reason: 'Not a buildable property', cost: 0 };
  }

  if (currentTurnPlayerId && currentTurnPlayerId !== player.id) {
    return { canBuild: false, reason: 'You can only construct buildings during your turn', cost: tile.houseCost };
  }

  if (!player.inventory.properties.includes(tileId)) {
    return { canBuild: false, reason: 'You do not own this property', cost: 0 };
  }

  if (player.inventory.mortgaged[tileId]) {
    return { canBuild: false, reason: 'Property is currently mortgaged', cost: 0 };
  }

  if (!ownsFullSet(player, tile.group, board)) {
    return { canBuild: false, reason: 'You must own the full color set to build', cost: 0 };
  }

  // Any mortgaged property in group?
  const groupTiles = getGroupTiles(tile.group, board);
  const anyMortgagedInGroup = groupTiles.some((t) => player.inventory.mortgaged[t.id]);
  if (anyMortgagedInGroup) {
    return { canBuild: false, reason: 'Cannot build while any property in set is mortgaged', cost: 0 };
  }

  const currentHouses = player.inventory.houses[tileId] || 0;
  if (currentHouses >= 5) {
    return { canBuild: false, reason: 'Already reached maximum upgrade (Hotel)', cost: 0 };
  }

  if (player.cash < tile.houseCost) {
    return { canBuild: false, reason: `Need $${tile.houseCost}, you have $${player.cash}`, cost: tile.houseCost };
  }

  // Even building rule check
  if (rules.evenBuilding) {
    const otherHouseCounts = groupTiles
      .filter((t) => t.id !== tileId)
      .map((t) => player.inventory.houses[t.id] || 0);

    const minHouses = Math.min(...otherHouseCounts, currentHouses);
    if (currentHouses > minHouses) {
      return { canBuild: false, reason: 'Must build evenly across the color set', cost: tile.houseCost };
    }
  }

  return { canBuild: true, cost: tile.houseCost };
}

export function canSellHouse(
  player: Player,
  tileId: string,
  board: BoardTile[],
  rules: GameRules,
  currentTurnPlayerId?: string
): { canSell: boolean; refund: number; reason?: string } {
  const tile = board.find((t) => t.id === tileId);
  if (!tile || !tile.houseCost || !tile.group) {
    return { canSell: false, refund: 0, reason: 'Not a property' };
  }

  if (currentTurnPlayerId && currentTurnPlayerId !== player.id) {
    return { canSell: false, refund: Math.floor(tile.houseCost / 2), reason: 'You can only sell buildings during your turn' };
  }

  const currentHouses = player.inventory.houses[tileId] || 0;
  if (currentHouses <= 0) {
    return { canSell: false, refund: 0, reason: 'No buildings to sell' };
  }

  const refund = Math.round(tile.houseCost / 2);

  if (rules.evenBuilding) {
    const groupTiles = getGroupTiles(tile.group, board);
    const otherHouseCounts = groupTiles
      .filter((t) => t.id !== tileId)
      .map((t) => player.inventory.houses[t.id] || 0);

    const maxHouses = Math.max(...otherHouseCounts, currentHouses);
    if (currentHouses < maxHouses) {
      return { canSell: false, refund, reason: 'Must sell evenly across the color set' };
    }
  }

  return { canSell: true, refund };
}

export function canMortgage(
  player: Player,
  tileId: string,
  board: BoardTile[]
): { canMortgage: boolean; value: number; reason?: string } {
  const tile = board.find((t) => t.id === tileId);
  if (!tile || !tile.mortgageValue) {
    return { canMortgage: false, value: 0, reason: 'Cannot mortgage this tile' };
  }

  if (!player.inventory.properties.includes(tileId)) {
    return { canMortgage: false, value: 0, reason: 'You do not own this property' };
  }

  if (player.inventory.mortgaged[tileId]) {
    return { canMortgage: false, value: 0, reason: 'Already mortgaged' };
  }

  if (tile.group) {
    const groupTiles = getGroupTiles(tile.group, board);
    const hasBuildingsInGroup = groupTiles.some(
      (t) => (player.inventory.houses[t.id] || 0) > 0
    );
    if (hasBuildingsInGroup) {
      return { canMortgage: false, value: 0, reason: 'Must sell all buildings in set before mortgaging' };
    }
  }

  return { canMortgage: true, value: tile.mortgageValue };
}

export function canUnmortgage(
  player: Player,
  tileId: string,
  board: BoardTile[],
  rules: GameRules
): { canUnmortgage: boolean; cost: number; reason?: string } {
  const tile = board.find((t) => t.id === tileId);
  if (!tile || !tile.mortgageValue) {
    return { canUnmortgage: false, cost: 0, reason: 'Invalid property' };
  }

  if (!player.inventory.mortgaged[tileId]) {
    return { canUnmortgage: false, cost: 0, reason: 'Property is not mortgaged' };
  }

  const interest = rules.mortgageInterestRate || 0.1;
  const cost = Math.round(tile.mortgageValue * (1 + interest));

  if (player.cash < cost) {
    return { canUnmortgage: false, cost, reason: `Insufficient funds (requires $${cost})` };
  }

  return { canUnmortgage: true, cost };
}

export function canSellProperty(
  player: Player,
  tileId: string,
  board: BoardTile[]
): { canSell: boolean; value: number; reason?: string } {
  const tile = board.find((t) => t.id === tileId);
  if (!tile || !tile.price) {
    return { canSell: false, value: 0, reason: 'Cannot sell this tile' };
  }

  if (!player.inventory.properties.includes(tileId)) {
    return { canSell: false, value: 0, reason: 'You do not own this property' };
  }

  if (tile.group) {
    const groupTiles = getGroupTiles(tile.group, board);
    const hasBuildingsInGroup = groupTiles.some(
      (t) => (player.inventory.houses[t.id] || 0) > 0
    );
    if (hasBuildingsInGroup) {
      return { canSell: false, value: 0, reason: 'Must sell all buildings in set before selling property' };
    }
  }

  const isMortgaged = player.inventory.mortgaged[tileId];
  const value = isMortgaged ? 0 : (tile.mortgageValue || Math.round(tile.price / 2));

  return { canSell: true, value };
}
