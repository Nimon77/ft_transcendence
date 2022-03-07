import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { any } from 'joi';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONT_URL,
  },
  namespace: 'notify',
})
export class NotifyGateway {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    if (!client.handshake.headers.authorization) return client.disconnect();
    const payload = this.authService.verify(
      client.handshake.headers.authorization.split(' ')[1],
    );
    const user = await this.userService.getUserById(payload.sub);
    !user && client.disconnect();
    client.data.user = user;
  }

  @SubscribeMessage('notify')
  handleMessage(client: Socket, data: object) {
    //const user = client.data.user;
    //console.log(user);
    //console.log(this.server.sockets);
    /*client.emit('notify', {
      user: { id: user.id, username: user.username },
    });*/
  }
}
