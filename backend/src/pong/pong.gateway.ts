import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Mode, Option } from './interfaces/option.interface';
import { Room } from './interfaces/room.interface';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONT_URL,
  },
  namespace: 'pong',
})
export class PongGateway {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @WebSocketServer()
  server: any;
  queue: Array<number> = new Array();
  rooms: Map<string, Room> = new Map();
  static option: Option = {
    display: { width: 1920, height: 1080 },
    ball: { speed: 20, radius: 20 },
    tray: { width: 20, height: 200, x: 50 },
    score: { y: 15, max: 10 },
    mode: Mode.none,
  };

  async handleConnection(client: Socket) {
    if (!client.handshake.headers.authorization) return client.disconnect();
    const payload = this.authService.verify(
      client.handshake.headers.authorization.split(' ')[1],
    );
    const user: User = await this.userService
      .getUserById(payload.sub)
      .catch(() => null);
    if (!user) client.disconnect();

    const sockets: Array<Socket> = Array.from(this.server.sockets.values());
    const socket = sockets.find((socket) => socket.data.user.id == user.id);
    if (socket) client.disconnect();

    client.data.user = user;
    client.emit('info', { user });
  }

  handleDisconnect(client: Socket) {
    if (!client.data.user) return;

    const code: string = client.data.code;
    if (!code) {
      const index: number = this.queue.indexOf(client.data.user.id);
      if (index != -1) this.queue.splice(index, 1);
      return;
    }

    const room: Room = this.rooms.get(code);
    const index: number = room.player.indexOf(client.data.user.id);
    room.player.splice(index, 1);

    if (!room.player.length) this.rooms.delete(code);
  }

  @SubscribeMessage('queue')
  joinQueue(client: Socket) {
    this.queue.push(client.data.user.id);
    if (this.queue.length < 2) return;

    const sockets: Array<Socket> = Array.from(this.server.sockets.values());
    let code = null;

    while (
      (!code || this.rooms.get(code).player.length < 2) &&
      this.queue.length
    ) {
      const id = this.queue.shift();
      const socket = sockets.find((socket) => socket.data.user.id == id);
      if (!socket) continue;
      code = this.joinRoom(socket, code);
    }
  }

  @SubscribeMessage('room')
  joinRoom(client: Socket, code: string): string {
    while (!code) {
      const length = 10;
      const generated = Math.floor(
        Math.random() * Math.pow(16, length),
      ).toString(16);
      if (!this.rooms.has(generated)) code = generated;
    }

    if (!this.rooms.has(code))
      this.rooms.set(code, {
        start: false,
        option: PongGateway.option,
        ball: {
          x: PongGateway.option.display.width / 2,
          y: PongGateway.option.display.height / 2,
        },
        tray: {
          left: PongGateway.option.display.height / 2,
          right: PongGateway.option.display.height / 2,
        },
        player: new Array(),
      } as Room);

    this.rooms.get(code).player.push(client.data.user.id);
    client.data.code = code;
    client.emit('room', code);
    return code;
  }
}
