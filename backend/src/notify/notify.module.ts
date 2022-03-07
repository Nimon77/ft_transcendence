import { Global, Module } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { NotifyGateway } from './notify.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  imports: [AuthModule],
  providers: [NotifyService, NotifyGateway]
})
export class NotifyModule {}
