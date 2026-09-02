import {
  BoardThemeId,
  BoardTile,
  ChaosEvent,
  ColorGroup,
  DrawnCard,
  GameRules,
  PresetType,
} from './types';

export const COLOR_GROUPS_ORDER: ColorGroup[] = [
  'brown',
  'light_blue',
  'pink',
  'orange',
  'red',
  'yellow',
  'green',
  'dark_blue',
];

export const COLOR_GROUPS: ColorGroup[] = COLOR_GROUPS_ORDER;

export const COLOR_GROUP_HEX: Record<ColorGroup, string> = {
  brown: '#8B4513',
  light_blue: '#38BDF8',
  pink: '#EC4899',
  orange: '#F97316',
  red: '#EF4444',
  yellow: '#EAB308',
  green: '#22C55E',
  dark_blue: '#3B82F6',
  railroad: '#64748B',
  utility: '#A855F7',
};

export const PRESET_RULES: Record<PresetType, GameRules> = {
  classic: {
    startingCash: 1500,
    goReward: 200,
    exactGoBonus: false,
    vacationCashPot: true,
    doubleRentFullSet: true,
    rentMultiplier: 1.0,
    allowAuctions: true,
    auctionCountdown: 15,
    houseLimit: 32,
    hotelLimit: 12,
    evenBuilding: true,
    mortgageInterestRate: 0.1,
    prisonTurnsMax: 3,
    prisonBailAmount: 50,
    collectRentInPrison: true,
    maxDoublesBeforePrison: 3,
    snakeEyesBonusCash: 0,
    turnTimeLimitSeconds: 60,
    chaosEventsEnabled: false,
    chaosEventFrequencyTurns: 6,
    alliancesEnabled: true,
    maxPlayers: 8,
    diceMode: '2d6',
    spectateTrades: false,
  },
  speed_quake: {
    startingCash: 2500,
    goReward: 400,
    exactGoBonus: true,
    vacationCashPot: true,
    doubleRentFullSet: true,
    rentMultiplier: 1.5,
    allowAuctions: true,
    auctionCountdown: 10,
    houseLimit: 32,
    hotelLimit: 12,
    evenBuilding: false,
    mortgageInterestRate: 0.05,
    prisonTurnsMax: 2,
    prisonBailAmount: 100,
    collectRentInPrison: true,
    maxDoublesBeforePrison: 3,
    snakeEyesBonusCash: 100,
    turnTimeLimitSeconds: 30,
    chaosEventsEnabled: true,
    chaosEventFrequencyTurns: 4,
    alliancesEnabled: true,
    maxPlayers: 8,
    diceMode: '2d6',
    spectateTrades: false,
  },
  high_roller: {
    startingCash: 3000,
    goReward: 300,
    exactGoBonus: false,
    vacationCashPot: true,
    doubleRentFullSet: true,
    rentMultiplier: 2.0,
    allowAuctions: true,
    auctionCountdown: 12,
    houseLimit: 32,
    hotelLimit: 12,
    evenBuilding: true,
    mortgageInterestRate: 0.15,
    prisonTurnsMax: 3,
    prisonBailAmount: 150,
    collectRentInPrison: false,
    maxDoublesBeforePrison: 2,
    snakeEyesBonusCash: 200,
    turnTimeLimitSeconds: 45,
    chaosEventsEnabled: false,
    chaosEventFrequencyTurns: 5,
    alliancesEnabled: true,
    maxPlayers: 8,
    diceMode: '2d6',
    spectateTrades: false,
  },
  total_chaos: {
    startingCash: 2000,
    goReward: 350,
    exactGoBonus: true,
    vacationCashPot: true,
    doubleRentFullSet: true,
    rentMultiplier: 1.5,
    allowAuctions: true,
    auctionCountdown: 10,
    houseLimit: 40,
    hotelLimit: 16,
    evenBuilding: false,
    mortgageInterestRate: 0.0,
    prisonTurnsMax: 3,
    prisonBailAmount: 75,
    collectRentInPrison: true,
    maxDoublesBeforePrison: 3,
    snakeEyesBonusCash: 300,
    turnTimeLimitSeconds: 40,
    chaosEventsEnabled: true,
    chaosEventFrequencyTurns: 3,
    alliancesEnabled: true,
    maxPlayers: 8,
    diceMode: '2d6',
    spectateTrades: false,
  },
  anarchy: {
    startingCash: 4000,
    goReward: 600,
    exactGoBonus: true,
    vacationCashPot: true,
    doubleRentFullSet: true,
    rentMultiplier: 3.0,
    allowAuctions: true,
    auctionCountdown: 8,
    houseLimit: 50,
    hotelLimit: 20,
    evenBuilding: false,
    mortgageInterestRate: 0.0,
    prisonTurnsMax: 1,
    prisonBailAmount: 250,
    collectRentInPrison: true,
    maxDoublesBeforePrison: 1,
    snakeEyesBonusCash: 500,
    turnTimeLimitSeconds: 25,
    chaosEventsEnabled: true,
    chaosEventFrequencyTurns: 2,
    alliancesEnabled: true,
    maxPlayers: 8,
    diceMode: '2d6',
    spectateTrades: false,
  },
  custom: {
    startingCash: 1500,
    goReward: 200,
    exactGoBonus: false,
    vacationCashPot: true,
    doubleRentFullSet: true,
    rentMultiplier: 1.0,
    allowAuctions: true,
    auctionCountdown: 15,
    houseLimit: 32,
    hotelLimit: 12,
    evenBuilding: true,
    mortgageInterestRate: 0.1,
    prisonTurnsMax: 3,
    prisonBailAmount: 50,
    collectRentInPrison: true,
    maxDoublesBeforePrison: 3,
    snakeEyesBonusCash: 0,
    turnTimeLimitSeconds: 60,
    chaosEventsEnabled: true,
    chaosEventFrequencyTurns: 5,
    alliancesEnabled: true,
    maxPlayers: 8,
    diceMode: '2d6',
    spectateTrades: false,
  },
};

