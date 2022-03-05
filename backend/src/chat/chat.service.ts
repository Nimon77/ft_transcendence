import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ChatRoom } from './chat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { PasswordI } from './password.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRepo: Repository<ChatRoom>,
  ) {}

  async getRoomById(id: number): Promise<ChatRoom> {
    const chat = await this.chatRepo.findOne(id);

    if (!chat) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    delete chat.password;
    return chat;
  }

  async createRoom(room: ChatRoom, admin: User) {
    let hashedPassword = '';
    if (room.public == false)
      hashedPassword = await bcrypt.hash(room.password, 10);

    const newRoom: ChatRoom = {
      adminId: [],
      public: room.public,
      ownerId: admin.id,
      users: [admin],
      ...room,
    };
    newRoom.password = hashedPassword;
    newRoom.adminId.push(admin.id);
    try {
      await this.chatRepo.save(newRoom);
    } catch (error) {
      return;
    }
    newRoom.password = undefined;
    return newRoom;
  }

  async deleteRoom(id: number) {
    const roomid = await this.chatRepo.findOne(id);
    if (roomid) {
      await this.chatRepo.remove(roomid);
    } else throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
  }

  async getRoomInfo(roomId: number) {
    const room = await this.chatRepo.findOne(roomId, { relations: ['users'] });
    room.password = undefined;
    return room;
  }

  async removeUserFromRoom(user: User, roomId: number, adminId: number) {
    const room = await this.chatRepo.findOne(roomId, { relations: ['users'] });
    var index = room.adminId.indexOf(adminId);
    if (index == -1)
      throw new HttpException(
        'User isnt admin in room',
        HttpStatus.UNAUTHORIZED,
      );
    if (room) {
      var index = room.users.map((user) => user.id).indexOf(user.id);
      if (index !== -1) room.users.splice(index, 1);
      else throw new HttpException('User not in room', HttpStatus.NOT_FOUND);
      await this.chatRepo.save(room);
    } else throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
  }

  async changePassword(pass: PasswordI, room: ChatRoom) {
    if (!pass.oldPassword || !pass.newPassword) return;
    if (this.checkPassword(room.id, pass.oldPassword)) {
      const hashedPassword = await bcrypt.hash(pass.newPassword, 10);
      room.password = hashedPassword;
      this.chatRepo.save(room);
    } else
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
  }

  async checkPassword(id: number, password: string) {
    const currentRoom = await this.chatRepo.findOne(id);
    if (password)
      if (await bcrypt.compare(password, currentRoom.password)) return true;
    return false;
  }

  async updateRoom(id: number, room: ChatRoom) {
    const updatedRoom = await this.chatRepo.findOne(id);
    const newRoom = {
      id: room.id,
      ...room,
    };
    if (updatedRoom) {
      return await this.chatRepo.update({ id: room.id }, newRoom);
    } else throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
  }

  async getAllRooms() {
    const rooms = await this.chatRepo.find();
    rooms.forEach((chat) => {
      chat.password = undefined;
    });
    return rooms;
  }

  async getRoomsForUser(userId: number) {
    const query = await this.chatRepo
      .createQueryBuilder('room')
      .leftJoin('room.users', 'user')
      .where('user.id = :userId', { userId })
      .leftJoinAndSelect('room.users', 'all_users')
      .getMany();
    query.forEach((chat) => {
      chat.password = undefined;
    });
    return query;
  }

  async getUsersForRoom(roomId: number) {
    const chatroom = await this.chatRepo.findOne(roomId);
    if (chatroom) {
      const query = await this.chatRepo
        .createQueryBuilder('room')
        .leftJoin('room.users', 'user')
        .where('room.id = :roomId', { roomId })
        .leftJoinAndSelect('room.users', 'all_rooms')
        .getMany();
      query.forEach((chat) => {
        chat.password = undefined;
      });
      return query;
    } else throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
  }

  async addUserToRoom(roomid: number, user: User) {
    const room = await this.chatRepo.findOne(roomid, { relations: ['users'] });
    const page = await this.getUsersForRoom(roomid);
    let userexists = false;
    room.users.forEach((curuser) => {
      if (curuser.id == user.id) userexists = true;
    });
    if (!userexists)
      page.forEach(async (id) => {
        await this.chatRepo
          .createQueryBuilder()
          .relation(ChatRoom, 'users')
          .of(room)
          .add(user);
      });
  }
}
