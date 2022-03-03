import {
  Body,
  Controller,
  Delete,
  Get,
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
import AvatarService from 'src/user/avatar/avatar.service';
import { Readable } from 'stream';
import { User } from '../user.entity';
import { UserService } from '../user.service';

@Controller('user')
export class IdController {
  constructor(
    private readonly userService: UserService,
    private readonly avatarService: AvatarService,
  ) {}

  @Get('/')
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @Get('/:id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.getUserById(Number(id));
  }

  @Get('/:id/avatar')
  async getAvatar(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    const user = await this.userService.getUserById(id);
    const avatar = await this.avatarService.getAvatarById(user.avatarId);
    if (!avatar)
      return null;
    const stream = Readable.from(avatar.data);
    stream.pipe(response);
    response.set({
      'Content-Disposition': `inline; filename="${avatar.filename}"`,
      'Content-Type': 'image/*',
    });
    return new StreamableFile(stream);
  }

  //for testing

  @Post()
  createUser(@Body() user: User) {
    return this.userService.createUser(user);
  }

  @Put(':id')
  updateUser(@Body() user: User, @Param('id') id: number) {
    return this.userService.updateUser(id, user);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    try {
    this.userService.deleteUser(Number(id));
    }
    catch (error)
    {
      console.log(error);
    }
  }

  @Put(':id/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async setAvatar(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = await this.userService.getUserById(id);
    this.userService.setAvatar(user, file.originalname, file.buffer);
  }
}
