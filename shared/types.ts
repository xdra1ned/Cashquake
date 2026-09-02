export type PlayerId = string;
export type RoomCode = string;

export type TileType =
  | 'start'
  | 'property'
  | 'railroad'
  | 'utility'
  | 'chance'
  | 'fortune'
  | 'tax'
  | 'prison'
  | 'vacation'
  | 'go_to_prison'
  | 'special';

export type ColorGroup =
  | 'brown'
  | 'light_blue'
  | 'pink'
  | 'orange'
  | 'red'
  | 'yellow'
  | 'green'
  | 'dark_blue'
  | 'railroad'
  | 'utility';

export interface BoardTile {
  index: number;
  id: string;
  name: string;
  type: TileType;
  group?: ColorGroup;
  price?: number;
  rent?: number[]; // [base, 1h, 2h, 3h, 4h, hotel]
  houseCost?: number;
  mortgageValue?: number;
  taxAmount?: number;
  icon?: string;
  subText?: string;
  color?: string;
}

export interface PlayerInventory {
  properties: string[]; // tile IDs
  houses: Record<string, number>; // tileId -> count (1-4 = houses, 5 = hotel)
  mortgaged: Record<string, boolean>; // tileId -> isMortgaged
  getOutOfJailCards: number;
}

export interface PlayerCustomization {
  avatarId: string;
  avatarIcon: string;
  color: string;
  diceSkin: string;
  trailEffect: string;
  title: string;
}

export interface PlayerStats {
  rentCollected: number;
  rentPaid: number;
  tradesCompleted: number;
  propertiesBought: number;
  timesInPrison: number;
  doublesRolled: number;
  bankruptciesCaused: number;
  highestCash: number;
  totalRolls: number;
}

export interface Player {
  id: PlayerId;
  name: string;
  isHost: boolean;
  isBot: boolean;
  isSpectator: boolean;
  isConnected: boolean;
  cash: number;
  position: number; // 0-39
  inPrison: boolean;
  prisonTurns: number;
  inventory: PlayerInventory;
  customization: PlayerCustomization;
  stats: PlayerStats;
  isBankrupt: boolean;
  eliminatedOrder?: number;
  disconnectedAt?: number;
  reconnectDeadline?: number;
  personality?: 'aggressive' | 'conservative' | 'chaotic' | 'tycoon' | 'balanced' | 'unpredictable';
}

export interface TradeOffer {
  id: string;
  fromPlayerId: PlayerId;
  toPlayerId: PlayerId;
  offeredCash: number;
  offeredProperties: string[];
  offeredCards: number;
  requestedCash: number;
  requestedProperties: string[];
  requestedCards: number;
  status: 'pending' | 'accepted' | 'declined' | 'countered' | 'cancelled';
  createdAt: number;
}

export interface LiveAuction {
  propertyId: string;
  currentBid: number;
  highestBidderId: PlayerId | null;
  activePlayerIds: PlayerId[];
  timeLeftSeconds: number;
  history: { playerId: PlayerId; bid: number; timestamp: number }[];
  isFinished: boolean;
}

export type PresetType =
  | 'classic'
  | 'speed_quake'
  | 'high_roller'
  | 'total_chaos'
  | 'anarchy'
  | 'custom';

export type BoardThemeId =
  | 'world_tour'
  | 'cyber_neon'
  | 'mystic_fantasy'
  | 'cosmic_space'
  | 'anime_akiba'
  | 'casino_royale'
  | 'pixel_arcade'
  | 'frutiger_aero';

export type CasinoEventType =
  | 'roulette'
  | 'slots'
  | 'loot_chest'
  | 'hack_terminal'
  | 'city_lottery'
  | 'crystal_orb'
  | 'artifact_scanner'
  | 'gachapon'
  | 'aero_fortune'
  | 'card_draw';

export interface RouletteOutcome {
  number: number; // 0 to 36
  color: 'red' | 'black' | 'green';
  payout: number;
  multiplier: number;
  title: string;
  description: string;
  isJackpot?: boolean;
}

export interface SlotsOutcome {
  reels: [string, string, string]; // e.g. ['7️⃣', '7️⃣', '7️⃣']
  combinationName: string;
  payout: number;
  multiplier: number;
  title: string;
  description: string;
  isJackpot?: boolean;
}

export interface GenericThemedOutcome {
  title: string;
  description: string;
  payout: number;
  multiplier?: number;
  isJackpot?: boolean;
  itemSymbol?: string;
  itemCategory?: string;
  detailCode?: string;
}

export interface ActiveCasinoEvent {
  id: string;
  playerId: PlayerId;
  eventType: CasinoEventType;
  outcome: RouletteOutcome | SlotsOutcome | GenericThemedOutcome;
  status: 'ready' | 'spinning' | 'resolved';
  createdAt: number;
}

export interface GameRules {
  startingCash: number;
  goReward: number;
  exactGoBonus: boolean;
  vacationCashPot: boolean; // Taxes and fees go to Vacation spot
  doubleRentFullSet: boolean;
  rentMultiplier: number;
  allowAuctions: boolean;
  auctionCountdown: number; // seconds
  houseLimit: number; // default 32
  hotelLimit: number; // default 12
  evenBuilding: boolean;
  mortgageInterestRate: number; // 0.10 (10%)
  prisonTurnsMax: number; // 3
  prisonBailAmount: number; // 50
  collectRentInPrison: boolean;
  maxDoublesBeforePrison: number; // 3
  snakeEyesBonusCash: number; // bonus cash on rolling 1+1
  turnTimeLimitSeconds: number; // 0 = unlimited, 45, 60, etc.
  chaosEventsEnabled: boolean;
  chaosEventFrequencyTurns: number; // trigger chaos every N turns (e.g. 5)
  alliancesEnabled: boolean; // Optional Alliance diplomacy system
  maxPlayers: number; // 2 to 8
  diceMode: '2d6' | '2d12'; // 2x6-sided vs 2x12-sided dice
  spectateTrades: boolean; // Allow non-participating players to spectate active trades
}

