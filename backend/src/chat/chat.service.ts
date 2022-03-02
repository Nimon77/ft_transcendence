import { Injectable, HttpException, HttpStatus, } from '@nestjs/common';
import { ChatRoomI } from './chat.interface';
import { ChatRoom } from './chat.entity';
import { Connection, ConnectionManager, getRepository, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { array } from 'joi';
import { use } from 'passport';
import { query } from 'express';


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
            adminId: [],
            ownerId: admin.id,
            users: users,
            ... room
        }
        newRoom.adminId.push(admin.id);
        return await this.chatRepo.save(newRoom);
    }

    async deleteRoom(id: number)
    {
        const roomid = await this.chatRepo.findOne(id);
        if (roomid)
        {
            await this.chatRepo.remove(roomid);
        }
        else
            throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    async removeUserFromRoom(user: User, roomId: number, adminId: number)
    {
        const room = await this.chatRepo.findOne(roomId, { relations: ['users'] });
        var index = room.adminId.indexOf(adminId);
        if (index == -1)
            throw new HttpException('User isnt admin in room', HttpStatus.UNAUTHORIZED);
        if (room)
        {
            var index = room.users.map(user => user.id).indexOf(user.id);
            if (index !== -1)
                room.users.splice(index, 1);
            else
                throw new HttpException('User not in room', HttpStatus.NOT_FOUND);
            await this.chatRepo.save(room);
        }
        else
            throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    async updateRoom(id: number, room: ChatRoom)
    {
        const updatedRoom = await this.chatRepo.findOne(id);
        const newRoom = {
            id: room.id,
            ... room
        }
        if (updatedRoom)
        {
            return await this.chatRepo.update({id: room.id}, newRoom);
        }
        else
            throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    async getAllRooms()
    {
        return await this.chatRepo.find();
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
        const chatroom = await this.chatRepo.findOne(roomId)
        if (chatroom)
        {
            const query = await this.chatRepo.createQueryBuilder('room')
            .leftJoin('room.users', 'user')
            .where('room.id = :roomId', { roomId })
            .leftJoinAndSelect('room.users', 'all_rooms')
            .orderBy('user.id', 'DESC');
            return paginate(query, options);
        }
        else
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
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
