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
    if (room.name == undefined)
      throw new HttpException('Room name needs to be specified', HttpStatus.BAD_REQUEST);
    let hashedPassword = '';
    if (room.public == false)
    {
      if (room.password)
        hashedPassword = await bcrypt.hash(room.password, 10);
      else
        throw new HttpException('Password Required', HttpStatus.BAD_REQUEST);
    }
    const currentRoom = this.chatRepo.create({
      name: room.name,
      adminId: [],
      public: room.public,
      ownerId: admin.id,
      users: [admin],
      password: hashedPassword,
    });
    currentRoom.adminId.push(admin.id);
    try {
      await this.chatRepo.save(currentRoom);
    } catch (error) {
      return;
    }
    currentRoom.password = undefined;
    return currentRoom;
  }

  async deleteRoom(id: number) {
    const roomid = await this.chatRepo.findOne(id);
    if (roomid) {
      await this.chatRepo.remove(roomid);
    } else throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
  }

  async getRoomInfo(roomId: number) {
    const room = await this.chatRepo.findOne(roomId, { relations: ['users'] });
    if (!room)
      throw new HttpException("Room not found", HttpStatus.NOT_FOUND);
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
      if (user.id == room.ownerId && adminId == room.ownerId)
      {
        this.deleteRoom(room.id);
        return ;
      }
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
    let updatedRoom = await this.chatRepo.findOne(id);
    if (!updatedRoom)
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    room.password = undefined;
    const currentRoom = this.chatRepo.create({
      id: updatedRoom.id,
      name: (room.name ? room.name : updatedRoom.name),
      password: updatedRoom.password,
      public: (room.public != undefined ? room.public : updatedRoom.public),
      adminId: updatedRoom.adminId,
      ownerId: updatedRoom.ownerId,
    });
    if (updatedRoom) {
      return await this.chatRepo.update({ id: currentRoom.id }, currentRoom);
    }
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
