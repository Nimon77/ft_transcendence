import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Input } from './interfaces/input.interface';
import { RoomService } from './services/room.service';
import { Player } from './interfaces/player.interface';
import { Room } from './interfaces/room.interface';
import { UserService } from 'src/user/services/user.service';
import { Status } from 'src/user/enums/status.enum';

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

  async handleConnection(client: Socket): Promise<any> {
    try {
      const user = await this.authService.getUserFromSocket(client);
      if (!user) return client.disconnect();

      await this.userService.setStatus(user.id, Status.GAME);

      client.data.user = user;
      client.emit('info', { user });
    } catch (e) {
      console.error(e);
    }
  }

  async handleDisconnect(client: Socket): Promise<any> {
    try {
      if (!client.data.user) return;

      await this.roomService.removeSocket(client);
      await this.userService.setStatus(client.data.user.id, Status.ONLINE);
    } catch (e) {
      console.error(e);
    }
  }

  @SubscribeMessage('queue')
  joinQueue(client: Socket): void {
    try {
      if (!client.data.user) return;
      this.roomService.addQueue(client);
    } catch (e) {
      console.error(e);
    }
  }

  @SubscribeMessage('room')
  joinRoom(client: Socket, code?: string): void {
    try {
      if (!client.data.user) return;

      let room: Room = this.roomService.getRoom(code);
      if (!room) room = this.roomService.createRoom(code);

      this.roomService.joinRoom(client, room);
    } catch (e) {
      console.error(e);
    }
  }

  @SubscribeMessage('ready')
  onReady(client: Socket, input: Input): void {
    try {
      if (!client.data.user) return;

      const player: Player = this.roomService.getPlayer(client.data.user.id);
      if (!player) return;

      this.roomService.ready(player, input);
    } catch (e) {
      console.error(e);
    }
  }

  @SubscribeMessage('start')
  onStart(client: Socket): void {
    try {
      if (!client.data.user) return;

      const player: Player = this.roomService.getPlayer(client.data.user.id);
      if (!player || !player.room) return;

      this.roomService.startCalc(player.room);
    } catch (e) {
      console.error(e);
    }
  }

  @SubscribeMessage('tray')
  updateTray(client: Socket, tray: number): void {
    try {
      if (!client.data.user) return;

      const player: Player = this.roomService.getPlayer(client.data.user.id);
      if (!player) return;

      player.tray = tray * player.room.options.display.height;
      RoomService.emit(player.room, 'tray', player.socket.data.user.id, tray);
    } catch (e) {
      console.error(e);
    }
  }
}
