import { Injectable } from '@nestjs/common';
import {  NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';

@Injectable()
export class PhotoService {
    constructor(
        @InjectRepository(Photo)
        private photoRepo: Repository<Photo>,
    ){}

    async uploadPhoto(dataBuffer: Buffer, filename: string){
        const newPhoto = await this.photoRepo.create({
            filename,
            data: dataBuffer
        })
        await this.photoRepo.save(newPhoto);
        return (newPhoto);
    }

    async getPhotoById(photoId: number)
    {
        const file = await this.photoRepo.findOne(photoId);
        if (file)
            return (file);
        else
            throw new NotFoundException('Avatar not found');
    }
}

export default PhotoService;