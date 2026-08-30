import assert from 'assert';
import { GameRoom } from '../server/src/GameRoom';
import { AVATAR_REGISTRY } from '../client/src/components/Avatars/AvatarSilhouette';
import { CHANCE_CARDS, FORTUNE_CARDS, QUAKE_VAULT_ITEMS } from '../shared/constants';
import { canBuildHouse, canSellHouse } from '../shared/gameLogic';
import { GameRules } from '../shared/types';

console.log('🧪 Running comprehensive Gameplay Rules, UI/UX & Balance Refinement test suite...\n');

// --- Test 1: Crab Avatar Registration ---
console.log('▶ Test 1: Verifying Crab Avatar (av_crab)...');
const crabVaultItem = QUAKE_VAULT_ITEMS.find((item) => item.id === 'av_crab');
assert(crabVaultItem, 'av_crab must be present in QUAKE_VAULT_ITEMS');
assert.strictEqual(crabVaultItem.category, 'avatar');
assert(crabVaultItem.name.toLowerCase().includes('crab'), 'Name should mention crab');
assert(AVATAR_REGISTRY['av_crab'], 'av_crab must be registered in AVATAR_REGISTRY');
console.log('✓ Crab avatar properly registered in vault and avatar registry.');

// --- Test 2: Distinct Player Colors Enforcement ---
console.log('\n▶ Test 2: Distinct Player Colors Enforcement...');
const hostCustomization = { avatarId: 'av_cat', color: '#EC4899', diceSkin: 'dice_classic', trailEffect: 'trail_none', title: 'Host' };
const room = new GameRoom('TEST-ROOM', 'host-sess', 'Host Alice', hostCustomization, () => {});
const hostPId = room.getState().hostId;
const p2Id = room.joinPlayer('p2-sess', 'p2-sock', 'Bob', { avatarId: 'av_robot', color: '#EC4899', diceSkin: 'dice_classic', trailEffect: 'trail_none', title: 'Tycoon' });
const p3Id = room.joinPlayer('p3-sess', 'p3-sock', 'Charlie', { avatarId: 'av_crab', color: '#38BDF8', diceSkin: 'dice_classic', trailEffect: 'trail_none', title: 'Tycoon' });
room.addBot();

const state = room.getState();
const assignedColors = Object.values(state.players).map((p) => p.customization.color);
const uniqueColors = new Set(assignedColors);
assert.strictEqual(
  assignedColors.length,
  uniqueColors.size,
  'All joined players and bots must have distinct, non-duplicate colors'
);

// Verify updating customization to duplicate color is automatically converted to a distinct color
const aliceColor = state.players[hostPId].customization.color;
room.updatePlayerCustomization(p2Id, { color: aliceColor });
assert.notStrictEqual(
  state.players[p2Id].customization.color,
  aliceColor,
  'Player color must never duplicate another active player color'
);
const newAssignedColors = Object.values(state.players).map((p) => p.customization.color);
assert.strictEqual(
  newAssignedColors.length,
  new Set(newAssignedColors).size,
  'All player colors must remain 100% unique'
);
console.log('✓ Unique player colors strictly enforced on join, bot creation, and customization update.');

// --- Test 3: 12-Sided Dice Mode (2d12) ---
console.log('\n▶ Test 3: 12-Sided Dice Mode (2d12)...');
const room2d12 = new GameRoom('DICE-ROOM', 'h-sess', 'Player 1', hostCustomization, () => {});
const r2HostId = room2d12.getState().hostId;
room2d12.joinPlayer('p2-sess', 'p2-sock', 'Player 2', { avatarId: 'av_crab', color: '#38BDF8', diceSkin: 'dice_classic', trailEffect: 'trail_none', title: 'Tycoon' });
room2d12.updateRules('custom', { diceMode: '2d12' });
assert.strictEqual(room2d12.getState().rules.diceMode, '2d12');

room2d12.startGame(r2HostId);
const activePId = room2d12.getState().turn.currentPlayerId;

