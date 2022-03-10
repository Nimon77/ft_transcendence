import {
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
  namespace: 'pong',
})
export class PongGateway {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @WebSocketServer()
  server: Server;
  rooms: Map<string, number[]> = new Map();
  //static options: Map<string, object> = new Map();

  async handleConnection(client: Socket) {
    if (!client.handshake.headers.authorization) return client.disconnect();
    const payload = this.authService.verify(
      client.handshake.headers.authorization.split(' ')[1],
    );
    const user = await this.userService
      .getUserById(payload.sub)
      .catch(() => {});
    !user && client.disconnect();

    client.data.user = user;
    process.nextTick(async () => client.emit('info', { user }));
  }

  handleDisconnect(client: Socket) {
    const code = client.data.code;
    if (!code) return;

    const index = this.rooms.get(code).indexOf(client.data.user.id);
    this.rooms.get(code).splice(index, 1);

    if (!this.rooms.get(code).length) this.rooms.delete(code);
  }

  @SubscribeMessage('room')
  joinRoom(client: Socket, code: string) {
    if (!code) {
      const length = 5;
      code = Math.floor(Math.random() * Math.pow(16, length)).toString(16);
    }

    if (!this.rooms.has(code)) this.rooms.set(code, []);
    this.rooms.get(code).push(client.data.user.id);
    client.data.code = code;
    client.emit('room', code);
  }
}
