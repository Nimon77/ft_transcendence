import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './user.entity';
import { PhotoService } from '../photo/photo.service';


@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly repo: Repository<User>,
    private readonly photoService: PhotoService,
    ){}

    async getAllUsers()
    {
        return await this.repo.find();
    }

    async getUserById(id: number)
    {
        const user = await this.repo.findOne(id);    
        if (user){
            return user;
        }
        else
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    async createUser(user: User)
    {
        const newUser = {
            id: user.id,
            log: user.log,
        }
        newUser.id = user.id;
        await this.repo.save(newUser);
        return user;
    }

    async updateUser(userid: number,user: User)
    {
        const updatedUser = await this.repo.findOne(userid);
        const newUser = {
            id: userid,
            ... user
        }
        if (updatedUser)
        {
            return await this.repo.update({id: userid}, newUser);
        }
        else
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    async deleteUser(id: number)
    {
        const firstUser = await this.repo.findOne(id);
        if (firstUser)
        {
            await this.repo.remove(firstUser);
        }
        else
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    async addAvatar(userId: number, imageBuffer: Buffer, filename: string){
        const avatar = await this.photoService.uploadPhoto(imageBuffer, filename);
        await this.repo.update(userId, {
            avatarId: avatar.id
        });
        return avatar;
    }

    async updateFollow(user: User, followed_user: User){
        if (followed_user.id == user.id)
            return ;
        const userFollow = await this.repo.find({where: {id: In(user.friends)}});
        const found = userFollow.find(element => element.id == followed_user.id)
        if (found)
        {
            var index = user.friends.indexOf(found.id);
            if (index !== -1)
                user.friends.splice(index, 1);
        }
        else
            user.friends.push(followed_user.id);
        await this.repo.update(user.id,
            {
                friends: user.friends
            });
    }

    async updateBlock(user: User, blocked_user: User){
        if (user.id == blocked_user.id)
            return ;
        const userBlock = await this.repo.find({where: {id: In(user.blocked)}});
        const found = userBlock.find(element => element.id == blocked_user.id)
        if (found)
        {
            var index = user.blocked.indexOf(found.id);
            if (index !== -1)
                user.blocked.splice(index, 1);
        }
        else
            user.blocked.push(blocked_user.id);
        await this.repo.update(user.id,
            {
                blocked: user.blocked
            });
    }
}
