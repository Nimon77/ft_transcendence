import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ChatRoom } from './entity/chat.entity';
import { MutedUser } from './entity/mute.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { PasswordI } from './interfaces/password.interface';
import { BannedUser } from './entity/banned.entity';
import { Log } from './entity/log.entity';
import * as bcrypt from 'bcrypt';

const temporary = 30 * 60 * 1000;

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRepo: Repository<ChatRoom>,
    @InjectRepository(MutedUser)
    private readonly mutedRepo: Repository<MutedUser>,
    @InjectRepository(BannedUser)
    private readonly bannedRepo: Repository<BannedUser>,
    @InjectRepository(Log)
    private readonly logRepo: Repository<Log>,
  ) {}

  async getRoom(roomId: number, relations: string[]): Promise<ChatRoom> {
    const room = await this.chatRepo.findOne(roomId, { relations });
    if (!room) throw new HttpException('Room not found', HttpStatus.NOT_FOUND);

    delete room.password;
    return room;
  }

  async createRoom(room: ChatRoom, admin: User): Promise<ChatRoom> {
    if (room.name == undefined)
      throw new HttpException(
        'Room name needs to be specified',
        HttpStatus.BAD_REQUEST,
      );

    let hashedPassword = null;
    if (room.public == false) {
      if (!room.password)
        throw new HttpException('Password Required', HttpStatus.BAD_REQUEST);

      try {
        hashedPassword = await bcrypt.hash(String(room.password), 10);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    const currentRoom = this.chatRepo.create({
      name: room.name,
      adminId: [admin.id],
      public: room.public !== false,
      ownerId: admin.id,
      users: [admin],
      muted: [],
      password: hashedPassword,
    });

    try {
      await this.chatRepo.save(currentRoom);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    delete currentRoom.password;
    return currentRoom;
  }

  async deleteRoom(id: number): Promise<void> {
    const room = await this.getRoom(id, ['users', 'muted', 'banned', 'logs']);

    await this.logRepo.remove(room.logs);
    await this.mutedRepo.remove(room.muted);
    await this.bannedRepo.remove(room.banned);
    await this.chatRepo.remove(room);
  }

  async removeUserFromRoom(
    user: User,
    roomId: number,
    adminId: number,
  ): Promise<void> {
    const room = await this.getRoom(roomId, ['users']);

    if (room.adminId.indexOf(adminId) == -1)
      throw new HttpException(
        'User isnt admin in room',
        HttpStatus.UNAUTHORIZED,
      );

    if (user.id == room.ownerId && adminId == room.ownerId)
      return await this.deleteRoom(room.id);

    {
      const index = room.adminId.indexOf(user.id);
      if (index != -1) room.adminId.splice(index, 1);
    }

    {
      const index = room.users.findIndex((user1) => user1.id == user.id);
      if (index == -1)
        throw new HttpException('User not in room', HttpStatus.NOT_FOUND);
      room.users.splice(index, 1);
    }

    try {
      await this.chatRepo.save(room);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async changePassword(pass: PasswordI, room: ChatRoom): Promise<void> {
    if (!pass.newPassword)
      throw new HttpException(
        'New password cannot be empty',
        HttpStatus.BAD_REQUEST,
      );

    if (!(await this.checkPassword(room.id, pass.oldPassword)))
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );

    try {
      const password = await bcrypt.hash(pass.newPassword, 10);
      this.chatRepo.update(room.id, { password });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async checkPassword(id: number, password: string): Promise<boolean> {
    if (!password) return false;

    const currentRoom = await this.chatRepo.findOne(id);
    if (!currentRoom) return false;

    return await bcrypt.compare(password, currentRoom.password);
  }

  async updateRoom(id: number, room: ChatRoom, user: User): Promise<void> {
    {
      const updatedRoom = await this.getRoom(id, []);
      if (updatedRoom.ownerId != user.id)
        throw new HttpException(
          'User isnt owner of Room',
          HttpStatus.FORBIDDEN,
        );
    }

    const partial: ChatRoom = { public: room.public !== false } as ChatRoom;

    if (room.name) partial.name = room.name;

    if (room.hasOwnProperty('public')) {
      partial.public = room.public !== false;
      if (partial.public) partial.password = null;
      else {
        if (!room.password)
          throw new HttpException('Password Required', HttpStatus.BAD_REQUEST);

        try {
          partial.password = await bcrypt.hash(String(room.password), 10);
        } catch (error) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
      }
    }

    try {
      this.chatRepo.update(room.id, partial);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllRooms(): Promise<ChatRoom[]> {
    const rooms = await this.chatRepo.find();
    rooms.forEach((chat) => delete chat.password);
    return rooms;
  }

  async getRoomsForUser(userId: number): Promise<ChatRoom[]> {
    const uncompleted: ChatRoom[] = await this.chatRepo
      .createQueryBuilder('room')
      .leftJoin('room.users', 'user')
      .where('user.id = :userId', { userId })
      .leftJoinAndSelect('room.users', 'all_users')
      .getMany();

    const unresolved: Promise<ChatRoom>[] = uncompleted.map((room) =>
      this.getRoom(room.id, ['users', 'muted', 'banned', 'logs']),
    );
    return await Promise.all(unresolved);
  }

  async addUserToRoom(room: ChatRoom, user: User): Promise<void> {
    const curroom = await this.getRoom(room.id, ['users', 'banned']);
    if (!curroom.public)
      if (
        room.password == undefined ||
        !(await bcrypt.compare(room.password, curroom.password))
      )
        throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN);

    curroom.banned.forEach((banned) => {
      if (banned.userId == user.id) {
        const time = new Date();
        if (banned.endOfBan > time)
          throw new HttpException(
            'User is banned from Room',
            HttpStatus.FORBIDDEN,
          );
        this.unBanUserInRoom(banned, curroom);
      }
    });

    if (curroom.users.find((user1) => user1.id == user.id))
      throw new HttpException('User already in channel', HttpStatus.CONFLICT);

    await this.chatRepo
      .createQueryBuilder()
      .relation(ChatRoom, 'users')
      .of(curroom)
      .add(user);
  }

  async toggleAdminRole(
    owner: User,
    user: User,
    roomid: number,
  ): Promise<void> {
    const room = await this.getRoom(roomid, ['users', 'muted', 'banned', 'logs']);
    if (room.ownerId != owner.id)
      throw new HttpException(
        "User isn't the room's owner",
        HttpStatus.FORBIDDEN,
      );

    if (user.id == room.ownerId)
      throw new HttpException('Owner cannot be demoted', HttpStatus.FORBIDDEN);

    if (!room.users.find((user1) => user1.id == user.id))
      throw new HttpException(
        "User getting promoted isn't part of the room",
        HttpStatus.FORBIDDEN,
      );

    {
      const index = room.adminId.indexOf(user.id);
      if (index == -1) room.adminId.push(user.id);
      else room.adminId.splice(index, 1);
    }

    try {
      await this.chatRepo.save(room);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  unBanUserInRoom(user: BannedUser, room: ChatRoom): Promise<void> {
    const index = room.banned.findIndex((user1) => user1.id == user.id);
    if (index == -1) return;

    this.bannedRepo.delete(user.id);
  }

  unMuteUserInRoom(user: MutedUser, room: ChatRoom): Promise<void> {
    const index = room.muted.findIndex((user1) => user1.id == user.id);
    if (index == -1) return;

    this.mutedRepo.delete(user.id);
  }

  async muteUserInRoom(user: User, roomid: number, admin: User): Promise<void> {
    const currentroom = await this.getRoom(roomid, ['users', 'muted']);
    if (currentroom.ownerId == user.id)
      throw new HttpException(
        'User is owner and thus cannot be muted',
        HttpStatus.FORBIDDEN,
      );

    if (!currentroom.users.find((user1) => user1.id == user.id))
      throw new HttpException('User isnt in room', HttpStatus.NOT_FOUND);

    if (!currentroom.adminId.find((adminId) => adminId == admin.id))
      throw new HttpException(
        'User isnt admin in room',
        HttpStatus.UNAUTHORIZED,
      );

    if (currentroom.muted.find((user1) => user1.userId == user.id))
      throw new HttpException('User is already muted', HttpStatus.UNAUTHORIZED);

    const time = new Date(Date.now() + temporary);
    const muted = this.mutedRepo.create({
      userId: user.id,
      endOfMute: time,
      room: currentroom.id,
    });

    try {
      this.mutedRepo.save(muted);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async banUserInRoom(user: User, roomid: number, admin: User): Promise<void> {
    const currentroom = await this.getRoom(roomid, ['users', 'banned']);
    if (currentroom.ownerId == user.id)
      throw new HttpException(
        'User is owner and thus cannot be banned',
        HttpStatus.FORBIDDEN,
      );

    if (!currentroom.users.find((user1) => user1.id == user.id))
      throw new HttpException('User isnt in room', HttpStatus.NOT_FOUND);

    if (!currentroom.adminId.find((adminId) => adminId == admin.id))
      throw new HttpException(
        'User isnt admin in room',
        HttpStatus.UNAUTHORIZED,
      );

    if (currentroom.banned.find((user1) => user1.userId == user.id))
      throw new HttpException(
        'User is already banned',
        HttpStatus.UNAUTHORIZED,
      );

    const time = new Date(Date.now() + temporary);
    const banned = this.bannedRepo.create({
      userId: user.id,
      endOfBan: time,
      room: currentroom.id,
    });

    currentroom.users.splice(
      currentroom.users.findIndex((user1) => user1.id == user.id),
      1,
    );

    try {
      this.bannedRepo.save(banned);
      this.chatRepo.save(currentroom);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async addLogForRoom(id: number, message: string, user: User): Promise<void> {
    const currentroom = await this.getRoom(id, ['users', 'logs', 'muted']);
    if (!currentroom.users.find((user1) => user1.id == user.id))
      throw new HttpException('User isnt in room', HttpStatus.NOT_FOUND);

    {
      const muted = currentroom.muted.find((user1) => user1.userId == user.id);
      if (muted) {
        const time = new Date();
        if (muted.endOfMute > time)
          throw new HttpException(
            'User is muted from Room',
            HttpStatus.FORBIDDEN,
          );
        this.unMuteUserInRoom(muted, currentroom);
      }
    }

    if (currentroom.logs.length >= 100)
      this.logRepo.delete(currentroom.logs[0]);

    const log = this.logRepo.create({
      message: message,
      time: new Date(),
      room: currentroom.id,
      user: user,
    });

    try {
      this.logRepo.save(log);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getLogsForRoom(id: number, user: User): Promise<Log[]> {
    const currentroom = await this.getRoom(id, ['logs']);
    const logs = [];
    for (const log of currentroom.logs) {
      const currelog = await this.logRepo.findOne(log.id, {
        relations: ['user'],
      });
      if (user.blocked.indexOf(currelog.user.id) == -1) logs.push(currelog);
    }
    return logs;
  }
}
