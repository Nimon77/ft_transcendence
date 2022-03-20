import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { User } from '../entities/user.entity';
import { Request } from '../interfaces/request.interface';
import AvatarService from '../services/avatar.service';
import { UserService } from '../services/user.service';

@Controller('user')
export class MeController {
  constructor(
    private readonly userService: UserService,
    private readonly avatarService: AvatarService,
  ) {}

  @Get('/me')
  getUser(@Req() req: Request): Promise<User> {
    return this.userService.getUserById(req.user.userId);
  }

  @Get('/me/avatar')
  async getAvatar(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    const avatar = await this.userService.getAvatar(req.user.userId);

    response.set({
      'Content-Disposition': `inline; filename="${avatar.filename}"`,
      'Content-Type': 'image/*',
    });
    return this.avatarService.toStreamableFile(avatar.data);
  }

  @Put('/me')
  updateUser(@Req() req: Request, @Body() user: User): Promise<User> {
    return this.userService.updateUser(req.user.userId, user);
  }

  @Delete('/me')
  deleteUser(@Req() req: Request): Promise<void> {
    return this.userService.deleteUser(req.user.userId);
  }

  @Put('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  updateAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    return this.userService.setAvatar(
      req.user.userId,
      file.originalname,
      file.buffer,
    );
  }

  @Put('/me/follow/:id')
  toggleUserFollowed(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<number[]> {
    return this.userService.toggleFollow(req.user.userId, id);
  }

  @Put('/me/block/:id')
  toggleUserBlocked(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<number[]> {
    return this.userService.toggleBlock(req.user.userId, id);
  }
}
