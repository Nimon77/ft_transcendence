import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONT_URL,
  },
  namespace: 'chat',
})
export class ChatGateway {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async handleConnection(client: any) {
    if (!client.handshake.headers.authorization) return client.disconnect();
    const payload = this.authService.verify(
      client.handshake.headers.authorization.split(' ')[1],
    );
    if (!payload.sub) return client.disconnect();

    client.user = await this.userService.getUserById(payload.sub);
  }

  Chatlog = new Array();
  @SubscribeMessage('message')
  handleMessage(client: any, data: any) {
    console.log(client.user);
    if (this.Chatlog.length > 10) this.Chatlog.shift();
    this.Chatlog.push(data.data);
    //console.log(this.Chatlog);
  }
}
