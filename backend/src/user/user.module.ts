import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from 'src/chat/chat.module';
import { MeController } from './controllers/me.controller';
import { IdController } from './controllers/id.controller';
import { User } from './entities/user.entity';
import { Match } from './entities/match.entity';
import { Avatar } from './entities/avatar.entity';
import { UserService } from './services/user.service';
import { Connection } from './entities/connection.entity';
import { ConnectionService } from './services/connection.service';
import { AvatarService } from './services/avatar.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Connection, Avatar, Match]),
    ChatModule,
  ],
  controllers: [MeController, IdController],
  providers: [UserService, ConnectionService, AvatarService],
  exports: [UserService, ConnectionService],
})
export class UserModule {}
