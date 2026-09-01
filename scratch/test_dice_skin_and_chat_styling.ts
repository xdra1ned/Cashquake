import { GameRoom } from '../server/src/GameRoom';
import { getDiceSkin, DICE_SKIN_STYLES } from '../client/src/theme/cosmeticsRegistry';
import { Player, ChatMessage } from '../shared/types';

function runDiceSkinAndChatStylingTests() {
  console.log('=== TEST SUITE: DEFAULT DICE SKIN CONSISTENCY & ELIMINATED CHAT STYLING ===\n');

  // Test 1: Universal Default Dice Skin (Ivory Classic)
  console.log('Test 1: Universal Default Dice Skin (Ivory Classic)');

  // 1a: getDiceSkin fallback
  const defaultFallbackSkin = getDiceSkin();
  console.log(`Fallback getDiceSkin() -> ID: ${defaultFallbackSkin.id}, Name: ${defaultFallbackSkin.name}`);
  if (defaultFallbackSkin.id !== 'dice_classic') {
    throw new Error(`Expected default fallback skin to be 'dice_classic', got '${defaultFallbackSkin.id}'`);
  }

  const invalidFallbackSkin = getDiceSkin('invalid_unknown_skin_id');
  console.log(`Unknown getDiceSkin('invalid_unknown_skin_id') -> ID: ${invalidFallbackSkin.id}, Name: ${invalidFallbackSkin.name}`);
  if (invalidFallbackSkin.id !== 'dice_classic') {
    throw new Error(`Expected invalid skin fallback to be 'dice_classic', got '${invalidFallbackSkin.id}'`);
  }

  // 1b: Server host and join default dice skins
  const room = new GameRoom(
    'DICESK',
    'sess_host',
    'HostJasmine',
    { avatarIcon: 'star', avatarId: 'av_star', color: '#EC4899' } as any,
    () => {}
  );

  const host = Object.values(room.state.players)[0];
  console.log(`Host player diceSkin: ${host.customization.diceSkin}`);
  if (host.customization.diceSkin !== 'dice_classic') {
    throw new Error(`Expected host player diceSkin to default to 'dice_classic', got '${host.customization.diceSkin}'`);
  }

  // 1c: Joining player with no diceSkin specified
  const p2Id = room.joinPlayer(
    'sess_p2',
    'sock_p2',
    'PlayerBob',
    { avatarIcon: 'user', avatarId: 'av_user', color: '#38BDF8' } as any
  );
  const p2 = room.state.players[p2Id];
  console.log(`Joining player with no diceSkin specified: ${p2.customization.diceSkin}`);
  if (p2.customization.diceSkin !== 'dice_classic') {
    throw new Error(`Expected joining player diceSkin to default to 'dice_classic', got '${p2.customization.diceSkin}'`);
  }

  // 1d: Joining player with explicitly equipped dice skin
  const p3Id = room.joinPlayer(
    'sess_p3',
    'sock_p3',
    'PlayerCharlie',
    { avatarIcon: 'cat', avatarId: 'av_cat', color: '#22C55E', diceSkin: 'dice_emerald' } as any
  );
  const p3 = room.state.players[p3Id];
  console.log(`Joining player with explicitly equipped 'dice_emerald': ${p3.customization.diceSkin}`);
  if (p3.customization.diceSkin !== 'dice_emerald') {
    throw new Error(`Expected explicitly equipped skin to remain 'dice_emerald', got '${p3.customization.diceSkin}'`);
  }

  // 1e: Bot dice skin
  room.addBot();
  const bot = Object.values(room.state.players).find((p) => p.isBot);
  console.log(`Bot player diceSkin: ${bot?.customization.diceSkin}`);
  if (!bot || bot.customization.diceSkin !== 'dice_classic') {
    throw new Error(`Expected bot player diceSkin to be 'dice_classic', got '${bot?.customization.diceSkin}'`);
  }

  console.log('✓ Test 1 Passed: Ivory Classic is universally and gracefully applied as default\n');

  // Test 2: Eliminated / Bankrupt Player Chat Styling Synchronization
  console.log('Test 2: Eliminated / Bankrupt Player Chat Styling Synchronization');

  // Alice (Active) sends a message
  room.sendChatMessage(host.id, 'Let’s trade property!');
  const activeMsg = room.state.chatMessages[0];

  const evalChatMsgStyling = (msg: ChatMessage, players: Record<string, Player>) => {
    const sender = players[msg.playerId];
    const isEliminated = sender ? Boolean(sender.isBankrupt || sender.isSpectator) : false;
    return {
      senderName: sender ? sender.name : msg.playerName,
      isEliminated,
      badge: isEliminated ? 'SPECTATOR' : null,
      avatarDesaturated: isEliminated,
    };
  };

  const activeResult = evalChatMsgStyling(activeMsg, room.state.players);
  console.log('Active Player Message Evaluation:', activeResult);
  if (activeResult.isEliminated || activeResult.badge !== null) {
    throw new Error('Active player must not be styled as eliminated/spectator');
  }

  // Now, Bob goes bankrupt
  console.log('\nBob declares bankruptcy...');
  room.declareBankruptcy(p2Id, null);
  console.log(`Bob status after bankruptcy: isBankrupt=${p2.isBankrupt}, isSpectator=${p2.isSpectator}`);

  // Bob sends a message as a spectator
  room.sendChatMessage(p2Id, 'Good luck everyone, watching now!');
  const bankruptMsg = room.state.chatMessages[room.state.chatMessages.length - 1];

  const bankruptResult = evalChatMsgStyling(bankruptMsg, room.state.players);
  console.log('Eliminated/Spectator Player Message Evaluation:', bankruptResult);

  if (!bankruptResult.isEliminated) {
    throw new Error('Eliminated/bankrupt player message MUST evaluate isEliminated=true');
  }
  if (bankruptResult.badge !== 'SPECTATOR') {
    throw new Error('Eliminated/bankrupt player message MUST have SPECTATOR micro-badge');
  }

  console.log('✓ Test 2 Passed: Chat message styling dynamically derives from authoritative player status\n');
  console.log('🎉 ALL DEFAULT DICE & CHAT STYLING TESTS PASSED SUCCESSFULLY!');
}

runDiceSkinAndChatStylingTests();
