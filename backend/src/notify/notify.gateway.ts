import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Status } from 'src/user/enums/status.enum';
import { UserService } from 'src/user/services/user.service';
import { NotifyService } from './notify.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONT_URL,
  },
  namespace: 'notify',
})
export class NotifyGateway {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly notifyService: NotifyService,
  ) {}
  @WebSocketServer()
  server: any;

  afterInit(server: Server): void {
    this.notifyService.server = server;
  }

  async handleConnection(client: Socket): Promise<any> {
    try {
      const user = await this.authService.getUserFromSocket(client);
      if (!user) return client.disconnect();

      await this.userService.setStatus(user.id, Status.ONLINE);

      client.data.user = user;
    } catch (e) {
      console.error(e);
    }
  }

  handleDisconnect(client: Socket): void {
    try {
      if (!client.data.user) return;

      const userId = client.data.user.id;

      setTimeout(async () => {
        const socket: any = Array.from(this.server.sockets.values()).find(
          (socket: Socket) => socket.data.user.id == userId,
        );
        if (socket) return;

        const user = await this.userService.getUser(userId, []);
        if (!user) return;

        if (user.status == Status.ONLINE)
          await this.userService.setStatus(user.id, Status.OFFLINE);
      }, 5 * 1000);
    } catch (e) {
      console.error(e);
    }
  }

  @SubscribeMessage('notify')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handleNotify(client: Socket, data: any): void {
    try {
      const user = client.data.user;
      if (!user) return;

      const socket: any = Array.from(this.server.sockets.values()).find(
        (socket: Socket) => socket.data.user.id == data.id,
      );
      if (!socket) client.emit('error', 'User not found');
      else {
        data.id = user.id;
        socket.emit('notify', data);
      }
    } catch (e) {
      console.error(e);
    }
  }
}
