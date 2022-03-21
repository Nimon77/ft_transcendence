import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Status } from 'src/user/enums/status.enum';

@Injectable()
export class NotifyService {
  @WebSocketServer()
  server: Server;

  emitStatus(userId: number, status: Status): void {
    this.server.emit('status', { userId, status });
  }
}
