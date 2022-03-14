import { User } from 'src/user/user.entity';
import { ChatRoom } from '../entity/chat.entity';
export interface AddI {
  user: User;
  room: ChatRoom;
}
