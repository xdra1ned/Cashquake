import { GameRoom } from '../server/src/GameRoom';
import { BoardThemeId, Player } from '../shared/types';
import { THEME_NAMES } from '../shared/constants';

console.log('💬 Running Cashquake Communication UX & Theme Immersion Test Suite...\n');

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

// 1. In-Game Chat vs Activity Log Isolation
console.log('Test Group 1: Chat vs Activity Log Separation');
const room = new GameRoom('TEST01', 'p1_id', 'Host Jasmine');
const p1Id = Object.keys(room.state.players)[0];
const p1 = room.state.players[p1Id];

// Send typed chat message
const initialLogCount = room.state.logs.length;
const initialChatCount = room.state.chatMessages.length;

room.sendChatMessage(p1Id, 'Hello everyone! Good luck!');
assert(room.state.chatMessages.length === initialChatCount + 1, 'Chat message was added to chatMessages');
assert(room.state.chatMessages[0].message === 'Hello everyone! Good luck!', 'Chat message content matches');
assert(room.state.chatMessages[0].playerId === p1Id, 'Chat message sender matches player ID');
assert(room.state.logs.length === initialLogCount, 'Chat message did NOT generate an Activity Log entry');

// 2. Emoji Quick-Chat Pathway Verification
console.log('\nTest Group 2: Emoji Quick-Chat Verification');
const quickEmojis = ['😂', '❤️', '🔥', '😭', '👀', '🎉'];
quickEmojis.forEach((emoji) => {
  const preLogs = room.state.logs.length;
  const preChats = room.state.chatMessages.length;
  room.sendChatMessage(p1Id, emoji);
  assert(room.state.chatMessages.length === preChats + 1, `Quick emoji ${emoji} added to chat`);
  assert(room.state.logs.length === preLogs, `Quick emoji ${emoji} created NO activity log`);
});

// 3. Card Draw & Shared Board Announcement Data
console.log('\nTest Group 3: Card Draw State for Shared Announcement');
// Force landing on a Chance space (tile 7)
room.state.phase = 'action_pending';
p1.position = 7;
p1.cash = 1500;
(room as any).drawCard(p1, 'chance');

assert(room.state.lastCardDrawn !== null, 'lastCardDrawn is populated');
assert(room.state.lastCardDrawn?.drawnByPlayerId === p1Id, 'lastCardDrawn records correct player ID');
assert(room.state.lastCardDrawn?.card !== undefined, 'lastCardDrawn contains card definition');
assert(typeof room.state.lastCardDrawn?.card.title === 'string', 'Card has readable title for public announcement');

// 4. All 6 Themes Registration & Completeness
console.log('\nTest Group 4: All 6 Themes Completeness');
const expectedThemes: BoardThemeId[] = [
  'world_tour',
  'cosmic_space',
  'mystic_fantasy',
  'cyber_neon',
  'anime_akiba',
  'casino_royale',
];

expectedThemes.forEach((tId) => {
  assert(THEME_NAMES[tId] !== undefined, `Theme ${tId} is registered in THEME_NAMES (${THEME_NAMES[tId]})`);
  const tRoom = new GameRoom(`ROOM_${tId}`, 'Host', tId);
  assert(tRoom.state.board.length === 40, `Theme ${tId} has complete 40-tile board`);
  assert(tRoom.state.board[0].type === 'start', `Theme ${tId} has start tile at pos 0`);
  assert(tRoom.state.board[10].type === 'prison', `Theme ${tId} has prison tile at pos 10`);
  assert(tRoom.state.board[20].type === 'vacation', `Theme ${tId} has vacation tile at pos 20`);
  assert(tRoom.state.board[30].type === 'go_to_prison', `Theme ${tId} has go_to_prison tile at pos 30`);
});

// 5. Casino Royale Mechanics Preservation
console.log('\nTest Group 5: Casino Royale Mechanics Intact');
const casinoRoom = new GameRoom('CASINO', 'Jasmine', 'casino_royale');
const cP1Id = Object.keys(casinoRoom.state.players)[0];
const cP1 = casinoRoom.state.players[cP1Id];
casinoRoom.state.phase = 'action_pending';
cP1.position = 2; // Chance -> Lucky Roulette
casinoRoom.triggerCasinoEvent(cP1, 'roulette');

assert(casinoRoom.state.activeCasinoEvent !== null, 'Casino Royale creates activeCasinoEvent on chance space');
assert(casinoRoom.state.activeCasinoEvent?.eventType === 'roulette', 'Casino event is roulette');

console.log(`\n========================================`);
console.log(`Test Results: ${testsPassed} passed, ${testsFailed} failed`);
console.log(`========================================\n`);

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
