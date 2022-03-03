import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';

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
    process.nextTick(async () =>
      client.emit('info', {
        user,
        channels: await this.chatService.getRoomsForUser(user.id, 
        ),
      }),
    );
  }

  @SubscribeMessage('channel')
  async joinChannel(client: Socket, id: number) {
    const channels = await this.chatService.getUsersForRoom(id);
    client.emit('channel', channels[0]);
  }

  @SubscribeMessage('text')
  async handleMessage(client: Socket, data: object) {
    const user = client.data.user;

    this.server.emit('text', {
      user: { id: user.id, username: user.username },
      ...data,
    });
  }
}