// Base 40-tile structure template with prices and rent scales
interface TileBlueprint {
  index: number;
  type: BoardTile['type'];
  group?: ColorGroup;
  price?: number;
  rent?: number[];
  houseCost?: number;
  mortgageValue?: number;
  taxAmount?: number;
  defaultSubText?: string;
}

export const TILE_BLUEPRINTS: TileBlueprint[] = [
  { index: 0, type: 'start', defaultSubText: 'Collect $200' },
  { index: 1, type: 'property', group: 'brown', price: 60, rent: [2, 10, 30, 90, 160, 250], houseCost: 50, mortgageValue: 30 },
  { index: 2, type: 'chance', defaultSubText: 'Quake Fortune' },
  { index: 3, type: 'property', group: 'brown', price: 60, rent: [4, 20, 60, 180, 320, 450], houseCost: 50, mortgageValue: 30 },
  { index: 4, type: 'tax', taxAmount: 200, defaultSubText: 'Pay $200' },
  { index: 5, type: 'railroad', group: 'railroad', price: 200, rent: [25, 50, 100, 200, 200, 200], mortgageValue: 100 },
  { index: 6, type: 'property', group: 'light_blue', price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50, mortgageValue: 50 },
  { index: 7, type: 'fortune', defaultSubText: 'Mystery Chest' },
  { index: 8, type: 'property', group: 'light_blue', price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50, mortgageValue: 50 },
  { index: 9, type: 'property', group: 'light_blue', price: 120, rent: [8, 40, 100, 300, 450, 600], houseCost: 50, mortgageValue: 60 },
  { index: 10, type: 'prison', defaultSubText: 'Just Visiting' },
  { index: 11, type: 'property', group: 'pink', price: 140, rent: [10, 50, 150, 450, 625, 750], houseCost: 100, mortgageValue: 70 },
  { index: 12, type: 'utility', group: 'utility', price: 150, rent: [4, 10, 10, 10, 10, 10], mortgageValue: 75 }, // Multipliers of dice
  { index: 13, type: 'property', group: 'pink', price: 140, rent: [10, 50, 150, 450, 625, 750], houseCost: 100, mortgageValue: 70 },
  { index: 14, type: 'property', group: 'pink', price: 160, rent: [12, 60, 180, 500, 700, 900], houseCost: 100, mortgageValue: 80 },
  { index: 15, type: 'railroad', group: 'railroad', price: 200, rent: [25, 50, 100, 200, 200, 200], mortgageValue: 100 },
  { index: 16, type: 'property', group: 'orange', price: 180, rent: [14, 70, 200, 550, 750, 950], houseCost: 100, mortgageValue: 90 },
  { index: 17, type: 'chance', defaultSubText: 'Quake Fortune' },
  { index: 18, type: 'property', group: 'orange', price: 180, rent: [14, 70, 200, 550, 750, 950], houseCost: 100, mortgageValue: 90 },
  { index: 19, type: 'property', group: 'orange', price: 200, rent: [16, 80, 220, 600, 800, 1000], houseCost: 100, mortgageValue: 100 },
  { index: 20, type: 'vacation', defaultSubText: 'Cash Pot Rest' },
  { index: 21, type: 'property', group: 'red', price: 220, rent: [18, 90, 250, 700, 875, 1050], houseCost: 150, mortgageValue: 110 },
  { index: 22, type: 'fortune', defaultSubText: 'Mystery Chest' },
  { index: 23, type: 'property', group: 'red', price: 220, rent: [18, 90, 250, 700, 875, 1050], houseCost: 150, mortgageValue: 110 },
  { index: 24, type: 'property', group: 'red', price: 240, rent: [20, 100, 300, 750, 925, 1100], houseCost: 150, mortgageValue: 120 },
  { index: 25, type: 'railroad', group: 'railroad', price: 200, rent: [25, 50, 100, 200, 200, 200], mortgageValue: 100 },
  { index: 26, type: 'property', group: 'yellow', price: 260, rent: [22, 110, 330, 800, 975, 1150], houseCost: 150, mortgageValue: 130 },
  { index: 27, type: 'property', group: 'yellow', price: 260, rent: [22, 110, 330, 800, 975, 1150], houseCost: 150, mortgageValue: 130 },
  { index: 28, type: 'utility', group: 'utility', price: 150, rent: [4, 10, 10, 10, 10, 10], mortgageValue: 75 },
  { index: 29, type: 'property', group: 'yellow', price: 280, rent: [24, 120, 360, 850, 1025, 1200], houseCost: 150, mortgageValue: 140 },
  { index: 30, type: 'go_to_prison', defaultSubText: 'Lockdown!' },
  { index: 31, type: 'property', group: 'green', price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200, mortgageValue: 150 },
  { index: 32, type: 'property', group: 'green', price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200, mortgageValue: 150 },
  { index: 33, type: 'fortune', defaultSubText: 'Mystery Chest' },
  { index: 34, type: 'property', group: 'green', price: 320, rent: [28, 150, 450, 1000, 1200, 1400], houseCost: 200, mortgageValue: 160 },
  { index: 35, type: 'railroad', group: 'railroad', price: 200, rent: [25, 50, 100, 200, 200, 200], mortgageValue: 100 },
  { index: 36, type: 'chance', defaultSubText: 'Quake Fortune' },
  { index: 37, type: 'property', group: 'dark_blue', price: 350, rent: [35, 175, 500, 1100, 1300, 1500], houseCost: 200, mortgageValue: 175 },
  { index: 38, type: 'tax', taxAmount: 100, defaultSubText: 'Luxury Tax $100' },
  { index: 39, type: 'property', group: 'dark_blue', price: 400, rent: [50, 200, 600, 1400, 1700, 2000], houseCost: 200, mortgageValue: 200 },
];

