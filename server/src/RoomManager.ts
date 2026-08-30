import { Server } from 'socket.io';
import { BoardThemeId, GameRules, GameState, PlayerCustomization, PresetType, RoomCode } from '../../shared/types';
import { BotEngine } from './BotEngine';
import { GameRoom } from './GameRoom';

export class RoomManager {
  private rooms: Map<RoomCode, GameRoom> = new Map();
  private io: Server;
  private botInterval: NodeJS.Timeout | null = null;

  constructor(io: Server) {
    this.io = io;
    this.startBotLoop();
  }

  private startBotLoop(): void {
    this.botInterval = setInterval(() => {
      for (const room of this.rooms.values()) {
        try {
          BotEngine.handleBotTurn(room);
        } catch (e) {}
      }
    }, 1000);
  }

  public generateRoomCode(): RoomCode {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    let attempts = 0;
    do {
      code = '';
      for (let i = 0; i < 5; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      attempts++;
    } while (this.rooms.has(code) && attempts < 100);
    return code;
  }

  public createRoom(
    hostSessionId: string,
    hostName: string,
    hostCustomization: PlayerCustomization
  ): GameRoom {
    const roomCode = this.generateRoomCode();
    const room = new GameRoom(
      roomCode,
      hostSessionId,
      hostName,
      hostCustomization,
      (state: GameState) => {
        this.io.to(roomCode).emit('gameStateUpdate', state);
      }
    );

    this.rooms.set(roomCode, room);
    return room;
  }

  public getRoom(roomCode: RoomCode): GameRoom | undefined {
    return this.rooms.get(roomCode.toUpperCase().trim());
  }

  public deleteRoom(roomCode: RoomCode): void {
    const room = this.rooms.get(roomCode);
    if (room) {
      room.cleanup();
      this.rooms.delete(roomCode);
    }
  }

  public listPublicRooms(): { code: string; playersCount: number; maxPlayers: number; phase: string; theme: string }[] {
    const list: { code: string; playersCount: number; maxPlayers: number; phase: string; theme: string }[] = [];
    for (const [code, room] of this.rooms.entries()) {
      list.push({
        code,
        playersCount: Object.keys(room.state.players).length,
        maxPlayers: room.state.rules.maxPlayers,
        phase: room.state.phase,
        theme: room.state.themeId,
      });
    }
    return list;
  }
}
