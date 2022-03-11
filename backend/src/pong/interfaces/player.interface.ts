import { Room } from './room.interface';
import { Input } from './input.interface';
import { Socket } from 'socket.io';

export interface Player {
  socket: Socket;
  room: Room;
  input: Input;
  tray: number;
}
