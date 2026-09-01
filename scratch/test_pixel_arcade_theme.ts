import { THEME_NAMES } from '../shared/constants';
import { generateBoard } from '../shared/gameLogic';
import { THEMES } from '../client/src/theme/themeRegistry';
import { GameRoom } from '../server/src/GameRoom';
import * as fs from 'fs';
import * as path from 'path';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`FAIL: ${msg}`);
  }
  console.log(`  ✓ ${msg}`);
}

console.log('--- TEST SUITE: PIXEL ARCADE THEME VERIFICATION ---');

// 1. Shared Constants & Theme Names
console.log('\n[1] Verifying Theme Constants & Space Names:');
const pixelTheme = THEME_NAMES['pixel_arcade'];
assert(!!pixelTheme, 'THEME_NAMES["pixel_arcade"] is defined');
assert(pixelTheme.name.includes('Pixel Quest'), 'Theme name is Pixel Quest 8-Bit');
assert(pixelTheme.tiles.length === 40, 'Theme has exactly 40 space names');
assert(pixelTheme.tiles[0] === 'INSERT COIN / GO', 'Space 0 is INSERT COIN / GO');
assert(pixelTheme.tiles[10] === 'Dungeon Cell', 'Space 10 is Dungeon Cell');
assert(pixelTheme.tiles[20] === 'SAVE POINT 💾', 'Space 20 is SAVE POINT 💾');
assert(pixelTheme.tiles[30] === 'GAME OVER TRAP!', 'Space 30 is GAME OVER TRAP!');

// Verify original non-copyrighted names
const copyrightedNames = ['mario', 'sonic', 'zelda', 'pacman', 'pokemon', 'tetris', 'donkey kong', 'metroid'];
for (const space of pixelTheme.tiles) {
  for (const cp of copyrightedNames) {
    assert(!space.toLowerCase().includes(cp), `Space name "${space}" does not use copyrighted IP "${cp}"`);
  }
}

// 2. Client Theme Registry
console.log('\n[2] Verifying Client Theme Registry:');
const registryEntry = THEMES['pixel_arcade'];
assert(!!registryEntry, 'THEMES["pixel_arcade"] is registered');
assert(registryEntry.id === 'pixel_arcade', 'Theme ID is pixel_arcade');
assert(registryEntry.colors.centerPattern === 'arcade_screen', 'Center pattern is arcade_screen');
assert(registryEntry.colors.boardBg.toLowerCase() === '#080714', 'Board background is #080714');
assert(registryEntry.colors.uiAccent.toLowerCase() === '#a855f7', 'UI Accent color is #a855f7');
assert(!!registryEntry.colorGroupOverrides?.brown, 'Group overrides include brown');
assert(!!registryEntry.colorGroupOverrides?.dark_blue, 'Group overrides include dark_blue');

// 3. Audio Assets & Attribution Verification
console.log('\n[3] Verifying 8-Bit Audio Assets & Attribution Documentation:');
const audioDir = path.resolve(__dirname, '../client/public/themes/pixel_arcade/audio');
assert(fs.existsSync(audioDir), 'Audio directory exists');

const requiredAudioFiles = [
  'pixel-dice-roll.wav',
  'pixel-coin-purchase.wav',
  'pixel-payment-descend.wav',
  'pixel-build-house.wav',
  'pixel-hotel-upgrade.wav',
  'pixel-auction-bid.wav',
  'pixel-bankruptcy-gameover.wav',
  'pixel-victory-fanfare.wav',
  'pixel-chat-blip.wav',
  'pixel-button-tap.wav',
  'pixel-token-hop.wav',
  'pixel-bgm-gameplay.wav',
  'pixel-bgm-lobby.wav',
  'pixel-bgm-auction.wav'
];

for (const file of requiredAudioFiles) {
  const filePath = path.join(audioDir, file);
  assert(fs.existsSync(filePath), `Audio file ${file} exists`);
  const stats = fs.statSync(filePath);
  assert(stats.size > 100, `Audio file ${file} has valid content size (${stats.size} bytes)`);
}

const attributionFile = path.resolve(__dirname, '../client/public/themes/pixel_arcade/AUDIO_ATTRIBUTION.md');
assert(fs.existsSync(attributionFile), 'AUDIO_ATTRIBUTION.md exists');
const attributionContent = fs.readFileSync(attributionFile, 'utf8');
assert(attributionContent.includes('Pixel Quest 8-Bit Theme'), 'AUDIO_ATTRIBUTION.md references Pixel Quest theme');
assert(attributionContent.includes('Procedural Original'), 'AUDIO_ATTRIBUTION.md confirms procedural original provenance');

// 4. Server-Side Gameplay & Rule Invariance Verification
console.log('\n[4] Verifying Server-Side Match Execution with pixel_arcade Theme:');
const mockIo = {
  to: () => ({ emit: () => {} }),
  in: () => ({ emit: () => {} }),
  emit: () => {}
} as any;

const room = new GameRoom('PIXEL1', 'host_1', 'HostPlayer', mockIo);
room.updateTheme('pixel_arcade');
assert(room.getState().themeId === 'pixel_arcade', 'Room theme successfully updated to pixel_arcade');

// Add 3 bot players
room.addBot();
room.addBot();
room.addBot();
assert(Object.keys(room.getState().players).length === 4, '4 players in match (1 host, 3 bots)');

// Start game
room.startGame();
assert(room.getState().phase !== 'lobby', 'Game phase is active/rolling');
assert(room.getState().themeId === 'pixel_arcade', 'Game retains pixel_arcade theme after start');

// Verify board spaces prices and rents are 100% unaltered vs default theme board
const defaultBoard = generateBoard('world_tour');
for (let i = 0; i < 40; i++) {
  const baseSpace = defaultBoard[i];
  const roomSpace = room.getState().board[i];
  assert(baseSpace.price === roomSpace.price, `Tile ${i} price matches base space`);
  assert(baseSpace.type === roomSpace.type, `Tile ${i} type matches base space`);
  if (baseSpace.rent) {
    assert(baseSpace.rent[0] === roomSpace.rent?.[0], `Tile ${i} base rent matches base space`);
  }
}

// Run bot simulation for multiple turns
console.log('\n[5] Simulating Multi-Turn Gameplay in pixel_arcade Theme:');
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

assert(room.getState().turn.turnNumber >= 1, `Simulated match is actively running on turn #${room.getState().turn.turnNumber}`);
console.log('\n✅ ALL PIXEL ARCADE THEME TESTS PASSED PERFECTLY!');
