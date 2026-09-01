import { GameRoom } from '../server/src/GameRoom';

function runHostCrownTests() {
  console.log('=== TEST SUITE: HOST CROWN INDICATOR & TURN HIGHLIGHT ISOLATION ===\n');

  const room = new GameRoom(
    'CROWN01',
    'sess_host',
    'HostAlice',
    { avatarIcon: 'star', avatarId: 'av_star', color: '#EC4899', diceSkin: 'dice_classic' } as any,
    () => {}
  );

  const p2Id = room.joinPlayer('sess_p2', 'sock_p2', 'PlayerBob', {
    avatarIcon: 'user',
    avatarId: 'av_user',
    color: '#38BDF8',
    diceSkin: 'dice_classic',
  } as any);

  const p3Id = room.joinPlayer('sess_p3', 'sock_p3', 'PlayerCharlie', {
    avatarIcon: 'robot',
    avatarId: 'av_robot',
    color: '#22C55E',
    diceSkin: 'dice_classic',
  } as any);

  room.startGame();

  const hostPlayer = Object.values(room.state.players).find((p) => p.isHost)!;
  const bobPlayer = room.state.players[p2Id];
  const charliePlayer = room.state.players[p3Id];

  // Helper simulating PlayerHUD badge & highlight evaluation
  const evalPlayerHUD = (player: any, currentTurnPlayerId: string) => {
    const isCurrentTurn = currentTurnPlayerId === player.id;
    const hasCrown = Boolean(player.isHost);
    const hasTurnOutline = isCurrentTurn && !player.isBankrupt;
    return {
      name: player.name,
      isHost: player.isHost,
      hasCrown,
      hasTurnOutline,
      isBankrupt: player.isBankrupt,
    };
  };

  // Case 1: Host's turn
  console.log('Case 1: HostAlice taking her turn');
  room.state.turn.currentPlayerId = hostPlayer.id;
  const c1Host = evalPlayerHUD(hostPlayer, room.state.turn.currentPlayerId);
  const c1Bob = evalPlayerHUD(bobPlayer, room.state.turn.currentPlayerId);

  console.log('Host:', c1Host);
  console.log('Bob:', c1Bob);

  if (!c1Host.hasCrown || !c1Host.hasTurnOutline) {
    throw new Error('Case 1 Failed: Host should have crown AND turn outline on her turn');
  }
  if (c1Bob.hasCrown || c1Bob.hasTurnOutline) {
    throw new Error('Case 1 Failed: Non-host should NOT have crown or turn outline when not his turn');
  }
  console.log('✓ Case 1 Passed: Host has crown and turn outline\n');

  // Case 2: Non-host player (Bob)'s turn
  console.log('Case 2: PlayerBob taking his turn');
  room.state.turn.currentPlayerId = bobPlayer.id;
  const c2Host = evalPlayerHUD(hostPlayer, room.state.turn.currentPlayerId);
  const c2Bob = evalPlayerHUD(bobPlayer, room.state.turn.currentPlayerId);

  console.log('Host:', c2Host);
  console.log('Bob:', c2Bob);

  if (!c2Host.hasCrown || c2Host.hasTurnOutline) {
    throw new Error('Case 2 Failed: Host MUST retain crown and lose turn outline');
  }
  if (c2Bob.hasCrown || !c2Bob.hasTurnOutline) {
    throw new Error('Case 2 Failed: Bob MUST have turn outline but NEVER receive crown');
  }
  console.log('✓ Case 2 Passed: Crown stays on host while turn outline shifts to Bob\n');

  // Case 3: Host becomes bankrupt/spectator
  console.log('Case 3: HostAlice declares bankruptcy');
  room.declareBankruptcy(hostPlayer.id, null);
  room.state.turn.currentPlayerId = charliePlayer.id;

  const c3Host = evalPlayerHUD(hostPlayer, room.state.turn.currentPlayerId);
  const c3Charlie = evalPlayerHUD(charliePlayer, room.state.turn.currentPlayerId);

  console.log('Host (Bankrupt):', c3Host);
  console.log('Charlie (Active Turn):', c3Charlie);

  if (!c3Host.hasCrown) {
    throw new Error('Case 3 Failed: Host MUST retain host crown even when bankrupt/spectating');
  }
  if (c3Charlie.hasCrown || !c3Charlie.hasTurnOutline) {
    throw new Error('Case 3 Failed: Charlie has turn outline and does not receive host crown');
  }
  console.log('✓ Case 3 Passed: Host crown remains on host even when eliminated\n');

  console.log('🎉 ALL HOST CROWN TESTS PASSED PERFECTLY!');
}

runHostCrownTests();
