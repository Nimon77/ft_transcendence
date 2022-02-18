import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  ParseIntPipe,
  StreamableFile,
  Res,
  Request,
} from '@nestjs/common';
import { Readable } from 'stream';
import { Response } from 'express';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../infrastructure/user.entity';
import { PhotoService } from '../photo/photo.service';
import { Express } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private photoService: PhotoService,
  ) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('me')
  getUserMe(@Request() req) {
    return this.userService.getUserById(req.user.userId);
  }
  
  @Get(':id')
  getUserById(@Param('id') id: number){
    return this.userService.getUserById(Number(id));
  }

  @Get('me/avatar')
  async getPhotoMe(
    @Res({ passthrough: true }) response: Response,
    @Request() req,
  ) {
    console.log("uwu");
    const photoid = await this.userService.getUserById(req.user.userId);
    const file = await this.photoService.getPhotoById(photoid.avatarId);
    const stream = Readable.from(file.data);
    stream.pipe(response);
    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': 'image',
    });
    return new StreamableFile(stream);
  }
  
  @Get(':id/avatar')
  async getPhotoById(
    @Res({ passthrough: true }) response: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const photoid = await this.userService.getUserById(id);
    const file = await this.photoService.getPhotoById(photoid.avatarId);
    const stream = Readable.from(file.data);
    stream.pipe(response);
    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': 'image',
    });
    return new StreamableFile(stream);
  }

  @Put('me')
  updateMe(@Body() user: User, @Request() req) {
    return this.userService.updateUser(req.user.userId, user);
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async addAvatarMe(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.addAvatar(req.user.userId, file.buffer, file.originalname);
  }

  //--------------- need update
  @Post()
  createUser(@Body() user: User) {
    return this.userService.createUser(user);
  }

  @Put(':id')
  updateUser(@Body() user: User, @Param('id') id: number) {
    return this.userService.updateUser(id, user);
  }

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.addAvatar(id, file.buffer, file.originalname);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    this.userService.deleteUser(Number(id));
  }
  //--------------- need update
}
