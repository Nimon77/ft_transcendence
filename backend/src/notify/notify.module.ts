import { Global, Module } from '@nestjs/common';
import { NotifyGateway } from './notify.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  imports: [AuthModule],
  providers: [NotifyGateway],
})
export class NotifyModule {}
