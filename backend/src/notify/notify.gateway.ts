import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/entities/user.entity';
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
    if (!client.handshake.headers.authorization) return client.disconnect();
    const payload = this.authService.verify(
      client.handshake.headers.authorization.split(' ')[1],
    );
    const user: User = await this.userService
      .getUser(payload.sub, [])
      .catch(() => null);
    if (!user) return client.disconnect();

    await this.userService.setStatus(user.id, Status.ONLINE);

    client.data.user = user;
  }

  handleDisconnect(client: Socket): void {
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
  }

  @SubscribeMessage('notify')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handleNotify(client: Socket, data: any): void {
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
  }
}
