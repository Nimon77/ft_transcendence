import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';

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
  ) {}
  @WebSocketServer()
  server: any;

  async handleConnection(client: Socket): Promise<any> {
    if (!client.handshake.headers.authorization) return client.disconnect();
    const payload = this.authService.verify(
      client.handshake.headers.authorization.split(' ')[1],
    );
    const user: User = await this.userService
      .getUserById(payload.sub)
      .catch(() => null);
    if (!user) return client.disconnect();

    client.data.user = user;
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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handleStatus(user: User): void {
    this.server.emit('status', { userId: user.id, status: user.status });
  }
}
