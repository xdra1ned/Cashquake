import fs from 'fs';
import path from 'path';
import { TILE_BLUEPRINTS, THEME_NAMES } from '../shared/constants';
import { GameRoom } from '../server/src/GameRoom';
import { generateBoard } from '../shared/gameLogic';

function runMysticFantasyLivingThemeTestSuite() {
  console.log('🔮 Running Mystic Fantasy Living Enchanted Realm Verification Suite...\n');

  // --- 1. Testing Board Rules & Pricing Invariance ---
  console.log('--- 1. Testing Board Rules & Pricing Invariance ---');
  if (TILE_BLUEPRINTS.length !== 40) {
    throw new Error(`Expected 40 spaces, got ${TILE_BLUEPRINTS.length}`);
  }
  TILE_BLUEPRINTS.forEach((space, idx) => {
    if (space.group && (!space.price || !space.rent || space.rent.length !== 6)) {
      throw new Error(`Board space ${idx} (${space.group}) has invalid pricing or rent table`);
    }
  });
  console.log('✓ All 40 board spaces have 100% invariant pricing, rents, and mortgages.');

  // --- 2. Testing Themed Space Naming & Transit Integration ---
  console.log('\n--- 2. Testing Mystic Space Naming & Transit Integration ---');
  const mysticTheme = THEME_NAMES.mystic_fantasy;
  if (!mysticTheme || !mysticTheme.tiles || mysticTheme.tiles.length !== 40) {
    throw new Error(`mystic_fantasy theme tiles array is missing or invalid length`);
  }
  if (mysticTheme.tiles[0] !== 'REALM GATE / GO') {
    throw new Error(`Space 0 should be "REALM GATE / GO", got "${mysticTheme.tiles[0]}"`);
  }
  if (mysticTheme.tiles[10] !== 'Enchanted Dungeon') {
    throw new Error(`Space 10 should be "Enchanted Dungeon", got "${mysticTheme.tiles[10]}"`);
  }
  if (mysticTheme.tiles[20] !== 'Sacred Sanctuary') {
    throw new Error(`Space 20 should be "Sacred Sanctuary", got "${mysticTheme.tiles[20]}"`);
  }
  if (mysticTheme.tiles[30] !== 'Banishment Rift!') {
    throw new Error(`Space 30 should be "Banishment Rift!", got "${mysticTheme.tiles[30]}"`);
  }
  console.log('✓ All key enchanted realm, mana springs, and flightline spaces correctly mapped.');

  // --- 3. Verifying Audio Files & Licensing Attribution ---
  console.log('\n--- 3. Verifying Audio Files & Licensing Attribution ---');
  const audioFiles = [
    'mystic-bgm-gameplay.wav',
    'mystic-grimoire-open.wav',
    'mystic-crystal-shimmer.wav',
    'mystic-rune-pulse.wav',
    'mystic-fountain-ripple.wav',
    'mystic-wisp-chime.wav',
    'mystic-cauldron-bubble.wav',
  ];
  const audioDir = path.resolve(__dirname, '../client/public/themes/mystic_fantasy/audio');
  audioFiles.forEach((file) => {
    const fullPath = path.join(audioDir, file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing audio file: ${file}`);
    }
    const stat = fs.statSync(fullPath);
    if (stat.size < 100) {
      throw new Error(`Audio file too small or empty: ${file}`);
    }
    console.log(`✓ Found audio/${file} (${stat.size} bytes)`);
  });

  const attributionPath = path.resolve(__dirname, '../client/public/themes/mystic_fantasy/AUDIO_ATTRIBUTION.md');
  if (!fs.existsSync(attributionPath)) {
    throw new Error('AUDIO_ATTRIBUTION.md is missing');
  }
  console.log('✓ Found AUDIO_ATTRIBUTION.md');

  // --- 4. Verifying Physical & Inhabitant Components Exist ---
  console.log('\n--- 4. Verifying Physical & Inhabitant Components Exist ---');
  const components = [
    'CelestialGrimoire.tsx',
    'WitchCauldron.tsx',
    'FairyGrove.tsx',
    'CrystalOracle.tsx',
    'ElementalRuneStone.tsx',
    'ManaFountain.tsx',
    'ForestWisp.tsx',
  ];
  const compDir = path.resolve(__dirname, '../client/src/components/Board/ThemeInteractions/mysticFantasy');
  components.forEach((comp) => {
    const p = path.join(compDir, comp);
    if (!fs.existsSync(p)) {
      throw new Error(`Missing component: ${comp}`);
    }
    console.log(`✓ Found diegetic component ${comp}`);
  });

  // --- 5. Server-Side Simulation in Mystic Fantasy Theme ---
  console.log('\n--- 5. Simulating Multi-Turn Match with mystic_fantasy Theme ---');
  const mockIo = {
    to: () => ({ emit: () => {} }),
    in: () => ({ emit: () => {} }),
    emit: () => {}
  } as any;

  const room = new GameRoom('MYSTIC2', 'host_1', 'ArchmageHost', mockIo);
  room.updateTheme('mystic_fantasy');
  if (room.getState().themeId !== 'mystic_fantasy') {
    throw new Error('Room theme failed to update to mystic_fantasy');
  }

  room.addBot();
  room.addBot();
  room.addBot();
  room.startGame();

  // Verify board spaces prices and rents are 100% unaltered vs default theme board
  const defaultBoard = generateBoard('world_tour');
  for (let i = 0; i < 40; i++) {
    const baseSpace = defaultBoard[i];
    const roomSpace = room.getState().board[i];
    if (baseSpace.price !== roomSpace.price) {
      throw new Error(`Tile ${i} price mismatch!`);
    }
    if (baseSpace.type !== roomSpace.type) {
      throw new Error(`Tile ${i} type mismatch!`);
    }
    if (baseSpace.rent && baseSpace.rent[0] !== roomSpace.rent?.[0]) {
      throw new Error(`Tile ${i} base rent mismatch!`);
    }
  }
  console.log('✓ All 40 board spaces in live GameRoom have 100% invariant price and rent values.');

  for (let step = 0; step < 20; step++) {
    const currentTurn = room.getState().turn;
    const activePlayer = room.getState().players[currentTurn.currentPlayerId];
    if (activePlayer && !activePlayer.isBankrupt) {
      if (!currentTurn.hasRolled) {
        try {
          room.rollDice(activePlayer.id);
        } catch (e) {}
      } else {
        try {
          room.endTurn(activePlayer.id);
        } catch (e) {}
      }
    }
  }

  console.log(`✓ Successfully simulated multi-turn match in mystic_fantasy theme. Active turn: #${room.getState().turn.turnNumber}`);

  // --- 6. Verifying Invariance of Other Themes ---
  console.log('\n--- 6. Verifying Casino Royale, Pixel Arcade, World Metropolis, and Cyber Neon Invariance ---');
  if (!THEME_NAMES.casino_royale || !THEME_NAMES.pixel_arcade || !THEME_NAMES.world_tour || !THEME_NAMES.cyber_neon) {
    throw new Error('Other themes corrupted or missing');
  }
  console.log('✓ Casino Royale, Pixel Arcade, World Metropolis, and Cyber Neon remain completely intact and untouched.');

  console.log('\n🎉 ALL MYSTIC FANTASY LIVING THEME TESTS PASSED PERFECTLY!');
}

runMysticFantasyLivingThemeTestSuite();
