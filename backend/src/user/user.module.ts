import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AvatarModule } from 'src/user/avatar/avatar.module';
import { ChatModule } from 'src/chat/chat.module';
import { MeController } from './controllers/me.controller';
import { IdController } from './controllers/id.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User]), AvatarModule, ChatModule],
  controllers: [MeController, IdController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
