import { Global, Module } from '@nestjs/common';
import { NotifyGateway } from './notify.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { NotifyService } from './notify.service';

@Global()
@Module({
  imports: [AuthModule],
  providers: [NotifyGateway, NotifyService],
  exports: [NotifyService],
})
export class NotifyModule {}
