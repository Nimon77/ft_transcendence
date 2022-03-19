import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
import { Readable } from 'stream';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@Controller('user')
export class MeController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  getUser(@Request() req): Promise<User> {
    return this.userService.getUserById(req.user.userId);
  }

  @Get('/me/avatar')
  async getAvatar(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    const avatar = await this.userService.getAvatar(req.user.userId);
    const stream = Readable.from(avatar.data);
    stream.pipe(response);
    response.set({
      'Content-Disposition': `inline; filename="${avatar.filename}"`,
      'Content-Type': 'image/*',
    });
    return new StreamableFile(stream);
  }

  @Put('/me')
  updateUser(@Request() req, @Body() user: User) {
    if (!user) throw new HttpException('Body null', HttpStatus.BAD_REQUEST);

    return this.userService.updateUser(req.user.userId, user);
  }

  @Delete('/me')
  deleteUser(@Request() req) {
    return this.userService.deleteUser(req.user.userId);
  }

  @Put('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  updateAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.userService.setAvatar(
      req.user.userId,
      file.originalname,
      file.buffer,
    );
  }

  @Put('/me/follow/:id')
  toggleUserFollowed(
    @Request() req,
    @Param('id') id: number,
  ): Promise<number[]> {
    return this.userService.toggleFollow(req.user.userId, id);
  }

  @Put('/me/block/:id')
  toggleUserBlocked(
    @Request() req,
    @Param('id') id: number,
  ): Promise<number[]> {
    return this.userService.toggleBlock(req.user.userId, id);
  }
}
