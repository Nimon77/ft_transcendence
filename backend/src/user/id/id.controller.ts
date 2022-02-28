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
import { User } from 'src/database/user.entity';
import PhotoService from 'src/photo/photo.service';
import { Readable } from 'stream';
import { UserService } from '../user.service';

@Controller('user')
export class IdController {
  constructor(
    private readonly userService: UserService,
    private readonly photoService: PhotoService,
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
    const photo = await this.photoService.getPhotoById(user.avatarId);
    const stream = Readable.from(photo.data);
    stream.pipe(response);
    response.set({
      'Content-Disposition': `inline; filename="${photo.filename}"`,
      'Content-Type': 'image',
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
    this.userService.deleteUser(Number(id));
  }
  @Put(':id/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.addAvatar(id, file.buffer, file.originalname);
  }
}
