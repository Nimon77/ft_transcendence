import { Player } from './player.interface';
import { Socket } from 'socket.io';
import { Option } from './option.interface';

interface Ball {
  x: number;
  y: number;
}

export interface Room {
  code: string;
  player: Array<Player>;
  spectator?: Array<Socket>;
  start: boolean;
  option: Option;
  ball: Ball;
}
