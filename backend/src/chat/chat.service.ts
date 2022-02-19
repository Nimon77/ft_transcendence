import { Injectable } from '@nestjs/common';
import { ChatRoom } from './chat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/infrastructure/user.entity';


@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatRoom)
        private readonly chatRepo: Repository<ChatRoom>
    ){}

    async createRoom(room: ChatRoom, admin: User)
    {
        const newRoom = await this.addUserToRoom(room, admin);
        newRoom.adminId = admin.id;
        return await this.chatRepo.save(room);
    }

    async addUserToRoom(room: ChatRoom, user: User)
    {
        room.users.push(user);
        return room;
    }
}