export const THEME_NAMES: Record<BoardThemeId, { name: string; icon: string; description: string; tiles: string[] }> = {
  world_tour: {
    name: 'World Metropolis 🌍',
    icon: '🌍',
    description: 'Build your real estate empire across major global financial capitals!',
    tiles: [
      'CITY CENTER / GO', 'Cairo Oasis', 'City News', 'Giza Pyramids', 'Municipal Toll', 'Central Station Metro',
      'Rio Boardwalk', 'City Investment', 'Copacabana', 'São Paulo Plaza', 'Municipal Detention',
      'Sydney Harbor', 'Electricity Grid', 'Bondi Beach', 'Melbourne Blvd', 'Grand Terminal Express',
      'London Eye', 'City News', 'Piccadilly Circus', 'Mayfair Estate', 'City Parking Plaza',
      'Paris Louvre', 'City Investment', 'Champs-Élysées', 'Eiffel Summit', 'Riverside Metro Line',
      'Rome Colosseum', 'Venice Grand Canal', 'Water Authority', 'Milan Fashion Ave', 'Police Precinct!',
      'New York Broadway', 'Wall Street', 'City Investment', 'Fifth Avenue', 'International Transit Hub',
      'City News', 'Ginza Tokyo', 'City Revenue Tax', 'Shibuya Crossing'
    ],
  },
  cyber_neon: {
    name: 'Cyber Neon 2099 ⚡',
    icon: '⚡',
    description: 'High-tech neon dystopia with megacorps and digital infrastructure.',
    tiles: [
      'GRID GATEWAY / GO', 'Rust Alley', 'Probability Engine', 'Neon Slums', 'Bandwidth Tax', 'Nexus Sky-Maglev',
      'Hacker Den', 'Quantum Vault', 'Synth Club', 'Chromium Ave', 'Cyber Detention',
      'Neural Node', 'Fusion Core', 'Proxy Port', 'Quantum Gateway', 'Central Maglev Line',
      'Augment Clinic', 'Probability Engine', 'Silicon District', 'AI Mainframe', 'Neon Recharge Lounge',
      'Megacorp Plaza', 'Quantum Vault', 'Nexus Citadel', 'Apex Tower', 'Apex Express Rail',
      'Black Market', 'Dark Web Exchange', 'Cooling Network', 'Cyber Vault', 'Security Lockdown!',
      'Orbital Uplink', 'Cyber Skyway', 'Quantum Vault', 'Satellite Array', 'Hyperloop Orbital Hub',
      'Probability Engine', 'Zion Megatower', 'Corpo Surcharge', 'Nexus Prime Arcology'
    ],
  },
  mystic_fantasy: {
    name: 'Mystic Fantasy Realm 🔮',
    icon: '🔮',
    description: 'Enchanted forests, ancient runes, mana springs, and grand palaces of Eldoria.',
    tiles: [
      'REALM GATE / GO', 'Goblin Bog', 'Wheel of Fate', 'Muddy Marsh', 'Royal Tithe', 'Griffon Aerie',
      'Elfwood Hollow', 'Dragon\'s Hoard', 'Whispering Grove', 'Silverleaf Spires', 'Enchanted Dungeon',
      'Dwarf Forge', 'Ley-Line Forge', 'Ironstone Keep', 'Hammerfall Peak', 'Pegasus Haven',
      'Mage Academy', 'Wheel of Fate', 'Spellbook Library', 'Astral Observatory', 'Sacred Sanctuary',
      'Mermaid Cove', 'Dragon\'s Hoard', 'Kraken Trench', 'Atlantis Gate', 'Wyvern Roost',
      'Vampire Castle', 'Bloodstone Crypt', 'Mana Springs', 'Shadow Keep', 'Banishment Rift!',
      'Celestial Shrine', 'Sunfire Temple', 'Dragon\'s Hoard', 'Solar Citadel', 'Dragon Flightline',
      'Wheel of Fate', 'Dragon Citadel', 'Imperial Tribute', 'Throne of Eldoria'
    ],
  },
  cosmic_space: {
    name: 'Cosmic Space Expanse 🚀',
    icon: '🚀',
    description: 'Deep-space exploration outpost overlooking an active planetary system with orbital transit.',
    tiles: [
      'LAUNCH GATEWAY / GO', 'Moon Base Alpha', 'Mission Control', 'Lunar Mining Rig', 'Life Support Tax', 'Orbital Shuttle One',
      'Mars Outpost', 'Cosmic Vault', 'Olympus Mons', 'Red Dust Crater', 'Zero-G Detention',
      'Europa Oceans', 'Solar Reactor', 'Titan Refinery', 'Enceladus Geysers', 'Lunar Transit Express',
      'Asteroid Belt A', 'Mission Control', 'Ceres Station', 'Vesta Colony', 'Zero-G Observation Lounge',
      'Jupiter Cloud City', 'Cosmic Vault', 'Ganymede Biosphere', 'Io Volcanic Forge', 'Mars Transfer Shuttle',
      'Saturn Rings', 'Titan Metropolis', 'Life Support Grid', 'Neptune Abyss', 'Detention Airlock!',
      'Kuiper Station', 'Pluto Outpost', 'Cosmic Vault', 'Oort Cloud Hub', 'Deep Space Express',
      'Mission Control', 'Alpha Centauri Colony', 'Galactic Customs Fee', 'Interstellar Grand Outpost'
    ],
  },
  anime_akiba: {
    name: 'Anime Akiba District 🌸',
    icon: '🌸',
    description: 'Vibrant Tokyo nighttime entertainment haven filled with arcades, maid cafés, and anime towers.',
    tiles: [
      'AKIBA STATION / GO', 'Gacha Alley', 'Manga Capsule', 'Otaku Boutique', 'Tokyo District Tax', 'Yamanote Rail Alpha',
      'Ramen Yokocho', 'Lucky Cat Shrine', 'Boba Tea Lane', 'Cosplay Boulevard', 'District Koban',
      'Retro Arcade Zone', 'Tokyo Electric Grid', 'Rhythm Game Hall', 'UFO Catcher Oasis', 'Yamanote Rail Beta',
      'Idol Live Stage', 'Manga Capsule', 'Concert Dome', 'Animation Studio HQ', 'Otaku Leisure Plaza',
      'Card Battle Dojo', 'Lucky Cat Shrine', 'Figure Showcase Ave', 'Radio Kaikan Plaza', 'Yamanote Rail Gamma',
      'Moonlight Maid Cafe', 'Neko Sanctuary', 'High-Speed Optical Grid', 'Kawaii Wonderland', 'Police Transfer!',
      'Mecha Model Hangar', 'Giant Robot Bay', 'Lucky Cat Shrine', 'Akiba Central Tower', 'Yamanote Express Line',
      'Manga Capsule', 'Chuo-Dori Main Ave', 'Collector Import Tariff', 'Akiba Grand Apex Tower'
    ],
  },
  casino_royale: {
    name: 'Casino Royale 🎰',
    icon: '🎰',
    description: 'High-stakes luxury casino with live roulette, 777 slots, and diamond penthouses.',
    tiles: [
      'CASHIER / GO', 'Velvet Lounge', 'Lucky Roulette', 'High Roller Suite', 'House Edge Tax', 'Golden Monorail',
      'Poker Room', 'Quake Slots', 'Blackjack Pit', 'Baccarat Salon', 'Detention Cage',
      'Diamond Casino', 'Neon Power Grid', 'Vegas Strip', 'Flamingo Blvd', 'Bellagio Express',
      'Golden Nugget', 'Lucky Roulette', 'Monte Carlo Club', 'Caesars Palace', 'VIP Penthouse Lounge',
      'Royal Flush Oasis', 'Quake Slots', 'Palace Jackpot', 'Roulette Royale', 'Grand Casino Transit',
      'Crown Casino', 'Macau Tower', 'Dice Pit Substation', 'Mirage Oasis', 'Security Lockdown!',
      'Grand Diamond Tier', 'Billionaire Suite', 'Quake Slots', 'The Mega Jackpot', 'Hyperloop Royale',
      'Lucky Roulette', 'The Penthouse Vault', 'High Roller Tax', 'The Sultan Palace'
    ],
  },
  pixel_arcade: {
    name: 'Pixel Quest 8-Bit 🎮',
    icon: '🎮',
    description: 'Retro 8-bit indie adventure with hyperwarp relays, pixel cottages, and chiptune vibes.',
    tiles: [
      'INSERT COIN / GO', 'Pixel Plains', 'Mystery Item 🎁', 'Bit Valley', 'Arcade Token Tax', 'Hyperwarp Alpha',
      '8-Bit Castle', 'Quest Chest 📦', 'Sprite Hollow', 'Pixel Citadel', 'Dungeon Cell',
      'Chiptune Studio', 'Mana Power Station', 'Retro Arcade Hall', 'Game Console Strip', 'Hyperwarp Beta',
      'Speedrun Way', 'Mystery Item 🎁', 'Boss Arena', 'Glitch Canyon', 'SAVE POINT 💾',
      'Dragon Lair', 'Quest Chest 📦', 'Cinder Volcano', 'Obsidian Keep', 'Hyperwarp Gamma',
      'High Score Blvd', 'Polyhedral Plaza', 'Crystal Core Station', 'Neo-Arcade District', 'GAME OVER TRAP!',
      'Vector City', 'Cyber Matrix Sector', 'Quest Chest 📦', 'Polyhedral Peak', 'Hyperwarp Delta',
      'Mystery Item 🎁', 'Final Boss Tower', 'Microtransaction Tax', 'The Master Cartridge'
    ],
  },
  frutiger_aero: {
    name: 'Frutiger Aero 🌿',
    icon: '🌿',
    description: 'Glossy aqua glass, sky blue gradients, fresh green hills, and optimistic eco-digital technology.',
    tiles: [
      'AERO GATEWAY / GO', 'Aqua Bay', 'Aero Discovery 💧', 'Cloud Meadow', 'Eco Utility Fee', 'Aero Sky Transit',
      'Glass Harbor', 'Aero Aqua Fortune 🔮', 'Hydro Stream', 'Eco Plaza', 'Aero Containment',
      'Crystal Promenade', 'Solar Eco Array', 'Aqua Ridge', 'Glossy Heights', 'Aero Express Line',
      'Bio Sphere', 'Aero Discovery 💧', 'Eco Garden', 'Skyline Park', 'Cloud Observation Deck',
      'Hydro Center', 'Aero Aqua Fortune 🔮', 'Glass Atrium', 'Aero Pinnacle', 'Eco Maglev Line',
      'Sunlit Terrace', 'Clearwater Cove', 'Hydro Power Grid', 'Aqua Horizon', 'Eco Security Hold!',
      'Aero Tower', 'Cloud Citadel', 'Aero Aqua Fortune 🔮', 'Glossy Arcology', 'Aero Sky Transit Hub',
      'Aero Discovery 💧', 'Eco Apex Tower', 'Aqua System Tax', 'Frutiger Grand Citadel'
    ],
  },
};

