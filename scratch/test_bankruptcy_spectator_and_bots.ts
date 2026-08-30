import { BotEngine } from '../server/src/BotEngine';
import { GameRoom } from '../server/src/GameRoom';
import { DEFAULT_RULES } from '../shared/constants';
import { Player } from '../shared/types';

function runTests() {
  console.log('=== TEST SUITE: BANKRUPTCY, SPECTATOR, AND BOT INTELLIGENCE ===\n');

  // Helper to create test room
  const createTestRoom = () => {
    const mockIo: any = {
      to: () => ({ emit: () => {} }),
      emit: () => {},
    };

    const room = new GameRoom('TEST99', mockIo);
    const p1: Player = {
      id: 'p1',
      name: 'Alice',
      isHost: true,
      isBot: false,
      isBankrupt: false,
      isSpectator: false,
      cash: 1500,
      position: 0,
      inPrison: false,
      prisonTurns: 0,
      customization: { avatarIcon: 'user', avatarId: 'avatar_1', color: '#EF4444' },
      inventory: { properties: [], houses: {}, mortgaged: {}, getOutOfJailCards: 0 },
    };

    const p2: Player = {
      id: 'p2',
      name: 'Bob',
      isHost: false,
      isBot: false,
      isBankrupt: false,
      isSpectator: false,
      cash: 1500,
      position: 0,
      inPrison: false,
      prisonTurns: 0,
      customization: { avatarIcon: 'user', avatarId: 'avatar_2', color: '#3B82F6' },
      inventory: { properties: [], houses: {}, mortgaged: {}, getOutOfJailCards: 0 },
    };

    const p3: Player = {
      id: 'p3',
      name: 'CharlieBot',
      isHost: false,
      isBot: true,
      personality: 'conservative',
      isBankrupt: false,
      isSpectator: false,
      cash: 1500,
      position: 0,
      inPrison: false,
      prisonTurns: 0,
      customization: { avatarIcon: 'bot', avatarId: 'avatar_3', color: '#10B981' },
      inventory: { properties: [], houses: {}, mortgaged: {}, getOutOfJailCards: 0 },
    };

    room.state.players = { p1, p2, p3 };
    room.state.playerOrder = ['p1', 'p2', 'p3'];
    room.state.phase = 'action_pending';
    room.state.turn.currentPlayerId = 'p1';
    return { room, p1, p2, p3 };
  };

  // Test 1: Voluntary Bankruptcy & True Property Bank Reset
  {
    console.log('Test 1: Voluntary Bankruptcy & True Property Bank Reset');
    const { room, p1 } = createTestRoom();

    // Give p1 some properties and houses
    p1.inventory.properties = ['mediterranean_ave', 'baltic_ave'];
    p1.inventory.houses['mediterranean_ave'] = 3;
    p1.inventory.mortgaged['baltic_ave'] = true;
    p1.cash = 800; // Positive cash (Voluntary bankruptcy)

    console.log('Before bankruptcy:', {
      cash: p1.cash,
      props: p1.inventory.properties,
      houses: p1.inventory.houses,
      mortgaged: p1.inventory.mortgaged,
    });

    room.declareBankruptcy('p1', null);

    console.log('After bankruptcy:', {
      isBankrupt: p1.isBankrupt,
      isSpectator: p1.isSpectator,
      cash: p1.cash,
      props: p1.inventory.properties,
      houses: p1.inventory.houses,
      mortgaged: p1.inventory.mortgaged,
      nextPlayer: room.state.turn.currentPlayerId,
    });

    if (!p1.isBankrupt || !p1.isSpectator) {
      throw new Error('Player must be marked as bankrupt and spectator');
    }
    if (p1.inventory.properties.length !== 0) {
      throw new Error('All properties must be surrendered to the bank as unowned');
    }
    if (Object.keys(p1.inventory.houses).length !== 0) {
      throw new Error('All houses must be cleared from inventory');
    }
    if (Object.keys(p1.inventory.mortgaged).length !== 0) {
      throw new Error('All mortgages must be cleared from inventory');
    }
    if (room.state.turn.currentPlayerId === 'p1') {
      throw new Error('Turn must transfer away from bankrupt player');
    }
    console.log('✓ Test 1 Passed: Properties reset to bank and turn transferred cleanly\n');
  }

  // Test 2: Server Authority Guards on Bankrupt Player
  {
    console.log('Test 2: Server Authority Guards on Bankrupt Player');
    const { room, p1, p2 } = createTestRoom();

    room.declareBankruptcy('p1', null);

    // Attempting actions with p1 must throw errors on the server
    let rollBlocked = false;
    try {
      room.rollDice('p1');
    } catch (e: any) {
      rollBlocked = true;
    }

    let endTurnBlocked = false;
    try {
      room.endTurn('p1');
    } catch (e: any) {
      endTurnBlocked = true;
    }

    let buyBlocked = false;
    try {
      room.buyProperty('p1');
    } catch (e: any) {
      buyBlocked = true;
    }

    let tradeBlocked = false;
    try {
      room.proposeTrade({
        fromPlayerId: 'p1',
        toPlayerId: 'p2',
        offeredCash: 10,
        offeredProperties: [],
        offeredCards: 0,
        requestedCash: 0,
        requestedProperties: [],
        requestedCards: 0,
      });
    } catch (e: any) {
      tradeBlocked = true;
    }

    if (!rollBlocked || !endTurnBlocked || !buyBlocked || !tradeBlocked) {
      throw new Error(`Server guards failed: roll=${rollBlocked}, endTurn=${endTurnBlocked}, buy=${buyBlocked}, trade=${tradeBlocked}`);
    }
    console.log('✓ Test 2 Passed: Server authority strictly blocks bankrupt/spectating players\n');
  }

  // Test 3: Last Player Standing Win Condition
  {
    console.log('Test 3: Last Player Standing Win Condition');
    const { room, p1, p2, p3 } = createTestRoom();

    room.declareBankruptcy('p1', null);
    if (room.state.phase === 'game_over') {
      throw new Error('Game should not be over with 2 players left');
    }

    room.declareBankruptcy('p2', null);
    if (room.state.phase !== 'game_over' || room.state.winnerId !== 'p3') {
      throw new Error(`Game over expected with winner p3, got phase=${room.state.phase}, winner=${room.state.winnerId}`);
    }
    console.log(`✓ Test 3 Passed: Match ended with winner ${room.state.winnerId}\n`);
  }

  // Test 4: BotEngine Strategic Evaluation Check
  {
    console.log('Test 4: BotEngine Execution & Safety Evaluation');
    const { room, p3 } = createTestRoom();
    room.state.turn.currentPlayerId = 'p3';
    room.state.phase = 'rolling';

    // Verify BotEngine can handle turn without crash
    BotEngine.handleBotTurn(room);
    console.log('✓ Test 4 Passed: BotEngine safely processed bot turn\n');
  }

  console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
}

runTests();
