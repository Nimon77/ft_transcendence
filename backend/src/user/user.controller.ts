import { Controller, Get, Post, Param, Body, Delete, Put, UseGuards, UseInterceptors, UploadedFile, Req, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../infrastructure/user.entity';
import { PhotoService } from '../photo/photo.service';
import { Express } from 'express';
import { RequestWithUser } from './user-auth.interface';


@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
    ) {}

    @Get()
    getAllUsers(){
        return this.userService.getAllUsers();
    }

    @Get(':id')
    getUserById(@Param('id') id: string){
        return this.userService.getUserById(Number(id));
    }

    @Post()
    createUser(@Body() user: User){
        return this.userService.createUser(user);
    }

    @Post('avatar')
    @UseInterceptors(FileInterceptor('file'))
    async addAvatar(@Req() request: RequestWithUser ,@UploadedFile() file: Express.Multer.File){
        return this.userService.addAvatar(request.user.id, file.buffer, file.originalname);
    }
    @Delete(':id')
    deleteUser(@Param('id') id: string){
        this.userService.deleteUser(Number(id));
    }
}
