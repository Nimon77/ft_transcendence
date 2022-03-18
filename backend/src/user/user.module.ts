import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarModule } from 'src/user/avatar/avatar.module';
import { ChatModule } from 'src/chat/chat.module';
import { MeController } from './controllers/me.controller';
import { IdController } from './controllers/id.controller';
import { User } from './entities/user.entity';
import { Match } from './entities/match.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Match]), AvatarModule, ChatModule],
  controllers: [MeController, IdController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