// --- Casino Minigame Constants & Tables ---
export const CASINO_SLOT_SYMBOLS = ['7️⃣', '💎', '⭐', '🔔', '🍒', '🍋', 'BAR'] as const;
export type CasinoSlotSymbol = typeof CASINO_SLOT_SYMBOLS[number];

export const ROULETTE_RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
export const ROULETTE_BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

export function getRouletteColor(num: number): 'green' | 'red' | 'black' {
  if (num === 0) return 'green';
  return ROULETTE_RED_NUMBERS.includes(num) ? 'red' : 'black';
}

export const CHANCE_CARDS: DrawnCard[] = [
  {
    id: 'c1',
    type: 'chance',
    title: '🌋 Cashquake Surge!',
    description: 'The earth shakes with gold! Collect $150 from the bank.',
    effect: { action: 'gain_cash', amount: 150 },
  },
  {
    id: 'c2',
    type: 'chance',
    title: '💖 Jasmine’s Blessing',
    description: 'The creator of Cashquake smiles upon your game! Receive $100 and +25 QuakeCoins!',
    flavorText: 'Crafted with love by Jasmine ⭐',
    effect: { action: 'gain_cash', amount: 100 },
  },
  {
    id: 'c3',
    type: 'chance',
    title: '🚔 Speed Trap Violation',
    description: 'Caught drifting around the board. Pay a $75 fine to the Vacation Pot.',
    effect: { action: 'lose_cash', amount: 75 },
  },
  {
    id: 'c4',
    type: 'chance',
    title: '🚀 Rocket Launch!',
    description: 'Warp directly to START and collect your Go reward immediately.',
    effect: { action: 'move_to', targetIndex: 0 },
  },
  {
    id: 'c5',
    type: 'chance',
    title: '🏖️ Vacation Getaway',
    description: 'Take a break! Move directly to the Vacation Cash Pot spot.',
    effect: { action: 'move_to', targetIndex: 20 },
  },
  {
    id: 'c6',
    type: 'chance',
    title: '🛠️ General Property Repairs',
    description: 'Renovations required! Pay $25 per house and $80 per hotel.',
    effect: { action: 'pay_per_building', houseAmount: 25, hotelAmount: 80 },
  },
  {
    id: 'c7',
    type: 'chance',
    title: '🎉 Birthday Extravaganza',
    description: 'It is your lucky day! Every player gives you $35 as a gift.',
    effect: { action: 'all_pay_player', amount: 35 },
  },
  {
    id: 'c8',
    type: 'chance',
    title: '🚨 Busted by Security!',
    description: 'Go directly to Detention. Do not pass GO, do not collect $200.',
    effect: { action: 'go_to_prison' },
  },
  {
    id: 'c9',
    type: 'chance',
    title: '🎫 Get Out of Prison Pass',
    description: 'This pass grants you immediate, free release from detention.',
    effect: { action: 'get_out_of_prison' },
  },
  {
    id: 'c10',
    type: 'chance',
    title: '🎲 Lucky Stride',
    description: 'Take a bonus step forward! Advance 3 spaces.',
    effect: { action: 'move_relative', amount: 3 },
  },
  {
    id: 'c11',
    type: 'chance',
    title: '🌪️ Property Windfall',
    description: 'Your investments paid off. Bank pays you a $75 dividend.',
    effect: { action: 'gain_cash', amount: 75 },
  },
  {
    id: 'c12',
    type: 'chance',
    title: '🧨 Spontaneous Chaos!',
    description: 'Trigger a random game-wide chaos modifier immediately!',
    effect: { action: 'chaos_trigger' },
  },
];

