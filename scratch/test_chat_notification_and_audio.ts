import fs from 'fs';
import path from 'path';
import { GameRoom } from '../server/src/GameRoom';
import { ChatMessage, Player } from '../shared/types';

function runChatAudioTests() {
  console.log('=== TEST SUITE: CHAT AUDIO MP3 & SOCKET INTEGRATION ===\n');

  // Test 1: Static MP3 Asset Verification
  console.log('Test 1: Verify client/public/sounds/chat-notification.mp3 asset');
  const mp3Path = path.resolve(__dirname, '../client/public/sounds/chat-notification.mp3');
  if (!fs.existsSync(mp3Path)) {
    throw new Error(`MP3 file not found at: ${mp3Path}`);
  }
  const stats = fs.statSync(mp3Path);
  console.log(`MP3 File Size: ${stats.size} bytes`);
  if (stats.size < 100) {
    throw new Error('MP3 file is empty or corrupted');
  }
  console.log('✓ Test 1 Passed: chat-notification.mp3 is present and valid\n');

  // Test 2: Multi-Player Chat Messaging & Notification Isolation
  console.log('Test 2: Multi-Player Chat Messaging & Notification Isolation');

  let broadcastCount = 0;
  let latestBroadcastState: any = null;

  const room = new GameRoom(
    'CHAT01',
    'sess_p1',
    'Alice',
    { avatarIcon: 'user', avatarId: 'avatar_1', color: '#EF4444' },
    (state: any) => {
      broadcastCount++;
      latestBroadcastState = state;
    }
  );
  const p1: Player = {
    id: 'p1_alice',
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
    id: 'p2_bob',
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

  room.state.players = { [p1.id]: p1, [p2.id]: p2 };
  room.state.playerOrder = [p1.id, p2.id];

  // Client 1 (Alice) tracking simulation
  const client1ProcessedChatIds = new Set<string>();
  let client1InitialSeeded = false;
  let client1AudioChimes = 0;

  const client1HandleStateUpdate = (state: any) => {
    if (!client1InitialSeeded) {
      state.chatMessages.forEach((m: ChatMessage) => client1ProcessedChatIds.add(m.id));
      client1InitialSeeded = true;
    } else {
      state.chatMessages.forEach((m: ChatMessage) => {
        if (!client1ProcessedChatIds.has(m.id)) {
          client1ProcessedChatIds.add(m.id);
          if (m.playerId !== p1.id) {
            client1AudioChimes++;
          }
        }
      });
    }
  };

  // Client 2 (Bob) tracking simulation
  const client2ProcessedChatIds = new Set<string>();
  let client2InitialSeeded = false;
  let client2AudioChimes = 0;

  const client2HandleStateUpdate = (state: any) => {
    if (!client2InitialSeeded) {
      state.chatMessages.forEach((m: ChatMessage) => client2ProcessedChatIds.add(m.id));
      client2InitialSeeded = true;
    } else {
      state.chatMessages.forEach((m: ChatMessage) => {
        if (!client2ProcessedChatIds.has(m.id)) {
          client2ProcessedChatIds.add(m.id);
          if (m.playerId !== p2.id) {
            client2AudioChimes++;
          }
        }
      });
    }
  };

  // 1. Initial connection: Seed both clients
  client1HandleStateUpdate(room.state);
  client2HandleStateUpdate(room.state);

  console.log('Initial state:', {
    client1AudioChimes,
    client2AudioChimes,
    p1SeenCount: client1ProcessedChatIds.size,
    p2SeenCount: client2ProcessedChatIds.size,
  });

  if (client1AudioChimes !== 0 || client2AudioChimes !== 0) {
    throw new Error('Initial room connection must NOT trigger retro-chimes');
  }

  // 2. Alice sends a chat message
  console.log('\nAlice sends: "Good luck everyone!"');
  room.sendChatMessage(p1.id, 'Good luck everyone!');

  client1HandleStateUpdate(latestBroadcastState);
  client2HandleStateUpdate(latestBroadcastState);

  console.log('After Alice message:', {
    client1AudioChimes, // Alice (sender) should NOT hear chime for her own message
    client2AudioChimes, // Bob (receiver) SHOULD hear chime
  });

  if (client1AudioChimes !== 0) {
    throw new Error('Sender (Alice) should NOT hear a notification for her own chat message');
  }
  if (client2AudioChimes !== 1) {
    throw new Error('Receiver (Bob) MUST hear a notification for incoming message from Alice');
  }

  // 3. Bob sends a reply message
  console.log('\nBob replies: "Thanks Alice, you too!"');
  room.sendChatMessage(p2.id, 'Thanks Alice, you too!');

  client1HandleStateUpdate(latestBroadcastState);
  client2HandleStateUpdate(latestBroadcastState);

  console.log('After Bob message:', {
    client1AudioChimes, // Alice should now have 1 chime
    client2AudioChimes, // Bob should still have only 1 chime (did not chime on own message)
  });

  if (client1AudioChimes !== 1) {
    throw new Error('Receiver (Alice) MUST hear a notification for incoming message from Bob');
  }
  if (client2AudioChimes !== 1) {
    throw new Error('Sender (Bob) should NOT hear a notification for his own reply');
  }

  // 4. Reconnection / State update simulation without new messages
  console.log('\nUnrelated game event / reconnection state update occurs');
  room.broadcast();
  client1HandleStateUpdate(latestBroadcastState);
  client2HandleStateUpdate(latestBroadcastState);

  if (client1AudioChimes !== 1 || client2AudioChimes !== 1) {
    throw new Error('Unrelated state updates must NOT trigger chat chimes');
  }

  console.log('\n✓ Test 2 Passed: Chat audio triggers cleanly, exclusively for other players, and ignores own/historical messages\n');
  console.log('🎉 ALL CHAT AUDIO TESTS PASSED SUCCESSFULLY!');
}

runChatAudioTests();
