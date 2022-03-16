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
    if (!user) return client.disconnect();

    client.data.user = user;
    client.emit('info', {
      user,
      channels: await this.chatService.getRoomsForUser(user.id),
    });
  }

  emitRoom(room: ChatRoom, event: string, ...args) {
    if (!room.users) return;

    const sockets: any[] = Array.from(this.server.sockets.values());
    sockets.forEach((socket) => {
      if (room.users.find((user) => user.id == socket.data.user.id))
        socket.emit(event, ...args);
    });
  }

  @SubscribeMessage('channel')
  async getChannel(client: Socket, id: number) {
    const channel = await this.chatService.getRoom(id, ['users', 'logs']);
    client.emit('channel', channel);
  }

  @SubscribeMessage('text')
  async handleMessage(client: Socket, data: any) {
    try {
      const room = await this.chatService.getRoom(data.id, ['users']);

      const user = client.data.user;

      await this.chatService.addLogForRoom(data.id, data.value, user);
      this.emitRoom(room, 'text', {
        user: { id: user.id, username: user.username },
        ...data,
      });
    } catch {
      return;
    }
  }

  @SubscribeMessage('join')
  async joinChannel(client: Socket, id: number) {
    try {
      const room = await this.chatService.getRoom(id, ['users']);

      if (room.users.indexOf(client.data.user) != -1) return;

      await this.chatService.addUserToRoom(room, client.data.user);
      room.users.push(client.data.user);

      this.emitRoom(room, 'join', { room, user: client.data.user });
    } catch {
      return;
    }
  }

  @SubscribeMessage('leave')
  async leaveChannel(client: Socket, data: any) {
    try {
      await this.chatService.removeUserFromRoom(
        client.data.user,
        data.roomId,
        data.adminId,
      );

      const room = await this.chatService.getRoom(data.roomId, ['users']);
      this.emitRoom(room, 'join', { room, user: client.data.user });
    } catch {
      return;
    }
  }

  @SubscribeMessage('admin')
  async toggleAdmin(client: Socket, roomId: number, userId: number) {
    const room = await this.chatService.getRoom(roomId, []);
  }

  @SubscribeMessage('mute')
  async toggleMute(client: Socket, roomId: number, userId: number) {
    const room = await this.chatService.getRoom(roomId, []);
  }

  @SubscribeMessage('ban')
  async toggleBan(client: Socket, roomId: number, userId: number) {
    const room = await this.chatService.getRoom(roomId, []);
  }
}
