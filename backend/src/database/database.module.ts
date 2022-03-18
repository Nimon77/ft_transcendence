import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Avatar } from 'src/user/avatar/avatar.entity';
import { ChatRoom } from 'src/chat/entity/chat.entity';
import { MutedUser } from 'src/chat/entity/mute.entity';
import { BannedUser } from 'src/chat/entity/banned.entity';
import { Log } from 'src/chat/entity/log.entity';
import { User } from 'src/user/entities/user.entity';
import { Match } from 'src/user/entities/match.entity';

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
        entities: [User, Avatar, Match, ChatRoom, MutedUser, BannedUser, Log],
        synchronize: true, //false for production, else destroy/recreate data in the db
      }),
    }),
  ],
})
export class DatabaseModule {}
