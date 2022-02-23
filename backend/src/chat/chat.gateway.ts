import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONT_URL,
  },
  namespace: 'chat',
})

export class ChatGateway {
  Chatlog = new Array;
  @SubscribeMessage('message')
  handleMessage(client: any, data: any) {
    if (this.Chatlog.length > 10)
      this.Chatlog.shift();
    this.Chatlog.push(data.data);
    //console.log(this.Chatlog);
  }
}