export const FORTUNE_CARDS: DrawnCard[] = [
  {
    id: 'f1',
    type: 'fortune',
    title: '🏦 Bank Glitch in Your Favor',
    description: 'An ATM spits extra cash into your wallet! Collect $150.',
    effect: { action: 'gain_cash', amount: 150 },
  },
  {
    id: 'f2',
    type: 'fortune',
    title: '🩺 Doctor Checkup & Spa Day',
    description: 'Pay $50 for high-end wellness treatments.',
    effect: { action: 'lose_cash', amount: 50 },
  },
  {
    id: 'f3',
    type: 'fortune',
    title: '🎁 Generous Patron Donation',
    description: 'A wealthy mystery investor wires you $80.',
    effect: { action: 'gain_cash', amount: 80 },
  },
  {
    id: 'f4',
    type: 'fortune',
    title: '👑 Grand Gala Host',
    description: 'You hosted a dinner for the tycoons! Pay $40 to each player.',
    effect: { action: 'player_pay_all', amount: 40 },
  },
  {
    id: 'f5',
    type: 'fortune',
    title: '🎫 Get Out of Prison Pass',
    description: 'Keep this card until needed or trade it to another player.',
    effect: { action: 'get_out_of_prison' },
  },
  {
    id: 'f6',
    type: 'fortune',
    title: '📈 Stock Market Dividend',
    description: 'Your diversified market fund paid out! Collect $100.',
    effect: { action: 'gain_cash', amount: 100 },
  },
  {
    id: 'f7',
    type: 'fortune',
    title: '🧹 Street Cleanup Assessment',
    description: 'Pay $30 per house and $90 per hotel for neighborhood cleaning.',
    effect: { action: 'pay_per_building', houseAmount: 30, hotelAmount: 90 },
  },
  {
    id: 'f8',
    type: 'fortune',
    title: '💰 Inheritance Surprise',
    description: 'You inherit a portion of an estate. Gain $80.',
    effect: { action: 'gain_cash', amount: 80 },
  },
];

