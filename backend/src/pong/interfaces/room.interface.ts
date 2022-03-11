import { Player } from './player.interface';
import { Socket } from 'socket.io';
import { Option } from './option.interface';

interface Velocity {
  x: number;
  y: number;
}

interface Ball {
  x: number;
  y: number;
  velocity: Velocity;
}

export interface Room {
  code: string;
  players: Array<Player>;
  spectators?: Array<Socket>;
  inGame: boolean;
  options: Option;
  ball: Ball;
}
