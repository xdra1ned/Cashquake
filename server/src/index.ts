import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { RoomManager } from './RoomManager';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  pingTimeout: 30000,
  pingInterval: 10000,
});

const roomManager = new RoomManager(io);
const dailyClaimsBySession = new Map<string, string>(); // sessionId -> YYYY-MM-DD

// Health check and lobby discovery endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'Cashquake Server', time: Date.now() });
});

app.get('/api/rooms', (req, res) => {
  res.json({ rooms: roomManager.listPublicRooms() });
});

// Socket.IO event handling
io.on('connection', (socket) => {
  let currentRoomCode: string | null = null;
  let currentPlayerId: string | null = null;

  socket.on('claimDailyCoins', (data, callback) => {
    try {
      const { sessionId } = data || {};
      if (!sessionId) {
        return callback?.({ success: false, error: 'Valid session ID required' });
      }
      const today = new Date().toISOString().slice(0, 10);
      const lastClaim = dailyClaimsBySession.get(sessionId);
      if (lastClaim === today) {
        return callback?.({
          success: false,
          error: 'Daily 200 free coins have already been claimed today. Please come back tomorrow!',
        });
      }
      dailyClaimsBySession.set(sessionId, today);
      callback?.({ success: true, coinsAwarded: 200, claimDate: today });
    } catch (err: any) {
      callback?.({ success: false, error: err.message });
    }
  });

  socket.on('createRoom', (data, callback) => {
    try {
      const { sessionId, playerName, customization } = data;
      const room = roomManager.createRoom(sessionId, playerName, customization);
      currentRoomCode = room.state.roomCode;
      currentPlayerId = room.state.hostId;

      socket.join(currentRoomCode);
      room.playerSockets.set(currentPlayerId, socket.id);

      callback({
        success: true,
        roomCode: room.state.roomCode,
        playerId: currentPlayerId,
        state: room.state,
      });
    } catch (err: any) {
      callback({ success: false, error: err.message });
    }
  });

  socket.on('joinRoom', (data, callback) => {
    try {
      const { roomCode, sessionId, playerName, customization, isSpectator } = data;
      const room = roomManager.getRoom(roomCode);
      if (!room) {
        return callback({ success: false, error: 'Room not found. Check your code.' });
      }

      const playerId = room.joinPlayer(sessionId, socket.id, playerName, customization, isSpectator);
      currentRoomCode = room.state.roomCode;
      currentPlayerId = playerId;

      socket.join(currentRoomCode);
      callback({
        success: true,
        roomCode: room.state.roomCode,
        playerId,
        state: room.state,
      });
    } catch (err: any) {
      callback({ success: false, error: err.message });
    }
  });

  socket.on('addBot', () => {
    if (!currentRoomCode) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) room.addBot();
  });

  socket.on('updateRules', (data) => {
    if (!currentRoomCode) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) room.updateRules(data.preset, data.customRules);
  });

  socket.on('updateTheme', (data) => {
    if (!currentRoomCode) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) room.updateTheme(data.themeId);
  });

  socket.on('updateCustomization', (data) => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room && data?.customization) {
      room.updatePlayerCustomization(currentPlayerId, data.customization);
    }
  });

  socket.on('startGame', (data, callback) => {
    if (!currentRoomCode) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      try {
        room.startGame();
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    }
  });

  socket.on('rollDice', (data, callback) => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      try {
        const roll = room.rollDice(currentPlayerId);
        if (callback) callback({ success: true, roll });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    }
  });

  socket.on('buyProperty', (data, callback) => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      try {
        room.buyProperty(currentPlayerId);
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    }
  });

  socket.on('passProperty', () => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) room.passProperty(currentPlayerId);
  });

  socket.on('pawnLanded', () => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      room.resolvePawnLanding(currentPlayerId);
    }
  });

  socket.on('placeBid', (data, callback) => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      try {
        room.placeBid(currentPlayerId, data.bidAmount);
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    }
  });

  socket.on('passAuction', () => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) room.passAuction(currentPlayerId);
  });

  socket.on('buildHouse', (data, callback) => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      try {
        room.buildHouse(currentPlayerId, data.tileId);
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    }
  });

  socket.on('sellHouse', (data, callback) => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      try {
        room.sellHouse(currentPlayerId, data.tileId);
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    }
  });

  socket.on('mortgageProperty', (data, callback) => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      try {
        room.mortgageProperty(currentPlayerId, data.tileId);
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    }
  });

  socket.on('unmortgageProperty', (data, callback) => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      try {
        room.unmortgageProperty(currentPlayerId, data.tileId);
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    }
  });

  socket.on('sellProperty', (data, callback) => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      try {
        room.sellProperty(currentPlayerId, data.tileId);
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    }
  });

  socket.on('proposeTrade', (data, callback) => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      try {
        room.proposeTrade({ ...data, fromPlayerId: currentPlayerId });
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    }
  });

  socket.on('respondTrade', (data) => {
    if (!currentRoomCode) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) room.respondTrade(data.tradeId, data.action);
  });

  socket.on('payBail', (data, callback) => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      try {
        room.payBail(currentPlayerId);
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    }
  });

  // --- Casino Minigames Socket Handlers ---
  socket.on('spinCasinoEvent', () => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) room.spinCasinoEvent(currentPlayerId);
  });

  socket.on('resolveCasinoEvent', () => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) room.resolveCasinoEvent(currentPlayerId);
  });

  // --- Alliance Socket Handlers ---
  socket.on('sendAllianceRequest', (data, callback) => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      try {
        room.sendAllianceRequest(currentPlayerId, data.toPlayerId);
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    }
  });

  socket.on('respondAllianceRequest', (data, callback) => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      try {
        room.respondAllianceRequest(currentPlayerId, data.requestId, data.response);
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    }
  });

  socket.on('proposeAllianceAgreement', (data, callback) => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      try {
        room.proposeAllianceAgreement(currentPlayerId, data.beneficiaryPlayerId, data.exemptions);
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    }
  });

  socket.on('respondAllianceAgreement', (data, callback) => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      try {
        room.respondAllianceAgreement(currentPlayerId, data.agreementId, data.response);
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    }
  });

  socket.on('breakAlliance', (data, callback) => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      try {
        room.breakAlliance(currentPlayerId, data.targetPlayerId);
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    }
  });

  socket.on('usePrisonCard', (data, callback) => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      try {
        room.usePrisonCard(currentPlayerId);
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    }
  });

  socket.on('endTurn', (data, callback) => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      try {
        room.endTurn(currentPlayerId);
        if (callback) callback({ success: true });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    }
  });

  socket.on('declareBankruptcy', () => {
    if (!currentRoomCode || !currentPlayerId) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) room.declareBankruptcy(currentPlayerId, null);
  });

  socket.on('sendChatMessage', (data) => {
    if (!currentRoomCode || !currentPlayerId || !data?.message) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) room.sendChatMessage(currentPlayerId, data.message);
  });

  socket.on('sendEmote', (data) => {
    if (!currentRoomCode || !currentPlayerId || !data?.emote) return;
    const room = roomManager.getRoom(currentRoomCode);
    if (room) {
      room.sendChatMessage(currentPlayerId, data.emote);
    }
  });

  socket.on('disconnect', () => {
    if (currentRoomCode && currentPlayerId) {
      const room = roomManager.getRoom(currentRoomCode);
      if (room) {
        room.removePlayer(currentPlayerId);
      }
    }
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🌋 Cashquake Server running on port ${PORT}`);
});
