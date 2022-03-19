import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Readable } from 'stream';
import { User } from '../entities/user.entity';
import AvatarService from '../services/avatar.service';
import { UserService } from '../services/user.service';

@Controller('user')
export class IdController {
  constructor(
    private readonly userService: UserService,
    private readonly avatarService: AvatarService,
  ) {}

  @Get('/')
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get('/:id')
  getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Get('/:id/avatar')
  async getAvatar(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    const avatar = await this.userService.getAvatar(id);

    response.set({
      'Content-Disposition': `inline; filename="${avatar.filename}"`,
      'Content-Type': 'image/*',
    });
    return this.avatarService.toStreamableFile(avatar.data);
  }

  @Get('/matches/:id')
  async getMatches(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getMatches(id);
  }
  //for testing

  @Post()
  createUser(@Body() user: User) {
    if (!user) throw new HttpException('Body null', HttpStatus.NOT_FOUND);
    return this.userService.createUser(user);
  }

  @Put(':id')
  updateUser(@Param('id') id: number, @Body() user: User) {
    if (!user) throw new HttpException('Body null', HttpStatus.NOT_FOUND);
    return this.userService.updateUser(id, user);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }

  @Put(':id/avatar')
  @UseInterceptors(FileInterceptor('file'))
  setAvatar(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.userService.setAvatar(id, file.originalname, file.buffer);
  }
}