export const CHAOS_EVENTS_CATALOG: Omit<ChaosEvent, 'appliedAtTurn' | 'expiresAtTurn'>[] = [
  {
    id: 'chaos_rent_roulette',
    title: '🎰 Rent Roulette',
    description: 'One random property now charges 3x rent for the next 2 rounds!',
    severity: 'wild',
    durationTurns: 4,
    effectType: 'rent_roulette',
  },
  {
    id: 'chaos_market_crash',
    title: '📉 Market Crash',
    description: 'Global recession! All property rents and purchase costs are cut by 40% for 3 rounds!',
    severity: 'wild',
    durationTurns: 6,
    effectType: 'market_crash',
  },
  {
    id: 'chaos_blood_money',
    title: '🩸 Blood Money',
    description: 'Whenever rent is paid, 30% is redistributed evenly to the poorest player!',
    severity: 'insane',
    durationTurns: 6,
    effectType: 'blood_money',
  },
  {
    id: 'chaos_robin_hood',
    title: '🏹 Robin Hood Protocol',
    description: 'The player with the highest cash must pay $100 to every other player!',
    severity: 'insane',
    durationTurns: 1,
    effectType: 'robin_hood',
  },
  {
    id: 'chaos_bank_glitch',
    title: '💻 Bank Glitch Event',
    description: 'All players receive a surprise stimulus bonus of $250!',
    severity: 'mild',
    durationTurns: 1,
    effectType: 'bank_glitch',
  },
  {
    id: 'chaos_double_tax',
    title: '🏛️ Tax Surge',
    description: 'All tax and fee spaces charge double and deposit straight into the Vacation Pot!',
    severity: 'wild',
    durationTurns: 5,
    effectType: 'double_tax',
  },
];

