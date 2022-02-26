import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONT_URL,
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    if (!client.handshake.headers.authorization) return client.disconnect();
    const payload = this.authService.verify(
      client.handshake.headers.authorization.split(' ')[1],
    );
    const user =
      payload.sub && (await this.userService.getUserById(payload.sub));
    if (!user) return client.disconnect();

    client.data.user = user;
    process.nextTick(() => client.emit('info', { user }));
  }

  @SubscribeMessage('send')
  async handleMessage(client: Socket, value: string) {
    this.server.emit('send', {
      user: client.data.user,
      value,
    });
  }
}
