import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/user/user.entity';
import { Avatar } from 'src/user/avatar/avatar.entity';
import { ChatRoom } from 'src/chat/chat.entity';
import { MutedUser } from 'src/chat/mute.entity';
import { BannedUser } from 'src/chat/banned.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('POSTGRES_HOST'),
            username: configService.get('POSTGRES_USER'),
            password: configService.get('POSTGRES_PASSWORD'),
            database: configService.get('POSTGRES_DB'),
            entities: [User, Avatar, ChatRoom, MutedUser, BannedUser],
            synchronize: true,//false for production, else destroy/recreate data in the db
          })
        }),
      ],
})
export class DatabaseModule {}
