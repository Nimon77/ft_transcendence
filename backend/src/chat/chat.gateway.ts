/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/entities/user.entity';
import { Status } from 'src/user/enums/status.enum';
import { UserService } from 'src/user/services/user.service';
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

  async handleConnection(client: Socket): Promise<any> {
    if (!client.handshake.headers.authorization) return client.disconnect();
    const payload = this.authService.verify(
      client.handshake.headers.authorization.split(' ')[1],
    );
    const user: User = await this.userService
      .getUser(payload.sub, [])
      .catch(() => null);
    if (!user) return client.disconnect();

    await this.userService.setStatus(user.id, Status.CHAT);

    client.data.user = user;
    client.emit('info', {
      user,
      channels: await this.chatService.getRoomsForUser(user.id),
    });
  }

  handleDisconnect(client: Socket): Promise<any> {
    if (!client.data.user) return;

    return this.userService.setStatus(client.data.user.id, Status.ONLINE);
  }

  emitRoom(room: ChatRoom, event: string, ...args: any): void {
    if (!room.users) return;

    const sockets: any[] = Array.from(this.server.sockets.values());
    sockets.forEach((socket) => {
      if (room.users.find((user) => user.id == socket.data.user.id))
        socket.emit(event, ...args);
    });
  }

  @SubscribeMessage('channel')
  async getChannel(client: Socket, id: number): Promise<void> {
    const channel = await this.chatService.getRoom(id, ['users', 'logs']);
    client.emit('channel', channel);
  }

  @SubscribeMessage('text')
  async handleMessage(client: Socket, data: any): Promise<void> {
    try {
      const room = await this.chatService.getRoom(data.id, ['users']);

      const user = client.data.user;

      await this.chatService.addLogForRoom(data.id, data.value, user);
      this.emitRoom(room, 'text', {
        user: { id: user.id, username: user.username },
        ...data,
      });
    } catch {}
  }

  @SubscribeMessage('join')
  async joinChannel(client: Socket, room: ChatRoom): Promise<void> {
    try {
      await this.chatService.addUserToRoom(room, client.data.user.id);
      room = await this.chatService.getRoom(room.id, ['users']);
      this.emitRoom(room, 'join', { room, user: client.data.user });
    } catch {}
  }

  @SubscribeMessage('leave')
  async leaveChannel(client: Socket, data: any): Promise<void> {
    try {
      let user = client.data.user;
      if (data.userId) user = await this.userService.getUser(data.userId, []);

      const room = await this.chatService.getRoom(data.roomId, ['users']);

      await this.chatService.removeUserFromRoom(
        user,
        data.roomId,
        client.data.user.id,
      );

      this.emitRoom(room, 'leave', { room, user: client.data.user });
    } catch {}
  }

  @SubscribeMessage('admin')
  async toggleAdmin(client: Socket, data: any): Promise<void> {
    try {
      const room = await this.chatService.getRoom(data.roomId, ['users']);
      const owner = client.data.user;
      const admin = await this.userService.getUser(data.userId, []);
      let is_admin = false;

      await this.chatService.toggleAdminRole(owner, admin.id, room.id);

      if (room.adminId.indexOf(admin.id) != -1) is_admin = true;
      this.emitRoom(room, 'admin', {
        user: { id: admin.id, username: admin.username },
        is_admin: is_admin,
      });
    } catch {}
  }

  @SubscribeMessage('mute')
  async toggleMute(client: Socket, data: any): Promise<void> {
    try {
      const room = await this.chatService.getRoom(data.roomId, [
        'users',
        'muted',
      ]);
      const curuser = await this.userService.getUser(data.userId, []);
      const admin = client.data.user;
      let is_muted = false;

      const muted = room.muted.find((muted) => muted.user.id == data.userId);

      if (muted) await this.chatService.unMuteUserInRoom(muted, room);
      else {
        await this.chatService.muteUserInRoom(curuser.id, room.id, admin);
        is_muted = true;
      }
      this.emitRoom(room, 'mute', {
        user: { id: admin.id, username: admin.username },
        muted_user: { id: curuser.id, username: curuser.username },
        is_muted: is_muted,
      });
    } catch {}
  }

  @SubscribeMessage('ban')
  async toggleBan(client: Socket, data: any): Promise<void> {
    try {
      const room = await this.chatService.getRoom(data.roomId, [
        'users',
        'banned',
      ]);
      const curuser = await this.userService.getUser(data.userId, []);
      const admin = client.data.user;
      let is_banned = false;

      const banned = room.banned.find(
        (banned) => banned.user.id == data.user.id,
      );

      if (banned) await this.chatService.unBanUserInRoom(banned, room);
      else {
        await this.chatService.banUserInRoom(curuser.id, room.id, admin);
        is_banned = true;
      }
      this.emitRoom(room, 'ban', {
        user: { id: admin.id, username: admin.username },
        banned_user: { id: curuser.id, username: curuser.username },
        is_banned: is_banned,
      });
    } catch {}
  }
}
