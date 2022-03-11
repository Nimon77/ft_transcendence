import { Player } from './player.interface';
import { Socket } from 'socket.io';
import { Option } from './option.interface';

interface Velocity
{
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
  player: Array<Player>;
  spectator?: Array<Socket>;
  inGame: boolean;
  option: Option;
  ball: Ball;
}
