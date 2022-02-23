import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PongGateway } from './pong.gateway';

@Module({
  imports: [AuthModule],
  providers: [PongGateway],
})
export class PongModule {}
