/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Status } from 'src/user/enums/status.enum';
import { UserService } from 'src/user/services/user.service';
import { ChatService } from './chat.service';
import { TextChannel } from './entity/textChannel.entity';

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
    try {
      const user = await this.authService.getUserFromSocket(client);
      if (!user) return client.disconnect();

      await this.userService.setStatus(user.id, Status.CHAT);

      client.data.user = user;
      client.emit('info', {
        user,
        channels: await this.chatService.getChannelsForUser(user.id),
      });
    } catch (e) {
      console.error(e);
    }
  }

  handleDisconnect(client: Socket): Promise<any> {
    try {
      if (!client.data.user) return;

      return this.userService.setStatus(client.data.user.id, Status.ONLINE);
    } catch (e) {
      console.error(e);
    }
  }

  emitChannel(channel: TextChannel, event: string, ...args: any): void {
    try {
      if (!channel.users) return;

      const sockets: any[] = Array.from(this.server.sockets.values());
      sockets.forEach((socket) => {
        if (channel.users.find((user) => user.id == socket.data.user.id))
          socket.emit(event, ...args);
      });
    } catch (e) {
      console.error(e);
    }
  }

  @SubscribeMessage('channel')
  async getChannel(client: Socket, id: number): Promise<void> {
    try {
      const channel = await this.chatService.getChannel(id, ['users', 'logs']);
      client.emit('channel', channel);
    } catch (e) {
      console.error(e);
    }
  }

  @SubscribeMessage('text')
  async handleMessage(client: Socket, data: any): Promise<void> {
    try {
      const user = client.data.user;
      const channel = await this.chatService.getChannel(data.id, ['users']);

      await this.chatService.addLogForChannel(data.id, data.value, user.id);
      this.emitChannel(channel, 'text', {
        user: { id: user.id, username: user.username },
        ...data,
      });
    } catch (e) {
      console.error(e);
    }
  }

  @SubscribeMessage('join')
  async joinChannel(client: Socket, channel: TextChannel): Promise<void> {
    try {
      await this.chatService.addUserToChannel(channel, client.data.user.id);
      channel = await this.chatService.getChannel(channel.id, ['users']);
      this.emitChannel(channel, 'join', { channel, user: client.data.user });
    } catch (e) {
      console.error(e);
    }
  }

  @SubscribeMessage('leave')
  async leaveChannel(client: Socket, data: any): Promise<void> {
    try {
      let user = client.data.user;
      if (data.userId) user = await this.userService.getUser(data.userId, []);

      const channel = await this.chatService.getChannel(data.channelId, [
        'users',
      ]);
      await this.chatService.removeUserFromChannel(
        user.id,
        data.channelId,
        client.data.user.id,
      );
      this.emitChannel(channel, 'leave', { channel, user: client.data.user });
    } catch (e) {
      console.error(e);
    }
  }

  @SubscribeMessage('admin')
  async toggleAdmin(client: Socket, data: any): Promise<void> {
    try {
      const channel = await this.chatService.getChannel(data.channelId, [
        'users',
      ]);
      const owner = client.data.user;
      const admin = await this.userService.getUser(data.userId, []);
      let is_admin = false;

      await this.chatService.toggleAdminRole(owner.id, admin.id, channel.id);

      if (channel.adminId.indexOf(admin.id) != -1) is_admin = true;
      this.emitChannel(channel, 'admin', {
        user: { id: admin.id, username: admin.username },
        is_admin: is_admin,
      });
    } catch (e) {
      console.error(e);
    }
  }

  @SubscribeMessage('mute')
  async toggleMute(client: Socket, data: any): Promise<void> {
    try {
      const channel = await this.chatService.getChannel(data.channelId, [
        'users',
        'muted',
      ]);
      const curuser = await this.userService.getUser(data.userId, []);
      const admin = client.data.user;
      let is_muted = false;

      const muted = channel.muted.find((muted) => muted.user.id == data.userId);

      if (muted) await this.chatService.unMuteUserInChannel(muted, channel);
      else {
        await this.chatService.muteUserInChannel(
          curuser.id,
          channel.id,
          admin.id,
        );
        is_muted = true;
      }
      this.emitChannel(channel, 'mute', {
        user: { id: admin.id, username: admin.username },
        muted_user: { id: curuser.id, username: curuser.username },
        is_muted: is_muted,
      });
    } catch (e) {
      console.error(e);
    }
  }

  @SubscribeMessage('ban')
  async toggleBan(client: Socket, data: any): Promise<void> {
    try {
      const channel = await this.chatService.getChannel(data.channelId, [
        'users',
        'banned',
      ]);
      const curuser = await this.userService.getUser(data.userId, []);
      const admin = client.data.user;
      let is_banned = false;

      const banned = channel.banned.find(
        (banned) => banned.user.id == data.user.id,
      );

      if (banned) await this.chatService.unBanUserInChannel(banned, channel);
      else {
        await this.chatService.banUserInChannel(
          curuser.id,
          channel.id,
          admin.id,
        );
        is_banned = true;
      }
      this.emitChannel(channel, 'ban', {
        user: { id: admin.id, username: admin.username },
        banned_user: { id: curuser.id, username: curuser.username },
        is_banned: is_banned,
      });
    } catch (e) {
      console.error(e);
    }
  }
}
