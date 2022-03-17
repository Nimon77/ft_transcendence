import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Input } from './interfaces/input.interface';
import { RoomService } from './services/room.service';
import { Player } from './interfaces/player.interface';
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
    private readonly roomService: RoomService,
  ) {}
  @WebSocketServer()
  server: any;

  async handleConnection(client: Socket) {
    if (!client.handshake.headers.authorization) return client.disconnect();
    const payload = this.authService.verify(
      client.handshake.headers.authorization.split(' ')[1],
    );
    const user: User = await this.userService
      .getUserById(payload.sub)
      .catch(() => null);
    if (!user) return client.disconnect();

    client.data.user = user;
    client.emit('info', { user });
  }

  handleDisconnect(client: Socket) {
    if (!client.data.user) return;
    this.roomService.removeSocket(client);
  }

  @SubscribeMessage('queue')
  joinQueue(client: Socket) {
    if (!client.data.user) return;
    this.roomService.addQueue(client);
  }

  @SubscribeMessage('room')
  joinRoom(client: Socket, code?: string) {
    if (!client.data.user) return;

    let room: Room = this.roomService.getRoom(code);
    if (!room) room = this.roomService.createRoom(code);

    this.roomService.joinRoom(client, room);
  }

  @SubscribeMessage('ready')
  onReady(client: Socket, input: Input) {
    if (!client.data.user) return;

    const player: Player = this.roomService.getPlayer(client.data.user.id);
    if (!player) return;

    this.roomService.ready(player, input);
  }

  @SubscribeMessage('start')
  onStart(client: Socket) {
    if (!client.data.user) return;

    const player: Player = this.roomService.getPlayer(client.data.user.id);
    if (!player || !player.room) return;

    this.roomService.startCalc(player.room);
  }

  @SubscribeMessage('tray')
  updateTray(client: Socket, tray: number) {
    if (!client.data.user) return;

    const player: Player = this.roomService.getPlayer(client.data.user.id);
    if (!player) return;

    player.tray = tray * player.room.options.display.height;
    this.roomService.emit(player.room, 'tray', player.socket.data.user.id, tray);
  }
}
