import { Injectable } from '@nestjs/common';
import { ChatRoomI } from './chat.interface';
import { ChatRoom } from './chat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/infrastructure/user.entity';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { array } from 'joi';
import { use } from 'passport';


@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatRoom)
        private readonly chatRepo: Repository<ChatRoom>
    ){}

    async createRoom(room: ChatRoom, admin: User)
    {
        console.log(room);
        console.log(admin);
        const newRoom = {
            adminId: admin.id,
            users: [],
            ... room
        }
        console.log(newRoom);
        await this.addUserToRoom(newRoom, admin);
        return await this.chatRepo.save(newRoom);
    }

    async getRoomsForUser(userId: number, options: IPaginationOptions)
    {
        const query = await this.chatRepo.createQueryBuilder('room')
        .leftJoin('room.users', 'user')
        .where('user.id = :userId', { userId })
        .leftJoinAndSelect('room.users', 'all_users')
        .orderBy('room.id', 'DESC');
        console.log(query);
        return paginate(query, options);
    }

    async addUserToRoom(room: ChatRoom, user: User)
    {
        room.users.push(user);
        console.log(room.users);
        return room;
    }
}
