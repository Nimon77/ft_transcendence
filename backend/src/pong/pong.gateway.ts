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
import { PongService } from './pong.service';

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
    private readonly pongService: PongService,
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
    if (!user) client.disconnect();

    client.data.user = user;
    client.emit('info', { user });
  }

  handleDisconnect(client: Socket) {
    if (!client.data.user) return;
    this.pongService.removeSocket(client);
  }

  @SubscribeMessage('queue')
  joinQueue(client: Socket) {
    this.pongService.addQueue(client);
  }

  @SubscribeMessage('room')
  joinRoom(client: Socket, code: string) {}

  @SubscribeMessage('ready')
  onReady(client: Socket, input: Input) {}
}
