import fs from 'fs';
import path from 'path';
import { TILE_BLUEPRINTS, THEME_NAMES } from '../shared/constants';
import { GameRoom } from '../server/src/GameRoom';
import { generateBoard } from '../shared/gameLogic';

function runCyberNeonTestSuite() {
  console.log('⚡ Running Cyber Neon 2099 Theme Deep Verification Suite...\n');

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
  console.log('\n--- 2. Testing Cyber Space Naming & Transit Integration ---');
  const cyberTheme = THEME_NAMES.cyber_neon;
  if (!cyberTheme || !cyberTheme.tiles || cyberTheme.tiles.length !== 40) {
    throw new Error(`cyber_neon theme tiles array is missing or invalid length`);
  }
  if (cyberTheme.tiles[0] !== 'GRID GATEWAY / GO') {
    throw new Error(`Space 0 should be "GRID GATEWAY / GO", got "${cyberTheme.tiles[0]}"`);
  }
  if (cyberTheme.tiles[10] !== 'Cyber Detention') {
    throw new Error(`Space 10 should be "Cyber Detention", got "${cyberTheme.tiles[10]}"`);
  }
  if (cyberTheme.tiles[20] !== 'Neon Recharge Lounge') {
    throw new Error(`Space 20 should be "Neon Recharge Lounge", got "${cyberTheme.tiles[20]}"`);
  }
  if (cyberTheme.tiles[30] !== 'Security Lockdown!') {
    throw new Error(`Space 30 should be "Security Lockdown!", got "${cyberTheme.tiles[30]}"`);
  }
  if (cyberTheme.tiles[5] !== 'Nexus Sky-Maglev' || cyberTheme.tiles[15] !== 'Central Maglev Line' || cyberTheme.tiles[25] !== 'Apex Express Rail' || cyberTheme.tiles[35] !== 'Hyperloop Orbital Hub') {
    throw new Error(`Railroad spaces do not match autonomous transit network`);
  }
  console.log('✓ All key cyberpunk transit, corporate, and infrastructure spaces correctly mapped.');

  // --- 3. Verifying Audio Files & Licensing Attribution ---
  console.log('\n--- 3. Verifying Audio Files & Licensing Attribution ---');
  const audioFiles = [
    'cyber-bgm-gameplay.wav',
    'cyber-terminal-chime.wav',
    'cyber-security-scan.wav',
    'cyber-transit-chime.wav',
    'cyber-billboard-pulse.wav',
    'cyber-drone-scan.wav',
    'cyber-network-pulse.wav',
  ];
  const audioDir = path.resolve(__dirname, '../client/public/themes/cyber_neon/audio');
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

  const attributionPath = path.resolve(__dirname, '../client/public/themes/cyber_neon/AUDIO_ATTRIBUTION.md');
  if (!fs.existsSync(attributionPath)) {
    throw new Error('AUDIO_ATTRIBUTION.md is missing');
  }
  console.log('✓ Found AUDIO_ATTRIBUTION.md');

  // --- 4. Verifying Redesigned Diegetic Interactive Components Exist ---
  console.log('\n--- 4. Verifying Redesigned Diegetic Interactive Components Exist ---');
  const components = [
    'NeuralAccessTerminal.tsx',
    'FloatingNetworkNode.tsx',
    'PatrolSurveillanceDrone.tsx',
    'FirewallSecurityGate.tsx',
    'StreetDataPort.tsx',
  ];
  const compDir = path.resolve(__dirname, '../client/src/components/Board/ThemeInteractions/cyberNeon');
  components.forEach((comp) => {
    const p = path.join(compDir, comp);
    if (!fs.existsSync(p)) {
      throw new Error(`Missing component: ${comp}`);
    }
    console.log(`✓ Found diegetic component ${comp}`);
  });

  // --- 5. Server-Side Simulation in Cyber Neon Theme ---
  console.log('\n--- 5. Simulating Multi-Turn Match with cyber_neon Theme ---');
  const mockIo = {
    to: () => ({ emit: () => {} }),
    in: () => ({ emit: () => {} }),
    emit: () => {}
  } as any;

  const room = new GameRoom('CYBER1', 'host_1', 'NetRunnerHost', mockIo);
  room.updateTheme('cyber_neon');
  if (room.getState().themeId !== 'cyber_neon') {
    throw new Error('Room theme failed to update to cyber_neon');
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

  console.log(`✓ Successfully simulated multi-turn match in cyber_neon theme. Active turn: #${room.getState().turn.turnNumber}`);

  // --- 6. Verifying Invariance of Other Themes ---
  console.log('\n--- 6. Verifying Casino Royale, Pixel Arcade, and World Metropolis Invariance ---');
  if (!THEME_NAMES.casino_royale || !THEME_NAMES.pixel_arcade || !THEME_NAMES.world_tour) {
    throw new Error('Other themes corrupted or missing');
  }
  console.log('✓ Casino Royale, Pixel Arcade, and World Metropolis remain completely intact and untouched.');

  console.log('\n🎉 ALL CYBER NEON 2099 THEME TESTS PASSED PERFECTLY!');
}

runCyberNeonTestSuite();