export interface Alliance {
  id: string;
  memberIds: [PlayerId, PlayerId];
  createdAt: number;
}

export interface AllianceRequest {
  id: string;
  fromPlayerId: PlayerId;
  toPlayerId: PlayerId;
  createdAt: number;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
}

export interface AllianceAgreement {
  id: string;
  grantorPlayerId: PlayerId; // Owner offering rent exemptions on their properties
  beneficiaryPlayerId: PlayerId; // Ally receiving the rent discounts
  exemptions: Record<string, number>; // propertyId -> discount % (e.g. 25, 50, 75, 100)
  status: 'pending' | 'active' | 'declined' | 'cancelled';
  createdAt: number;
  updatedAt: number;
}

export interface ChaosEvent {
  id: string;
  title: string;
  description: string;
  severity: 'mild' | 'wild' | 'insane';
  durationTurns?: number;
  appliedAtTurn: number;
  expiresAtTurn?: number;
  effectType:
    | 'rent_roulette'
    | 'market_crash'
    | 'blood_money'
    | 'robin_hood'
    | 'teleport_all'
    | 'bank_glitch'
    | 'double_tax'
    | 'inflation'
    | 'swapped_pawns';
}

export interface DrawnCard {
  id: string;
  type: 'chance' | 'fortune';
  title: string;
  description: string;
  flavorText?: string;
  effect: {
    action:
      | 'gain_cash'
      | 'lose_cash'
      | 'move_to'
      | 'move_relative'
      | 'go_to_prison'
      | 'get_out_of_prison'
      | 'pay_per_building'
      | 'all_pay_player'
      | 'player_pay_all'
      | 'gain_quake_coins'
      | 'chaos_trigger'
      | 'special_blessing';
    amount?: number;
    targetIndex?: number;
    houseAmount?: number;
    hotelAmount?: number;
  };
}

export interface GameLog {
  id: string;
  timestamp: number;
  type:
    | 'roll'
    | 'move'
    | 'buy'
    | 'rent'
    | 'auction'
    | 'trade'
    | 'prison'
    | 'card'
    | 'chaos'
    | 'bankrupt'
    | 'win'
    | 'chat'
    | 'alliance';
  message: string;
  playerId?: PlayerId;
  meta?: Record<string, any>;
}

export type GamePhase =
  | 'lobby'
  | 'rolling'
  | 'moving'
  | 'action_pending'
  | 'auction'
  | 'game_over';

export interface TurnState {
  currentPlayerId: PlayerId;
  dice: [number, number];
  isDouble: boolean;
  doublesCount: number;
  hasRolled: boolean;
  pendingAction:
    | null
    | 'buy_property'
    | 'pay_rent'
    | 'pay_tax'
    | 'draw_card'
    | 'prison_options';
  turnTimerSeconds: number;
  turnEndsAt?: number;
  turnNumber: number;
  movement?: {
    playerId: PlayerId;
    startPos: number;
    targetPos: number;
    steps: number;
    passedGo: boolean;
  } | null;
}

export interface ChatMessage {
  id: string;
  playerId: PlayerId;
  playerName: string;
  playerColor: string;
  playerTitle?: string;
  avatarId?: string;
  message: string;
  timestamp: number;
}

export interface GameState {
  roomCode: RoomCode;
  hostId: PlayerId;
  phase: GamePhase;
  preset: PresetType;
  themeId: BoardThemeId;
  rules: GameRules;
  board: BoardTile[];
  players: Record<PlayerId, Player>;
  playerOrder: PlayerId[];
  spectators: Record<PlayerId, { id: string; name: string; avatarIcon: string }>;
  turn: TurnState;
  potCash: number; // Vacation / Free Parking accumulated pot
  activeAuction: LiveAuction | null;
  activeTrade: TradeOffer | null;
  activeChaosEvents: ChaosEvent[];
  activeAlliances: Alliance[];
  activeAllianceAgreements: AllianceAgreement[];
  pendingAllianceRequests: AllianceRequest[];
  pendingAllianceAgreements: AllianceAgreement[];
  allianceDissolutionNotice: { message: string; timestamp: number } | null;
  activeCasinoEvent: ActiveCasinoEvent | null;
  lastCardDrawn: { id?: string; card: DrawnCard; drawnByPlayerId: PlayerId; timestamp?: number } | null;
  logs: GameLog[];
  chatMessages: ChatMessage[];
  winnerId: PlayerId | null;
  gameStats: {
    startTime: number;
    endTime?: number;
    totalTurns: number;
    totalRentExchanged: number;
    totalBankruptcies: number;
  };
}

export interface UserSession {
  sessionId: string;
  playerName: string;
  customization: PlayerCustomization;
  quakeCoins: number;
  unlockedSkins: string[];
  unlockedDice: string[];
  unlockedThemes: string[];
  lastDailyClaimDate?: string;
  stats: {
    matchesPlayed: number;
    matchesWon: number;
    totalQuakeCoinsEarned: number;
  };
}

