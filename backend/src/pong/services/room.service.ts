import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Socket } from 'socket.io';
import { Input, Mode, Plan } from '../interfaces/input.interface';
import { Option } from '../interfaces/option.interface';
import { Player } from '../interfaces/player.interface';
import { Room } from '../interfaces/room.interface';
import { PongService } from './pong.service';

@Injectable()
export class RoomService {
  constructor(private readonly pong: PongService) {}
  static option: Option = {
    display: { width: 1920, height: 1080 },
    ball: { speed: 20, radius: 20 },
    tray: { width: 20, height: 200, x: 50 },
    score: { y: 15, max: 10 },
    input: { plan: Plan.default, mode: Mode.none },
  };

  queue: Array<Socket> = new Array();
  rooms: Map<string, Room> = new Map();

  removeSocket(socket: Socket) {
    if (this.queue.indexOf(socket) != -1)
      return this.queue.splice(this.queue.indexOf(socket), 1);

    for (const room of this.rooms.values()) {
      if (room.spectator && room.spectator.indexOf(socket) != -1)
        return room.spectator.splice(room.spectator.indexOf(socket), 1);

      for (const player of room.player)
        if (player.socket.id == socket.id) {
          room.player.splice(room.player.indexOf(player), 1);
        }
      if (!room.player.length) return this.rooms.delete(room.code);
    }
  }

  addQueue(socket: Socket) {
    if (this.queue.indexOf(socket) != -1) return;
    if (this.getPlayer(socket.data.user.id)) return;

    this.queue.push(socket);
    if (this.queue.length < 2) return;

    const room: Room = this.createRoom();
    while (this.queue.length && room.player.length < 2)
      this.createPlayer(this.queue.shift(), room);
  }

  createPlayer(socket: Socket, room: Room) {
    const player: Player = {
      socket,
      room,
      input: null,
      tray: RoomService.option.display.height / 2,
      score: 0,
    };
    room.player.push(player);
    socket.emit('room', room.code);
  }

  getPlayer(userId: number): Player {
    for (const room of this.rooms.values())
      for (const player of room.player)
        if (player.socket.data.user.id == userId) return player;
    return null;
  }

  createRoom(): Room {
    let code: string = null;
    while (!code) {
      const length = 10;
      const generated = Math.floor(
        Math.random() * Math.pow(16, length),
      ).toString(16);
      if (!this.rooms.has(generated)) code = generated;
    }

    const room: Room = {
      code,
      player: new Array(),
      inGame: false,
      option: RoomService.option,
      ball: { x: 0, y: 0, velocity: {x: 0, y: 0}},
    };
    this.rooms.set(code, room);
    return room;
  }

  ready(player: Player, input: Input) {
    player.input = input;
    this.startGame(player.room);
  }

  startGame(room: Room) {
    for (const player of room.player) if (!player.input) return;

    room.option.input.plan = room.player[Math.round(Math.random())].input.plan;
    room.option.input.mode = room.player[Math.round(Math.random())].input.mode;

    room.inGame = true;
  }

  @Interval(1000 / 60)
  loop() {
    for (const room of this.rooms.values())
      if (room.inGame) {
        this.pong.update(room);
      }
  }

  stopGame(room: Room) {
    room.inGame = false;
  }
}
