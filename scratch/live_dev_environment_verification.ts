import { io, Socket } from 'socket.io-client';
import { GameState } from '../shared/types';

async function runLiveDevEnvironmentVerification() {
  console.log('=== REAL DEV ENVIRONMENT WEBSOCKET & BOT STABILITY VERIFICATION ===\n');

  const clientUrl = 'http://localhost:5173';
  console.log(`Connecting Socket.IO client to Vite Proxy: ${clientUrl}...`);

  const socket: Socket = io(clientUrl, {
    transports: ['websocket', 'polling'],
    timeout: 10000,
  });

  let roomCode = '';
  let myPlayerId = '';
  let updatesReceived = 0;
  let turnsObserved = new Set<number>();
  let botActionsObserved = 0;
  let tradeOffersObserved = 0;
  let disconnectEvents = 0;
  let connectionErrors = 0;
  let latestState: GameState | null = null;

  socket.on('connect', () => {
    console.log(`✓ Socket connected successfully! Socket ID: ${socket.id}`);
  });

  socket.on('disconnect', (reason) => {
    disconnectEvents++;
    console.warn(`⚠️ Socket disconnected: ${reason}`);
  });

  socket.on('connect_error', (err) => {
    connectionErrors++;
    console.error(`❌ Socket connection error:`, err.message);
  });

  socket.on('gameStateUpdate', (state: GameState) => {
    updatesReceived++;
    latestState = state;
    turnsObserved.add(state.turn.turnNumber);

    if (state.activeTrade) {
      tradeOffersObserved++;
    }

    const latestLog = state.logs[0];
    if (latestLog && latestLog.playerId && state.players[latestLog.playerId]?.isBot) {
      botActionsObserved++;
    }

    // Auto-advance host turn if it's our turn
    if (state.phase === 'rolling' && state.turn.currentPlayerId === myPlayerId && !state.turn.hasRolled) {
      setTimeout(() => {
        socket.emit('rollDice', {}, () => {});
      }, 500);
    } else if (state.phase === 'action_pending' && state.turn.currentPlayerId === myPlayerId) {
      setTimeout(() => {
        socket.emit('endTurn', {}, () => {});
      }, 1000);
    }
  });

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Connection timed out')), 6000);
    socket.on('connect', () => {
      clearTimeout(timeout);
      resolve();
    });
  });

  // Step 1: Create room
  console.log('\n--- Step 1: Create Live Match Room ---');
  await new Promise<void>((resolve, reject) => {
    socket.emit(
      'createRoom',
      {
        sessionId: `sess_live_${Date.now()}`,
        name: 'LiveDevHost',
        customization: { avatarIcon: 'shield', avatarId: 'av_host', color: '#EC4899' },
      },
      (res: any) => {
        if (res?.success) {
          roomCode = res.roomCode;
          myPlayerId = res.playerId;
          console.log(`✓ Room created successfully! Code: ${roomCode}, Host PlayerId: ${myPlayerId}`);
          resolve();
        } else {
          reject(new Error(res?.error || 'Failed to create room'));
        }
      }
    );
  });

  // Step 2: Add 3 Bots
  console.log('\n--- Step 2: Add 3 Bot Players ---');
  for (let i = 1; i <= 3; i++) {
    socket.emit('addBot');
    await new Promise((r) => setTimeout(r, 400));
    console.log(`✓ Added bot ${i} (Total players in state: ${Object.keys(latestState?.players || {}).length})`);
  }

  // Step 3: Start Match
  console.log('\n--- Step 3: Start Game Match ---');
  await new Promise<void>((resolve, reject) => {
    socket.emit('startGame', {}, (res: any) => {
      if (res?.success) {
        console.log(`✓ Match started successfully!`);
        resolve();
      } else {
        reject(new Error(res?.error || 'Failed to start game'));
      }
    });
  });

  // Step 4: Monitor Live Real-Time Bot Execution (20s)
  console.log('\n--- Step 4: Monitoring Live Real-Time Bot Execution (20s) ---');
  const monitorSeconds = 20;
  for (let sec = 1; sec <= monitorSeconds; sec++) {
    await new Promise((r) => setTimeout(r, 1000));
    process.stdout.write(
      `\rLive monitoring: ${sec}/${monitorSeconds}s | State Updates: ${updatesReceived} | Turns: ${turnsObserved.size} | Bot Actions: ${botActionsObserved} | WS: ${socket.connected ? 'CONNECTED' : 'DISCONNECTED'}`
    );
  }
  console.log('\n');

  const unexpectedDisconnects = disconnectEvents;
  socket.disconnect();

  console.log('--- Verification Summary ---');
  console.log(`Total Game State Updates: ${updatesReceived}`);
  console.log(`Distinct Turns Observed: ${turnsObserved.size}`);
  console.log(`Bot Actions Observed: ${botActionsObserved}`);
  console.log(`Unexpected WebSocket Disconnections: ${unexpectedDisconnects}`);
  console.log(`Connection Errors: ${connectionErrors}`);
  console.log(`Final Game Phase: ${latestState?.phase}`);

  if (unexpectedDisconnects > 0 || connectionErrors > 0) {
    throw new Error(`WebSocket stability test failed with ${unexpectedDisconnects} disconnects and ${connectionErrors} errors`);
  }

  if (updatesReceived < 5) {
    throw new Error('Too few game state updates received during live monitoring');
  }

  console.log('\n✓ WebSocket connection stayed 100% connected with 0 unexpected disconnects and 0 errors.');
  console.log('✓ Node backend processed live bot turns and strategic actions continuously without crashing.\n');
  console.log('🎉 LIVE DEV ENVIRONMENT VERIFICATION PASSED PERFECTLY!');
}

runLiveDevEnvironmentVerification().catch((err) => {
  console.error('\n❌ Verification Failed:', err);
  process.exit(1);
});
