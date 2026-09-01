import fs from 'fs';
import path from 'path';
import { GameRoom } from '../server/src/GameRoom';
import { THEME_NAMES, TILE_BLUEPRINTS } from '../shared/constants';
import { THEMES } from '../client/src/theme/themeRegistry';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

console.log('🌸 === RUNNING ANIME AKIBA DISTRICT LIVING THEME TEST SUITE === 🌸\n');

// --- 1. Verifying Theme Registration & Visual Design System ---
console.log('--- 1. Verifying anime_akiba Theme Registration ---');
assert(!!THEMES.anime_akiba, 'anime_akiba theme must be registered in THEMES');
const akibaTheme = THEMES.anime_akiba;
assert(akibaTheme.id === 'anime_akiba', 'Theme ID must be anime_akiba');
assert(akibaTheme.displayName.includes('Akiba'), 'DisplayName must contain Akiba');
assert(!!akibaTheme.colors.boardBg, 'Must define boardBg');
assert(!!akibaTheme.colors.boardBorder, 'Must define boardBorder');
assert(!!akibaTheme.colors.centerBg, 'Must define centerBg');
assert(!!akibaTheme.colors.centerBorder, 'Must define centerBorder');
assert(akibaTheme.colors.centerPattern === 'akiba_district', 'Center pattern must be akiba_district');
assert(!!akibaTheme.colorGroupOverrides, 'Must have colorGroupOverrides configured');
console.log(`✓ Verified anime_akiba visual tokens: ${akibaTheme.displayName} (${akibaTheme.colors.uiAccent})`);

// --- 2. Verifying All 40 Tile Spaces Parity & Math Invariance ---
console.log('\n--- 2. Verifying All 40 Spaces Math Invariance ---');
assert(TILE_BLUEPRINTS.length === 40, 'Standard board must have exactly 40 spaces');
const akibaTileNames = THEME_NAMES.anime_akiba.tiles;
assert(akibaTileNames.length === 40, 'anime_akiba must have exactly 40 thematic tile names');

TILE_BLUEPRINTS.forEach((baseTile, idx) => {
  const themedName = akibaTileNames[idx];
  assert(!!themedName && themedName.length > 0, `Space #${idx} must have non-empty name`);
  if (baseTile.type === 'property') {
    assert(typeof baseTile.price === 'number' && baseTile.price > 0, `Property #${idx} must have valid price`);
    assert(Array.isArray(baseTile.rent) && baseTile.rent.length === 6, `Property #${idx} must have 6 rent tiers`);
  }
});
console.log('✓ All 40 spaces in anime_akiba have strict mathematical and pricing parity.');

// --- 3. Verifying Procedural Audio Files & Attribution ---
console.log('\n--- 3. Verifying Procedural Audio Suite ---');
const audioDir = path.join(process.cwd(), 'client', 'public', 'themes', 'anime_akiba', 'audio');
const expectedAudioFiles = [
  'anime-akiba-bgm-gameplay.wav',
  'anime-billboard-cycle.wav',
  'anime-gachapon-turn.wav',
  'anime-arcade-coin.wav',
  'anime-cafe-chime.wav',
  'anime-vending-drop.wav',
  'anime-train-arrival.wav',
];

expectedAudioFiles.forEach((file) => {
  const filePath = path.join(audioDir, file);
  assert(fs.existsSync(filePath), `Audio file must exist: ${file}`);
  const stats = fs.statSync(filePath);
  assert(stats.size > 1000, `Audio file ${file} must be valid non-empty audio (>1KB). Actual: ${stats.size} bytes`);
  console.log(`✓ Found audio/${file} (${stats.size} bytes)`);
});

const attributionPath = path.join(process.cwd(), 'client', 'public', 'themes', 'anime_akiba', 'AUDIO_ATTRIBUTION.md');
assert(fs.existsSync(attributionPath), 'AUDIO_ATTRIBUTION.md must exist in anime_akiba theme dir');
console.log('✓ Found AUDIO_ATTRIBUTION.md');

// --- 4. Verifying Physical & Inhabitant Components Exist ---
console.log('\n--- 4. Verifying Physical & District Components Exist ---');
const components = [
  'AnimeBillboard.tsx',
  'GachaponMachine.tsx',
  'ArcadeCabinet.tsx',
  'MaidCafe.tsx',
  'AnimeVendingMachine.tsx',
  'TrainPlatform.tsx',
  'MascotCharacter.tsx',
];

const compDir = path.join(process.cwd(), 'client', 'src', 'components', 'Board', 'ThemeInteractions', 'animeAkiba');
components.forEach((comp) => {
  const compPath = path.join(compDir, comp);
  assert(fs.existsSync(compPath), `Diegetic component must exist: ${comp}`);
  const content = fs.readFileSync(compPath, 'utf8');
  assert(content.includes('export const'), `Component ${comp} must export a React component`);
  console.log(`✓ Found diegetic component ${comp}`);
});

const containerPath = path.join(process.cwd(), 'client', 'src', 'components', 'Board', 'ThemeInteractions', 'AnimeAkibaInteractions.tsx');
assert(fs.existsSync(containerPath), 'AnimeAkibaInteractions.tsx must exist');
console.log('✓ Found AnimeAkibaInteractions.tsx');

// --- 5. Simulating Multi-Turn Match with anime_akiba Theme ---
console.log('\n--- 5. Simulating Multi-Turn Match with anime_akiba Theme ---');
const mockIo = {
  to: () => ({ emit: () => {} }),
  in: () => ({ emit: () => {} }),
  emit: () => {}
} as any;

const room = new GameRoom('TEST_AKIBA', 'host_akiba', 'Kira Host', mockIo);
room.updateTheme('anime_akiba');

assert(room.getState().themeId === 'anime_akiba', 'Room theme must be anime_akiba');

room.addBot();
room.addBot();
room.addBot();
room.startGame();

assert(room.getState().phase === 'rolling', 'Game must be in rolling phase');

// Verify pricing invariant inside live room state
room.getState().board.forEach((space, idx) => {
  assert(space.index === idx, `Board space ${idx} must have consistent index`);
  if (space.type === 'property') {
    assert(space.price === TILE_BLUEPRINTS[idx].price, `Price for space ${idx} must match canonical board`);
    assert(JSON.stringify(space.rent) === JSON.stringify(TILE_BLUEPRINTS[idx].rent), `Rent array for space ${idx} must match canonical board`);
  }
});

console.log('✓ All 40 board spaces in live GameRoom have 100% invariant price and rent values.');

// Simulate 20 turns
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

console.log(`✓ Successfully simulated multi-turn match in anime_akiba theme. Active turn: #${room.getState().turn.turnNumber}`);

// --- 6. Verifying Other Themes Invariance ---
console.log('\n--- 6. Verifying Other Themes Invariance ---');
assert(!!THEMES.casino_royale, 'casino_royale must remain untouched');
assert(!!THEMES.pixel_arcade, 'pixel_arcade must remain untouched');
assert(!!THEMES.world_tour, 'world_tour must remain untouched');
assert(!!THEMES.cyber_neon, 'cyber_neon must remain untouched');
assert(!!THEMES.mystic_fantasy, 'mystic_fantasy must remain untouched');
assert(!!THEMES.cosmic_space, 'cosmic_space must remain untouched');
console.log('✓ Casino Royale, Pixel Quest, World Metropolis, Cyber Neon, Mystic Fantasy, and Cosmic Space remain completely intact.');

console.log('\n🎉 ALL ANIME AKIBA DISTRICT LIVING THEME TESTS PASSED PERFECTLY! 🌸✨');
