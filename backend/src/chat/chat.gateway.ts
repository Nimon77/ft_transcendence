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
import { TextChannel } from './entities/textChannel.entity';
import { TextChannelService } from './services/textChannel.service';

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
    private readonly textChannelService: TextChannelService,
  ) {}
  @WebSocketServer()
  server: any;

  async handleConnection(client: Socket): Promise<any> {
    try {
      const user = await this.authService.getUserFromSocket(client);
      if (!user) return client.disconnect();

      await this.userService.setStatus(user.id, Status.CHAT);

      const channels = await this.textChannelService.getChannelsForUser(
        user.id,
      );

      client.data.user = user;
      client.emit('info', { user, channels });
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
      const channel = await this.textChannelService.getChannel(id, [
        'users',
        'logs',
      ]);
      client.emit('channel', channel);
    } catch (e) {
      console.error(e);
    }
  }

  @SubscribeMessage('text')
  async handleMessage(client: Socket, data: any): Promise<void> {
    try {
      const user = client.data.user;
      const channel = await this.textChannelService.getChannel(data.id, [
        'users',
      ]);

      await this.textChannelService.addLogForChannel(
        data.id,
        data.value,
        user.id,
      );
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
      await this.textChannelService.addUserToChannel(
        channel,
        client.data.user.id,
      );
      channel = await this.textChannelService.getChannel(channel.id, ['users']);
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

      const channel = await this.textChannelService.getChannel(data.channelId, [
        'users',
      ]);
      await this.textChannelService.removeUserFromChannel(
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
      const channel = await this.textChannelService.getChannel(data.channelId, [
        'users',
      ]);
      const owner = client.data.user;
      const admin = await this.userService.getUser(data.userId, []);
      let is_admin = false;

      await this.textChannelService.toggleAdminRole(
        owner.id,
        admin.id,
        channel.id,
      );

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
      const channel = await this.textChannelService.getChannel(data.channelId, [
        'users',
        'muted',
      ]);
      const curuser = await this.userService.getUser(data.userId, []);
      const admin = client.data.user;
      let is_muted = false;

      const muted = channel.muted.find((muted) => muted.user.id == data.userId);

      if (muted)
        await this.textChannelService.unMuteUserInChannel(muted, channel);
      else {
        await this.textChannelService.muteUserInChannel(
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
      const channel = await this.textChannelService.getChannel(data.channelId, [
        'users',
        'banned',
      ]);
      const curuser = await this.userService.getUser(data.userId, []);
      const admin = client.data.user;
      let is_banned = false;

      const banned = channel.banned.find(
        (banned) => banned.user.id == data.user.id,
      );

      if (banned)
        await this.textChannelService.unBanUserInChannel(banned, channel);
      else {
        await this.textChannelService.banUserInChannel(
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
