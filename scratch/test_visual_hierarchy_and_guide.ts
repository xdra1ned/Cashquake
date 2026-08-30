import { COLOR_GROUP_HEX, THEME_NAMES } from '../shared/constants';
import { BoardThemeId } from '../shared/types';
import { GameRoom } from '../server/src/GameRoom';
import { PLAYER_IDENTITY_PALETTE, getOwnershipOutlineStyle } from '../client/src/theme/playerPalette';

console.log('🎨 Running Cashquake Visual Hierarchy, Ownership Separation & Guide Tests...\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    testsFailed++;
  }
}

// 1. Property Color vs Ownership Separation Tests
console.log('Test Group 1: Property Identity & Player Ownership Color Distinction');
const cyanPropColor = COLOR_GROUP_HEX.light_blue; // Cyan
const pinkPlayer = PLAYER_IDENTITY_PALETTE.find((p) => p.id === 'fuchsia_orchid'); // Pink
const orangePropColor = COLOR_GROUP_HEX.orange;
const bluePlayer = PLAYER_IDENTITY_PALETTE.find((p) => p.id === 'cyan_surge'); // Cyan/Blue

assert(cyanPropColor !== undefined, 'Cyan property color is defined');
assert(pinkPlayer !== undefined, 'Pink player palette entry is defined');
assert(cyanPropColor !== pinkPlayer?.hex, 'Cyan property hex and Pink player hex are structurally distinct');

assert(orangePropColor !== undefined, 'Orange property color is defined');
assert(bluePlayer !== undefined, 'Blue player palette entry is defined');
assert(orangePropColor !== bluePlayer?.hex, 'Orange property hex and Blue player hex are structurally distinct');

// Test ownership outline styles
const normalStyle = getOwnershipOutlineStyle(pinkPlayer?.hex, false, false);
assert(normalStyle.style.borderColor !== undefined, 'Normal ownership has defined border color');
assert(normalStyle.style.boxShadow !== undefined, 'Normal ownership has clean restrained inset box shadow');

const highlightedStyle = getOwnershipOutlineStyle(pinkPlayer?.hex, true, false);
assert(highlightedStyle.className.includes('scale-[1.01]'), 'Highlighted ownership has focused scale');

// 2. All 6 Themes Registration & Theme Consistency
console.log('\nTest Group 2: Theme Consistency & Board Structure');
const themes: BoardThemeId[] = [
  'world_tour',
  'cyber_neon',
  'mystic_fantasy',
  'cosmic_space',
  'anime_akiba',
  'casino_royale',
];

themes.forEach((themeId) => {
  const room = new GameRoom(`TEST_${themeId}`, 'Host', themeId);
  assert(room.state.board.length === 40, `Theme ${themeId} board has 40 tiles`);
  const properties = room.state.board.filter((t) => t.type === 'property');
  assert(properties.length === 22, `Theme ${themeId} has 22 standard properties`);
  const railroads = room.state.board.filter((t) => t.type === 'railroad');
  assert(railroads.length === 4, `Theme ${themeId} has 4 transit spaces`);
  const utilities = room.state.board.filter((t) => t.type === 'utility');
  assert(utilities.length === 2, `Theme ${themeId} has 2 utility spaces`);
});

// 3. Gameplay Logic Integrity Confirmation (No Rules Altered)
console.log('\nTest Group 3: Verified Game Rules Integrity');
const testRoom = new GameRoom('RULES_TEST', 'Host');
const p1Id = Object.keys(testRoom.state.players)[0];
const p1 = testRoom.state.players[p1Id];

// Test starting cash and Go reward
assert(testRoom.state.rules.startingCash === 1500, 'Classic starting cash is $1500');
assert(testRoom.state.rules.goReward === 200, 'Classic GO reward is $200');
assert(testRoom.state.rules.doubleRentFullSet === true, 'Monopoly double rent is enabled');
assert(testRoom.state.rules.maxDoublesBeforePrison === 3, 'Max doubles before prison is 3');

// Test mortgage rate
assert(testRoom.state.rules.mortgageInterestRate === 0.1, 'Standard mortgage interest rate is 10%');

console.log(`\n========================================`);
console.log(`Test Results: ${testsPassed} passed, ${testsFailed} failed`);
console.log(`========================================\n`);

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
