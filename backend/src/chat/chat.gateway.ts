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
import { DMChannelService } from './services/dmChannel.service';
import { TextChannelService } from './services/textChannel.service';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';

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
    private readonly dmChannelService: DMChannelService,
  ) {}
  @WebSocketServer()
  server: any;

  async handleConnection(client: Socket): Promise<any> {
    try {
      const user = await this.authService.getUserFromSocket(client);
      if (!user) return client.disconnect();

      await this.userService.setStatus(user.id, Status.CHAT);

      const channels_user = await this.textChannelService.getChannelsForUser(
        user.id,
      );
      const dmChannel = await this.dmChannelService.getChannels(user.id);

      const channels_all = await this.textChannelService.getAllChannels();

      client.data.user = user;

      client.emit('info', { user, channels_user, channels_all, dmChannel });
    } catch {}
  }

  handleDisconnect(client: Socket): Promise<any> {
    try {
      if (!client.data.user) return;

      return this.userService.setStatus(client.data.user.id, Status.ONLINE);
    } catch {}
  }

  emitChannel(channel: any, event: string, ...args: any): void {
    try {
      if (!channel.users) return;

      const sockets: any[] = Array.from(this.server.sockets.values());
      sockets.forEach((socket) => {
        if (channel.users.find((user) => user.id == socket.data.user.id))
          socket.emit(event, ...args);
      });
    } catch {}
  }

  @SubscribeMessage('channel')
  async getChannel(client: Socket, id: number): Promise<void> {
    try {
      const channel = await this.textChannelService.getChannel(id, [
        'users',
        'logs',
        'muted',
        'banned',
      ]);
      client.emit('channel', channel);
    } catch {}
  }

  @SubscribeMessage('channelMe')
  async getChannelMe(client: Socket): Promise<void> {
    try {
      const channels = await this.textChannelService.getChannelsForUser(
        client.data.user.id,
      );

      client.emit('channelMe', channels);
    } catch {}
  }

  @SubscribeMessage('text')
  async handleMessage(client: Socket, data: any): Promise<void> {
    try {
      const user = client.data.user;
      const channel = await this.textChannelService.getChannel(data.id, [
        'users',
      ]);

      if (data.value.length >= 1 << 8)
        throw new HttpException('text is too long', HttpStatus.BAD_REQUEST);

      await this.textChannelService.addLogForChannel(
        data.id,
        data.value,
        user.id,
      );
      this.emitChannel(channel, 'text', {
        user: { id: user.id, username: user.username },
        ...data,
      });
    } catch {}
  }

  @SubscribeMessage('join')
  async joinChannel(
    client: Socket,
    partialChannel: TextChannel,
  ): Promise<void> {
    try {
      let channel = await this.textChannelService.getChannel(
        partialChannel.id,
        [],
        true,
      );
      if (!channel.public && partialChannel.password)
        this.emitChannel(
          channel,
          'passwordValide',
          bcrypt.compareSync(partialChannel.password, channel.password),
        );

      await this.textChannelService.addUserToChannel(
        partialChannel,
        client.data.user.id,
      );

      channel = await this.textChannelService.getChannel(channel.id, ['users']);
      this.emitChannel(channel, 'join', { channel, user: client.data.user });
    } catch {}
  }

  @SubscribeMessage('leave')
  async leaveChannel(client: Socket, data: any): Promise<void> {
    try {
      let user = client.data.user;
      if (data.userId) user = await this.userService.getUser(data.userId);

      const channel = await this.textChannelService.getChannel(data.channelId, [
        'users',
      ]);
      await this.textChannelService.removeUserFromChannel(
        user.id,
        data.channelId,
        client.data.user.id,
      );

      const is_delete = channel.owner.id == user.id ? true : false;
      this.emitChannel(channel, 'leave', {
        channel,
        user,
        is_delete: is_delete,
      });
    } catch {}
  }

  @SubscribeMessage('admin')
  async toggleAdmin(client: Socket, data: any): Promise<void> {
    try {
      let channel = await this.textChannelService.getChannel(data.channelId, [
        'users',
      ]);
      const owner = client.data.user;
      const admin = await this.userService.getUser(data.userId);

      await this.textChannelService.toggleAdminRole(
        owner.id,
        admin.id,
        channel.id,
      );

      channel = await this.textChannelService.getChannel(data.channelId, [
        'users',
      ]);

      this.emitChannel(channel, 'admin', {
        channel: { id: channel.id, name: channel.name, admin: channel.adminId },
        admin_user: { id: admin.id, username: admin.username },
      });
    } catch {}
  }

  @SubscribeMessage('mute')
  async toggleMute(client: Socket, data: any): Promise<void> {
    try {
      let channel = await this.textChannelService.getChannel(data.channelId, [
        'users',
        'muted',
      ]);
      const curuser = await this.userService.getUser(data.userId);
      const admin = client.data.user;

      const muted = channel.muted.find((muted) => muted.user.id == data.userId);

      if (muted)
        await this.textChannelService.unMuteUserInChannel(muted, channel);
      else
        await this.textChannelService.muteUserInChannel(
          curuser.id,
          channel.id,
          admin.id,
        );

      channel = await this.textChannelService.getChannel(data.channelId, [
        'users',
        'muted',
      ]);

      this.emitChannel(channel, 'mute', {
        channel: { id: channel.id, name: channel.name, muted: channel.muted },
        user: { id: admin.id, username: admin.username },
        muted_user: { id: curuser.id, username: curuser.username },
      });
    } catch {}
  }

  @SubscribeMessage('ban')
  async toggleBan(client: Socket, data: any): Promise<void> {
    try {
      const channel = await this.textChannelService.getChannel(data.channelId, [
        'users',
        'banned',
      ]);
      const curuser = await this.userService.getUser(data.userId);
      const admin = client.data.user;

      const banned = channel.banned.find(
        (banned) => banned.user.id == data.user.id,
      );

      if (banned)
        await this.textChannelService.unBanUserInChannel(banned, channel);
      else
        await this.textChannelService.banUserInChannel(
          curuser.id,
          channel.id,
          admin.id,
        );

      const new_channel = await this.textChannelService.getChannel(
        data.channelId,
        ['banned'],
      );

      this.emitChannel(channel, 'ban', {
        channel: {
          id: channel.id,
          name: channel.name,
          banned: new_channel.banned,
        },
        user: { id: admin.id, username: admin.username },
        banned_user: { id: curuser.id, username: curuser.username },
      });
    } catch {}
  }

  //direct message :D ----------------------------------------------------------------------

  @SubscribeMessage('channelDM')
  async getDMChannel(client: Socket, channelid: number): Promise<void> {
    try {
      const channel = await this.dmChannelService.getChannel(channelid, [
        'logs',
        'users',
      ]);
      client.emit('channelDM', channel);
    } catch {}
  }

  @SubscribeMessage('channelMeDM')
  async getDMChannelMe(client: Socket): Promise<void> {
    try {
      const channel = await this.dmChannelService.getChannels(
        client.data.user.id,
      );
      client.emit('channelMeDM', channel);
    } catch {}
  }

  @SubscribeMessage('joinDM')
  async joinDM(client: Socket, userId: number): Promise<void> {
    try {
      const channel = await this.dmChannelService.joinChannel(
        client.data.user.id,
        userId,
      );
      this.emitChannel(channel, 'joinDM');
    } catch {}
  }

  @SubscribeMessage('textDM')
  async sendMessageDM(client: Socket, data: any): Promise<void> {
    try {
      const channel = await this.dmChannelService.getChannel(data.channelId, [
        'users',
      ]);

      const other = channel.users.find(
        (user) => user.id != client.data.user.id,
      );
      if (other && other.blocked.includes(client.data.user.id))
        client.emit('blocked');

      if (data.text.length >= 1 << 8)
        throw new HttpException('text is too long', HttpStatus.BAD_REQUEST);

      const log = await this.dmChannelService.createMessage(
        channel.id,
        client.data.user.id,
        data.text,
      );
      this.emitChannel(channel, 'textDM', {
        user: log.user,
        text: log.message,
        channelId: channel.id,
      });
    } catch {}
  }
}