export interface ShopItem {
  id: string;
  name: string;
  category: 'avatar' | 'dice' | 'trail' | 'title';
  price: number; // in QuakeCoins
  icon: string;
  description: string;
  color?: string;
  previewClass?: string;
}

export const QUAKE_VAULT_ITEMS: ShopItem[] = [
  // Avatars
  { id: 'av_cat', name: 'Mischief Cat 🐱', category: 'avatar', price: 0, icon: '🐱', description: 'Agile, smug, and ready to extort rent.' },
  { id: 'av_robot', name: 'Cyber Bot 🤖', category: 'avatar', price: 0, icon: '🤖', description: 'Programmed for maximum capital efficiency.' },
  { id: 'av_star', name: 'Jasmine’s Star ⭐', category: 'avatar', price: 0, icon: '⭐', description: 'Special creator sparkle avatar for good vibes.' },
  { id: 'av_crab', name: 'Snappy Crab 🦀', category: 'avatar', price: 0, icon: '🦀', description: 'Sidesteps rent collectors with armored pincers.' },
  { id: 'av_ghost', name: 'Spooky Phantom 👻', category: 'avatar', price: 100, icon: '👻', description: 'Haunt your rivals whenever they land on your tiles.' },
  { id: 'av_alien', name: 'Cosmic Invader 👽', category: 'avatar', price: 150, icon: '👽', description: 'Abducts property deeds from outer space.' },
  { id: 'av_crown', name: 'Monarch Crown 👑', category: 'avatar', price: 200, icon: '👑', description: 'Only for true monopoly nobility.' },
  { id: 'av_fox', name: 'Sneaky Fox 🦊', category: 'avatar', price: 120, icon: '🦊', description: 'Clever negotiator that always gets the trade.' },
  { id: 'av_dragon', name: 'Fire Dragon 🐲', category: 'avatar', price: 300, icon: '🐲', description: 'Burns down opposing portfolios with fiery rent.' },
  { id: 'av_ninja', name: 'Shadow Ninja 🥷', category: 'avatar', price: 180, icon: '🥷', description: 'Silent, deadly, and immune to bankrupt panic.' },
  { id: 'av_pizza', name: 'Pizza Slice 🍕', category: 'avatar', price: 80, icon: '🍕', description: 'Delicious capitalism at its finest.' },

  // Dice Skins
  { id: 'dice_classic', name: 'Ivory Classic 🎲', category: 'dice', price: 0, icon: '🎲', description: 'Smooth retro white dice.' },
  { id: 'dice_blossom', name: 'Pink Blossom 🌸', category: 'dice', price: 120, icon: '🌸', description: 'Soft cherry petal marble with gold pips.' },
  { id: 'dice_emerald', name: 'Emerald Glow 💚', category: 'dice', price: 160, icon: '💚', description: 'Lush glowing jade with deep forest pips.' },
  { id: 'dice_violet', name: 'Violet Dream 💜', category: 'dice', price: 180, icon: '💜', description: 'Deep cosmic amethyst with starlight pips.' },
  { id: 'dice_ocean', name: 'Ocean Blue 💙', category: 'dice', price: 150, icon: '💙', description: 'Azure ocean crystal with turquoise glow.' },
  { id: 'dice_bubblegum', name: 'Bubblegum 🩷', category: 'dice', price: 140, icon: '🩷', description: 'Sweet neon pink pop with clean white pips.' },
  { id: 'dice_midnight', name: 'Midnight 🖤', category: 'dice', price: 200, icon: '🖤', description: 'Matte obsidian with gleaming platinum pips.' },
  { id: 'dice_gold', name: 'Gold Ingot 🪙', category: 'dice', price: 150, icon: '🪙', description: 'Pure solid gold with glowing pips.' },
  { id: 'dice_neon', name: 'Cyber Matrix ⚡', category: 'dice', price: 200, icon: '⚡', description: 'Holographic cyan and magenta dice.' },
  { id: 'dice_magma', name: 'Magma Flame 🔥', category: 'dice', price: 250, icon: '🔥', description: 'Roll hot numbers straight from a volcano.' },
  { id: 'dice_cosmic', name: 'Cosmic Void 🌌', category: 'dice', price: 300, icon: '🌌', description: 'Swirling starlight and galaxy textures.' },

  // Trail Effects
  { id: 'trail_none', name: 'Standard Step', category: 'trail', price: 0, icon: '👣', description: 'Standard subtle movement step.' },
  { id: 'trail_sparkles', name: 'Glitter Sparkles ✨', category: 'trail', price: 100, icon: '✨', description: 'Leave behind shiny sparkles as you hop tiles.' },
  { id: 'trail_fire', name: 'Flame Trail 🔥', category: 'trail', price: 180, icon: '🔥', description: 'Burn the board behind every step.' },
  { id: 'trail_money', name: 'Flying Bills 💸', category: 'trail', price: 220, icon: '💸', description: 'Drop banknotes everywhere you walk.' },
  { id: 'trail_lightning', name: 'Thunder Arc ⚡', category: 'trail', price: 260, icon: '⚡', description: 'Electric crackle across the board.' },

  // Titles
  { id: 'title_novice', name: 'Rookie Landlord', category: 'title', price: 0, icon: '🌱', description: 'Just started building your empire.' },
  { id: 'title_slumlord', name: 'Ruthless Slumlord', category: 'title', price: 100, icon: '🦈', description: 'Never show mercy when collecting rent.' },
  { id: 'title_tycoon', name: 'Quake Billionaire', category: 'title', price: 250, icon: '💼', description: 'Master of high-stakes negotiations.' },
  { id: 'title_chaos', name: 'Agent of Chaos', category: 'title', price: 300, icon: '🧨', description: 'Loves turning the rules completely upside down.' },
];

export const BOT_NAMES = [
  { name: 'Chaotic Carl 🧨', avatarIcon: '🦊', color: '#F97316', personality: 'chaotic' },
  { name: 'Safe Sally 🛡️', avatarIcon: '🐱', color: '#38BDF8', personality: 'conservative' },
  { name: 'Greedy Goblin 💰', avatarIcon: '🤖', color: '#22C55E', personality: 'aggressive' },
  { name: 'Tycoon Jasmine 👑', avatarIcon: '⭐', color: '#EC4899', personality: 'tycoon' },
  { name: 'Baron Von Quake 🎩', avatarIcon: '👑', color: '#A855F7', personality: 'balanced' },
  { name: 'Alien Arthur 👽', avatarIcon: '👽', color: '#EAB308', personality: 'unpredictable' },
];
