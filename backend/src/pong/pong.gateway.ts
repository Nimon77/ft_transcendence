import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/user.entity';
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
  server: any;
  queue: Array<number> = new Array();
  rooms: Map<string, Array<number>> = new Map();
  //static options: Map<string, object> = new Map();

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

    this.queue.push(user.id);
    if (this.queue.length < 2) return;

    const sockets: Array<Socket> = Array.from(this.server.sockets.values());
    let code = null;
    for (let index = 0; index < 2; index++) {
      const id = this.queue.shift();
      const socket = sockets.find((socket) => socket.data.user.id == id);
      if (!socket) continue;

      code = this.joinRoom(socket, code);
    }
    console.log(this.queue);
  }

  handleDisconnect(client: Socket) {
    const code = client.data.code;
    if (!code) {
      const index = this.queue.indexOf(client.data.user.id);
      if (index != -1) this.queue.splice(index, 1);
      return;
    }

    const index = this.rooms.get(code).indexOf(client.data.user.id);
    this.rooms.get(code).splice(index, 1);

    if (!this.rooms.get(code).length) this.rooms.delete(code);
  }

  @SubscribeMessage('room')
  joinRoom(client: Socket, code: string): string {
    if (!code) {
      const length = 5;
      code = Math.floor(Math.random() * Math.pow(16, length)).toString(16);
    }

    if (!this.rooms.has(code)) this.rooms.set(code, []);
    this.rooms.get(code).push(client.data.user.id);
    client.data.code = code;
    client.emit('room', code);
    return code;
  }
}
