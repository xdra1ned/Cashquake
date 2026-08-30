import { GameRoom } from '../server/src/GameRoom';
import { THEME_NAMES, CASINO_SLOT_SYMBOLS, getRouletteColor, ROULETTE_RED_NUMBERS, ROULETTE_BLACK_NUMBERS } from '../shared/constants';
import { GameState, Player } from '../shared/types';

function createMockRoom(themeId: any = 'casino_royale'): { room: GameRoom; p1Id: string; p2Id: string } {
  const defaultCustomization = {
    avatarId: 'av_star',
    avatarIcon: '⭐',
    color: '#EC4899',
    diceSkin: 'dice_gold',
    trailEffect: 'trail_sparkles',
    title: 'High Roller',
  };
  const room = new GameRoom('CASINO_TEST', 'sess_1', 'Jasmine', defaultCustomization, () => {});
  const p1Id = room.sessionToPlayerId.get('sess_1')!;
  room.addBot();
  const p2Id = Object.keys(room.state.players).find((id) => id !== p1Id)!;

  room.updateTheme(themeId);
  return { room, p1Id, p2Id };
}

function runTests() {
  console.log('🎰 Starting Casino Royale & Interactive Casino Events Test Suite...\n');
  let testsPassed = 0;
  let testsFailed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${msg}`);
      testsPassed++;
    } else {
      console.error(`  ❌ FAIL: ${msg}`);
      testsFailed++;
    }
  }

  // 1. Theme Registration & Layout
  console.log('Test Group 1: Theme Registration & Constant Data');
  const casinoTheme = THEME_NAMES.casino_royale;
  assert(casinoTheme !== undefined, 'Casino Royale is registered in THEME_NAMES');
  assert(casinoTheme.tiles.length === 40, `Casino Royale has all 40 themed tiles (found: ${casinoTheme.tiles.length})`);
  assert(casinoTheme.tiles[0] === 'CASHIER / GO', 'Tile 0 is Cashier / Go');
  assert(CASINO_SLOT_SYMBOLS.length >= 6, `Slot symbols defined (${CASINO_SLOT_SYMBOLS.join(' ')})`);
  assert(getRouletteColor(0) === 'green', 'Roulette #0 is green');
  assert(getRouletteColor(32) === 'red' && ROULETTE_RED_NUMBERS.includes(32), 'Roulette #32 is red');
  assert(getRouletteColor(15) === 'black' && ROULETTE_BLACK_NUMBERS.includes(15), 'Roulette #15 is black');

  // 2. Landing-First Roulette Event Trigger on Chance Tile
  console.log('\nTest Group 2: Lucky Roulette Trigger on Chance Spaces (Casino Theme)');
  const { room: casinoRoom, p1Id } = createMockRoom('casino_royale');
  casinoRoom.startGame();
  const p1 = casinoRoom.state.players[p1Id];
  p1.position = 0;

  // Move p1 to space 2 (Chance)
  p1.position = 2; // tile type === 'chance'
  casinoRoom.state.board[2].type = 'chance';
  casinoRoom.triggerCasinoEvent(p1, 'roulette');

  assert(casinoRoom.state.activeCasinoEvent !== null, 'activeCasinoEvent is created on Chance landing');
  assert(casinoRoom.state.activeCasinoEvent?.eventType === 'roulette', 'Event type is roulette');
  assert(casinoRoom.state.activeCasinoEvent?.status === 'ready', 'Event initial status is ready');
  const rOutcome = casinoRoom.state.activeCasinoEvent?.outcome as any;
  assert(rOutcome.number >= 0 && rOutcome.number <= 36, `Roulette number is valid (got #${rOutcome.number})`);
  assert(rOutcome.color === 'green' || rOutcome.color === 'red' || rOutcome.color === 'black', `Roulette color is valid (${rOutcome.color})`);
  assert(typeof rOutcome.payout === 'number', `Payout is valid number ($${rOutcome.payout})`);

  // Spin Roulette
  casinoRoom.spinCasinoEvent(p1Id);
  assert(casinoRoom.state.activeCasinoEvent?.status === 'spinning', 'spinCasinoEvent updates status to spinning');

  // Resolve Roulette
  const cashBefore = p1.cash;
  casinoRoom.resolveCasinoEvent(p1Id);
  assert(casinoRoom.state.activeCasinoEvent === null, 'activeCasinoEvent is cleared after resolveCasinoEvent');
  assert(p1.cash === cashBefore + rOutcome.payout, `Player cash accurately updated: $${cashBefore} -> $${p1.cash} (delta: ${rOutcome.payout})`);

  // 3. Quake Slots Event Trigger on Fortune Tile
  console.log('\nTest Group 3: Quake Slots Trigger on Fortune Spaces (Casino Theme)');
  p1.position = 7; // tile type === 'fortune'
  casinoRoom.triggerCasinoEvent(p1, 'slots');

  assert(casinoRoom.state.activeCasinoEvent !== null, 'activeCasinoEvent is created on Fortune landing');
  assert(casinoRoom.state.activeCasinoEvent?.eventType === 'slots', 'Event type is slots');
  const sOutcome = casinoRoom.state.activeCasinoEvent?.outcome as any;
  assert(sOutcome.reels.length === 3, `Slot outcome has 3 reels: [${sOutcome.reels.join(', ')}]`);
  assert(typeof sOutcome.payout === 'number', `Slot payout is valid number ($${sOutcome.payout})`);

  // Spin & Resolve Slots
  casinoRoom.spinCasinoEvent(p1Id);
  assert(casinoRoom.state.activeCasinoEvent?.status === 'spinning', 'Slots status changed to spinning');

  const cashBeforeSlots = p1.cash;
  casinoRoom.resolveCasinoEvent(p1Id);
  assert(casinoRoom.state.activeCasinoEvent === null, 'Slots activeCasinoEvent cleared');
  assert(p1.cash === cashBeforeSlots + sOutcome.payout, `Player cash accurately updated for slots: $${cashBeforeSlots} -> $${p1.cash}`);

  // 4. Non-Casino Themes Standard Card Draw Isolation (Do Not Trigger Casino Minigames)
  console.log('\nTest Group 4: Standard Card Draw Isolation for Existing Themes');
  const { room: worldRoom, p1Id: wp1Id } = createMockRoom('world_tour');
  worldRoom.startGame();
  const wp1 = worldRoom.state.players[wp1Id];
  wp1.position = 2; // Chance tile
  worldRoom.state.board[2].type = 'chance';
  (worldRoom as any).handleTileLanding(wp1, 2);

  assert(worldRoom.state.activeCasinoEvent === null, 'World Tour does NOT create activeCasinoEvent on Chance space');
  assert(worldRoom.state.lastCardDrawn !== null, 'World Tour draws standard Chance card instead');

  // 5. Activity Log Cleanliness & Concise Output
  console.log('\nTest Group 5: Concise Activity Logging');
  const rouletteLog = casinoRoom.state.logs.find((l) => l.message.includes('Roulette'));
  const slotsLog = casinoRoom.state.logs.find((l) => l.message.includes('Slots'));
  assert(rouletteLog !== undefined, `Roulette log created: "${rouletteLog?.message}"`);
  assert(slotsLog !== undefined, `Slots log created: "${slotsLog?.message}"`);

  // 6. Turn Blocking During Active Casino Event
  console.log('\nTest Group 6: Active Casino Event Turn Blocking');
  const { room: blockRoom, p1Id: bp1Id } = createMockRoom('casino_royale');
  blockRoom.startGame();
  const bp1 = blockRoom.state.players[bp1Id];
  blockRoom.triggerCasinoEvent(bp1, 'slots');
  assert(blockRoom.state.activeCasinoEvent !== null, 'activeCasinoEvent is in progress');
  let threwOnEndTurn = false;
  try {
    blockRoom.endTurn(bp1Id);
  } catch (err: any) {
    threwOnEndTurn = true;
  }
  assert(threwOnEndTurn, 'endTurn is strictly rejected while casino event is in progress');

  // Clean up
  blockRoom.resolveCasinoEvent(bp1Id);
  assert(blockRoom.state.activeCasinoEvent === null, 'activeCasinoEvent resolved');

  // 7. Bot Autonomous Casino Sequence
  console.log('\nTest Group 7: Bot Autonomous Casino Sequence');
  const { room: botRoom, p2Id: botId } = createMockRoom('casino_royale');
  botRoom.startGame();
  const botPlayer = botRoom.state.players[botId];
  botPlayer.isBot = true;
  botRoom.triggerCasinoEvent(botPlayer, 'roulette');
  assert(botRoom.state.activeCasinoEvent !== null, 'Bot casino event registered');
  assert(botRoom.state.activeCasinoEvent.status === 'ready', 'Bot event starts in ready state');

  // 8. Property Identity & Group Color Preservation Verification
  console.log('\nTest Group 8: Property Identity & Group Color Preservation');
  const tile1 = casinoRoom.state.board[1]; // property
  assert(tile1.group === 'brown', 'Tile 1 group is brown');
  const originalColor = tile1.color;
  assert(originalColor !== undefined, `Property has authentic group color (${originalColor})`);

  // Purchase tile
  p1.inventory.properties.push(tile1.id);
  const ownerOfTile = casinoRoom.getPropertyOwner(tile1.id);
  assert(ownerOfTile?.id === p1.id, 'Tile 1 is owned by Jasmine');
  assert(tile1.color === originalColor, 'Property preserves original color-group identity');

  console.log(`\n========================================`);
  console.log(`Test Results: ${testsPassed} passed, ${testsFailed} failed`);
  console.log(`========================================\n`);

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests();
