import { Global, Module } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { NotifyGateway } from './notify.gateway';

@Global()
@Module({
  providers: [NotifyService, NotifyGateway]
})
export class NotifyModule {}
