import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONT_URL,
  },
  namespace: 'notify',
})
export class NotifyGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
