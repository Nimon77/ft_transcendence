import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Socket } from 'socket.io';
import { Match } from 'src/user/entities/match.entity';
import { UserService } from 'src/user/services/user.service';
import { Input, Mode, Plan } from '../interfaces/input.interface';
import { Option } from '../interfaces/option.interface';
import { Player } from '../interfaces/player.interface';
import { Room, State } from '../interfaces/room.interface';
import { PongService } from './pong.service';

@Injectable()
export class RoomService {
  constructor(
    private readonly pong: PongService,
    private readonly userService: UserService,
  ) {}
  static options: Option = {
    display: { width: 1920, height: 1080 },
    ball: { speed: 20, radius: 20 },
    tray: { width: 20, height: 200, x: 50 },
    score: { y: 15, max: 10 },
    input: { plan: Plan.DEFAULT, mode: Mode.NONE },
  };

  queue: Array<Socket> = [];
  rooms: Map<string, Room> = new Map();

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static emit(room: Room, event: string, ...args: any): void {
    for (const player of room.players) player.socket.emit(event, ...args);
    if (room.spectators)
      for (const spectator of room.spectators) spectator.emit(event, ...args);
  }

  async removeSocket(socket: Socket): Promise<any> {
    if (this.queue.indexOf(socket) != -1)
      return this.queue.splice(this.queue.indexOf(socket), 1);

    for (const room of this.rooms.values()) {
      if (room.spectators && room.spectators.indexOf(socket) != -1)
        return room.spectators.splice(room.spectators.indexOf(socket), 1);

      for (const player of room.players)
        if (player.socket.id == socket.id) {
          if (
            room.state == State.INGAME ||
            room.state == State.STARTING ||
            room.state == State.COUNTDOWN
          )
            await this.stopGame(room, room.players[0]);
          room.players.splice(room.players.indexOf(player), 1);
          break;
        }
      if (!room.players.length) return this.rooms.delete(room.code);
    }
  }

  addQueue(socket: Socket): void {
    for (const socket1 of this.queue)
      if (socket1.data.user.id == socket.data.user.id) return;
    if (this.getPlayer(socket.data.user.id)) return;

    this.queue.push(socket);
    if (this.queue.length < 2) return;

    const room: Room = this.createRoom();
    while (this.queue.length && room.players.length < 2)
      this.joinRoom(this.queue.shift(), room);
  }

  createRoom(code: string = null): Room {
    while (!code) {
      const length = 10;
      const generated = Math.floor(
        Math.random() * Math.pow(16, length),
      ).toString(16);
      if (!this.rooms.has(generated)) code = generated;
    }

    const room: Room = {
      code,
      state: State.WAITING,
      players: [],
      options: RoomService.options,
      ball: { position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } },
      speed: 0,
    };
    this.rooms.set(code, room);
    return room;
  }

  joinRoom(socket: Socket, room: Room): void {
    if (room.state == State.WAITING) {
      const player: Player = {
        socket,
        user: socket.data.user,
        room,
        input: null,
        tray: RoomService.options.display.height / 2,
        score: 0,
      };
      room.players.push(player);
      if (room.players.length == 2) room.state = State.STARTING;
    } else {
      if (!room.spectators) room.spectators = [];
      room.spectators.push(socket);

      socket.emit(
        'ready',
        room.options,
        room.players.map((player) => player.user),
      );
    }
    socket.emit('room', room.code);
  }

  getPlayer(userId: number): Player {
    for (const room of this.rooms.values())
      for (const player of room.players)
        if (player.user.id == userId) return player;
    return null;
  }

  getRoom(code: string): Room {
    return this.rooms.get(code);
  }

  ready(player: Player, input: Input): void {
    player.input = input;
    this.startGame(player.room);
  }

  startGame(room: Room): void {
    if (room.state != State.STARTING) return;
    for (const player of room.players) if (!player.input) return;

    room.options.input.plan =
      room.players[Math.round(Math.random())].input.plan;
    room.options.input.mode =
      room.players[Math.round(Math.random())].input.mode;

    if (room.options.input.mode == Mode.SPEED) {
      room.options.ball.radius = 25;
      room.options.ball.speed = 30;
    } else if (room.options.input.mode == Mode.SMALL)
      room.options.tray.height = 100;

    RoomService.emit(
      room,
      'ready',
      room.options,
      room.players.map((player) => player.user),
    );

    room.state = State.COUNTDOWN;
  }

  startCalc(room: Room): void {
    if (room.state != State.COUNTDOWN) return;

    this.pong.resetBall(room);
    room.state = State.INGAME;
  }

  @Interval(1000 / 60)
  loop(): void {
    for (const room of this.rooms.values())
      if (room.state == State.INGAME) this.pong.update(room);
  }

  async stopGame(room: Room, player: Player): Promise<void> {
    if (room.state == State.END) return;
    room.state = State.END;
    RoomService.emit(room, 'stop', player.user);

    const loser = room.players.find(
      (player1) => player1.user.id != player.user.id,
    ).user;
    const winner = player.user;

    await this.userService.updateRank(winner, loser);
    return await this.userService.createMatchHistory({
      score: room.players.map((player) => player.score),
      winner,
      loser,
    } as Match);
  }

  getRoomForUser(userId: number): Room {
    const rooms = Array.from(this.rooms.values());
    const room = rooms.find(
      (room) => !!room.players.find((player) => player.user.id == userId),
    );
    if (!room) throw new HttpException('Room not found', HttpStatus.NOT_FOUND);

    return room;
  }
}
