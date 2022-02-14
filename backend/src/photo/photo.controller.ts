import {
    Controller,
    Get,
    Param,
    UseInterceptors,
    ClassSerializerInterceptor,
    Res,
    ParseIntPipe,
    StreamableFile,
  } from '@nestjs/common';
  import PhotoService from './photo.service';
  import { Readable } from 'stream';
  import { Response } from 'express';
   
  @Controller()
  export class PhotoController {
    constructor(
      private photoService: PhotoService
    ) {}
   
    @Get(':id')
    async getPhotoById(@Res() response: Response, @Param('id', ParseIntPipe) id: number) {
      const file = await this.photoService.getPhotoById(id);
      const stream = Readable.from(file.data);
      response.set({
        'Content-Disposition': `inline; filename="${file.filename}"`,
        'Content-Type': 'image'
      })
      return new StreamableFile(stream);
    }
  }

