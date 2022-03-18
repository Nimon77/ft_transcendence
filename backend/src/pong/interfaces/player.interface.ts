import { Room } from './room.interface';
import { Input } from './input.interface';
import { Socket } from 'socket.io';
import { User } from 'src/user/entities/user.entity';

export interface Player {
  socket: Socket;
  user: User;
  room: Room;
  input: Input;
  tray: number;
  score: number;
}
