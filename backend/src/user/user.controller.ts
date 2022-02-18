import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Put,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
  StreamableFile,
  Res,
  Request,
} from '@nestjs/common';
import { Readable } from 'stream';
import { Response } from 'express';
import { UserService } from './user.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { User } from '../infrastructure/user.entity';
import { PhotoService } from '../photo/photo.service';
import { Express } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';

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
    return this.getUserById(req.user.userId);
  }

  @Get('me/avatar')
  getPhotoMe(@Request() req, @Res({ passthrough: true }) response: Response) {
    return this.getPhotoById(req.user.userId, response);
  }

  @Put('me')
  updateUser(@Request() req, @Body() user: User) {
    user.id = req.user.userId;
    return this.userService.updateUser(user.id, user);
  }

  @Delete('me')
  deleteUser(@Request() req) {
    this.userService.deleteUser(req.user.userId);
  }

  @UseInterceptors(AnyFilesInterceptor())
  @Post('me/avatar')
  async addAvatarMe(@Request() req, @UploadedFiles() files: Express.Multer.File) {
    this.userService.addAvatar(req.user.userId, files[0].buffer, files[0].originalname);
  }

  @Get(':id')
  getUserById(@Param('id') id: any) {
    return this.userService.getUserById(Number(id));
  }

  @Get(':id/avatar')
  async getPhotoById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
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

  //   @Post()
  //   createUser(@Body() user: User) {
  //     return this.userService.createUser(user);
  //   }

  //   @Post(':id/avatar')
  //   @UseInterceptors(FileInterceptor('file'))
  //   async addAvatar(
  //     @Param('id') id: number,
  //     @UploadedFile() file: Express.Multer.File,
  //   ) {
  //     return this.userService.addAvatar(id, file.buffer, file.originalname);
  //   }
}