let seenGreaterThan6 = false;
for (let i = 0; i < 50; i++) {
  // Test rollDice generation
  const res = room2d12.rollDice(activePId);
  const sum = res.d1 + res.d2;
  assert(res.d1 >= 1 && res.d1 <= 12, `Die 1 out of bounds: ${res.d1}`);
  assert(res.d2 >= 1 && res.d2 <= 12, `Die 2 out of bounds: ${res.d2}`);
  assert(sum >= 2 && sum <= 24, `Dice sum out of bounds: ${sum}`);
  if (res.d1 > 6 || res.d2 > 6) {
    seenGreaterThan6 = true;
  }
  // Reset for next test iteration
  (room2d12 as any).state.turn.hasRolled = false;
  (room2d12 as any).state.phase = 'rolling';
}
assert(seenGreaterThan6, '2d12 mode must produce rolls above 6');
console.log('✓ 12-sided dice mode (2d12) verified with 1-12 individual dice and 2-24 sums.');

// --- Test 4: Negative Money / Debt Resolution ---
console.log('\n▶ Test 4: Negative Money / Debt Resolution Blocking...');
const debtRoom = new GameRoom('DEBT-ROOM', 'h-sess', 'Player 1', hostCustomization, () => {});
const debtHostId = debtRoom.getState().hostId;
debtRoom.joinPlayer('p2-sess', 'p2-sock', 'Player 2', { avatarId: 'av_crab', color: '#38BDF8', diceSkin: 'dice_classic', trailEffect: 'trail_none', title: 'Tycoon' });
debtRoom.startGame(debtHostId);
const debtPlayerId = debtRoom.getState().turn.currentPlayerId;

// Put player in negative cash
debtRoom.getState().players[debtPlayerId].cash = -150;

// Rolling dice while in debt must be rejected
assert.throws(() => {
  debtRoom.rollDice(debtPlayerId);
}, /outstanding debt/);

// Ending turn while in debt must be rejected
assert.throws(() => {
  debtRoom.endTurn(debtPlayerId);
}, /outstanding debt/);

// Restoring cash to 0 allows continuing
debtRoom.getState().players[debtPlayerId].cash = 50;
const validRoll = debtRoom.rollDice(debtPlayerId);
assert(validRoll.d1 + validRoll.d2 >= 2, 'Valid roll after clearing debt');
console.log('✓ Debt resolution strictly blocks rolling and ending turn until obligations are satisfied.');

// --- Test 5: Turn-Enforced House & Hotel Construction ---
console.log('\n▶ Test 5: Turn-Enforced House Construction...');
const buildRoom = new GameRoom('BUILD-ROOM', 'h-sess', 'Player 1', hostCustomization, () => {});
const buildHostId = buildRoom.getState().hostId;
const p2BuildId = buildRoom.joinPlayer('p2-sess', 'p2-sock', 'Player 2', { avatarId: 'av_crab', color: '#38BDF8', diceSkin: 'dice_classic', trailEffect: 'trail_none', title: 'Tycoon' });
buildRoom.startGame(buildHostId);
const turnPlayerId = buildRoom.getState().turn.currentPlayerId;
const otherPlayerId = turnPlayerId === buildHostId ? p2BuildId : buildHostId;

// Give full brown color set to active player and light_blue to other player
const bState = buildRoom.getState();
const p1Props = ['tile_1', 'tile_3']; // Brown group
bState.players[turnPlayerId].inventory.properties.push(...p1Props);
bState.players[turnPlayerId].cash = 2000;
bState.players[otherPlayerId].inventory.properties.push('tile_6', 'tile_8', 'tile_9'); // Light blue group
bState.players[otherPlayerId].cash = 2000;

// Active turn player CAN build
const checkActive = canBuildHouse(bState.players[turnPlayerId], 'tile_1', bState.board, bState.rules, turnPlayerId);
assert.strictEqual(checkActive.canBuild, true);
buildRoom.buildHouse(turnPlayerId, 'tile_1');
assert.strictEqual(bState.players[turnPlayerId].inventory.houses['tile_1'], 1);

