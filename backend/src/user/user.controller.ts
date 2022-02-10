import {    Controller, Get, Post, Param, Body,
            Delete, Put, UseGuards, UseInterceptors, UploadedFile, Req,ParseIntPipe,
            StreamableFile, Res} from '@nestjs/common';
import { Readable } from 'stream';
import { Response } from 'express';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../infrastructure/user.entity';
import { PhotoService } from '../photo/photo.service';
import { Express, request } from 'express';
import { RequestWithUser } from './user-auth.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private photoService: PhotoService
    ) {}

    @Get()
    getAllUsers(){
        return this.userService.getAllUsers();
    }

    @Get(':id')
    getUserById(@Param('id') id: number){
        return this.userService.getUserById(Number(id));
    }

    @Get(':id/avatar')
    async getPhotoById(@Res({passthrough: true}) response: Response, @Param('id', ParseIntPipe) id: number) {
      const photoid = await this.userService.getUserById(id);
      const file = await this.photoService.getPhotoById(photoid.avatarId);
      const stream = Readable.from(file.data);
      stream.pipe(response);
      response.set({
        'Content-Disposition': `inline; filename="${file.filename}"`,
        'Content-Type': 'image'
      })
      return new StreamableFile(stream);
    }

    @Post()
    createUser(@Body() user: User){
        return this.userService.createUser(user);
    }

    @Put(':id')
    updateUser(@Body() user: User, @Param('id') id: number)
    {
        return this.userService.updateUser(id, user);
    }

    @Post(':id/avatar')
    @UseInterceptors(FileInterceptor('file'))
    async addAvatar(@Param('id') id: number,@UploadedFile() file: Express.Multer.File){
        return this.userService.addAvatar(id, file.buffer, file.originalname);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string){
        this.userService.deleteUser(Number(id));
    }
}
