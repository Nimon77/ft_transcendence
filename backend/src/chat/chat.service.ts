import { Injectable, HttpException, HttpStatus, } from '@nestjs/common';
import { ChatRoomI } from './chat.interface';
import { ChatRoom } from './chat.entity';
import { getRepository, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { array } from 'joi';
import { use } from 'passport';


@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatRoom)
        private readonly chatRepo: Repository<ChatRoom>
    ){}

    async getRoomById(id: number)
    {
        const chat = await this.chatRepo.findOne(id);
        if (chat){
            return chat;
        }
        else
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    async createRoom(room: ChatRoom, admin: User)
    {
        let users = [];
        users.push(admin);
        const newRoom: ChatRoom = {
            adminId: admin.id,
            users: users,
            ... room
        }
        await this.chatRepo.save(newRoom);
        return this.addUserToRoom(newRoom.id, admin);
    }

    async getRoomsForUser(userId: number, options: IPaginationOptions)
    {
        const query = await this.chatRepo.createQueryBuilder('room')
        .leftJoin('room.users', 'user')
        .where('user.id = :userId', { userId })
        .leftJoinAndSelect('room.users', 'all_users')
        .orderBy('room.id', 'DESC');
        return paginate(query, options);
    }


    async getUsersForRoom(roomId: number, options: IPaginationOptions)
    {
        const query = await this.chatRepo.createQueryBuilder('room')
        .leftJoin('room.users', 'user')
        .where('room.id = :roomId', { roomId })
        .leftJoinAndSelect('room.users', 'all_rooms')
        .orderBy('user.id', 'DESC');
        return paginate(query, options);
    }

    async addUserToRoom(roomid: number, user: User)
    {
        const room = await this.getRoomById(roomid);
        const page = await this.getUsersForRoom(roomid, {page: 1, limit: 100})
        page.items.forEach(async id => {
            await this.chatRepo
              .createQueryBuilder()
              .relation(ChatRoom, 'users')
              .of(room)
              .add(user);
          });
    }
}