// Non-turn player CANNOT build
const checkInactive = canBuildHouse(bState.players[otherPlayerId], 'tile_6', bState.board, bState.rules, turnPlayerId);
assert.strictEqual(checkInactive.canBuild, false);
assert(checkInactive.reason?.includes('during your turn'));

assert.throws(() => {
  buildRoom.buildHouse(otherPlayerId, 'tile_6');
}, /only construct buildings during your turn/);

assert.throws(() => {
  buildRoom.sellHouse(otherPlayerId, 'tile_6');
}, /only sell buildings during your turn/);
console.log('✓ House construction and selling strictly enforced on player active turn.');

// --- Test 6: Casino Roulette Rebalanced Payouts ---
console.log('\n▶ Test 6: Casino Roulette Rebalanced Payouts...');
const casinoRoom = new GameRoom('CASINO-ROOM', 'h-sess', 'Player 1', hostCustomization, () => {});
const cHostId = casinoRoom.getState().hostId;
casinoRoom.joinPlayer('p2-sess', 'p2-sock', 'Player 2', { avatarId: 'av_crab', color: '#38BDF8', diceSkin: 'dice_classic', trailEffect: 'trail_none', title: 'Tycoon' });
casinoRoom.startGame(cHostId);
const cpId = casinoRoom.getState().turn.currentPlayerId;
casinoRoom.getState().players[cpId].cash = 500;

// Trigger casino roulette event
(casinoRoom as any).triggerCasinoEvent(casinoRoom.getState().players[cpId], 'roulette');
const activeCasino = casinoRoom.getState().activeCasinoEvent;
assert(activeCasino, 'activeCasinoEvent must exist');
assert(activeCasino.outcome, 'activeCasinoEvent.outcome must exist');
assert(typeof activeCasino.outcome.payout === 'number', 'payout must be a number');
assert(typeof activeCasino.outcome.title === 'string', 'title must be a string');

casinoRoom.spinCasinoEvent(cpId);
assert.strictEqual(casinoRoom.getState().activeCasinoEvent?.status, 'spinning');

const initialCash = casinoRoom.getState().players[cpId].cash;
casinoRoom.resolveCasinoEvent(cpId);
const finalCash = casinoRoom.getState().players[cpId].cash;
assert.strictEqual(finalCash, initialCash + activeCasino.outcome.payout);
console.log(`✓ Casino roulette spun cleanly with outcome "${activeCasino.outcome.title}" (Cash payout: ${activeCasino.outcome.payout >= 0 ? '+' : ''}$${activeCasino.outcome.payout}).`);

// --- Test 7: Card Rebalance Verification ---
console.log('\n▶ Test 7: Card Rebalance Mixture Verification...');
const chanceActions = CHANCE_CARDS.map((c) => c.effect.action);
const fortuneActions = FORTUNE_CARDS.map((c) => c.effect.action);

const hasChanceGain = chanceActions.includes('gain_cash') || chanceActions.includes('all_pay_player');
const hasChanceLoss = chanceActions.includes('lose_cash') || chanceActions.includes('player_pay_all') || chanceActions.includes('pay_per_building') || chanceActions.includes('go_to_prison');
const hasFortuneGain = fortuneActions.includes('gain_cash') || fortuneActions.includes('all_pay_player');
const hasFortuneLoss = fortuneActions.includes('lose_cash') || fortuneActions.includes('player_pay_all') || fortuneActions.includes('pay_per_building');

assert(hasChanceGain && hasChanceLoss, 'Chance cards must have a balanced mixture of positive and negative effects');
assert(hasFortuneGain && hasFortuneLoss, 'Fortune cards must have a balanced mixture of positive and negative effects');
console.log('✓ Chance and Fortune card decks verified with balanced positive and negative outcomes.');

console.log('\n🎉 ALL GAMEPLAY RULES & UX UNIT TESTS PASSED PERFECTLY!\n');
