import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { User } from 'src/user/user.entity';
import PhotoService from 'src/photo/photo.service';
import { Readable } from 'stream';
import { UserService } from '../user.service';

@Controller('user')
export class MeController {
  constructor(
    private readonly userService: UserService,
    private readonly photoService: PhotoService,
  ) {}

  @Get('/me')
  async getUser(@Request() req): Promise<User> {
    return await this.userService.getUserById(req.user.userId);
  }

  @Get('/me/avatar')
  async getAvatar(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    const user = await this.userService.getUserById(req.user.userId);
    const photo = await this.photoService.getPhotoById(user.avatarId);
    const stream = Readable.from(photo.data);
    stream.pipe(response);
    response.set({
      'Content-Disposition': `inline; filename="${photo.filename}"`,
      'Content-Type': 'image',
    });
    return new StreamableFile(stream);
  }

  @Put('/me')
  updateUser(@Request() req, @Body() user: User) {
    this.userService.updateUser(req.user.userId, user);
  }

  @Delete('/me')
  deleteUser(@Request() req) {
    this.userService.deleteUser(req.user.userId);
  }

  @Put('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.addAvatar(id, file.buffer, file.originalname);
  }

  @Post('/me/follow')
  async followUser(@Request() req, @Body() friend: User) {
    const user = await this.userService.getUserById(req.user.userId);
    const frienduser = await this.userService.getUserById(friend.id);
    this.userService.updateFollow(user, frienduser);
  }

  @Post('/me/block')
  async blockUser(@Request() req, @Body() blocked: User) {
    const user = await this.userService.getUserById(req.user.userId);
    const blockeduser = await this.userService.getUserById(blocked.id);
    this.userService.updateBlock(user, blockeduser);
  }
}
