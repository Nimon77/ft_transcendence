import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import { ChatRoom } from './entity/chat.entity';

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
    private readonly chatService: ChatService,
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
    client.emit('info', {
      user,
      channels: await this.chatService.getRoomsForUser(user.id),
    });
  }

  @SubscribeMessage('channel')
  async joinChannel(client: Socket, id: number) {
    const channel = await this.chatService.getRoom(id, [
      'users',
      'muted',
      'banned',
      'logs',
    ]);
    client.emit('channel', channel);
  }

  @SubscribeMessage('text')
  async handleMessage(client: Socket, data: any) {
    const sockets: any[] = Array.from(this.server.sockets.values());
    const room = await this.chatService.getRoom(data.id, ['users']);

    const user = client.data.user;

    sockets.forEach((socket) => {
      if (room.users.find((user) => user.id == socket.data.user.id))
        socket.emit('text', {
          user: { id: user.id, username: user.username },
          ...data,
        });
    });
  }
}
