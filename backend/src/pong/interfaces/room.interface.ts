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

export enum State {
  WAITING,
  STARTING,
  INGAME,
  END,
}

export interface Room {
  code: string;
  state: State;
  players: Array<Player>;
  spectators?: Array<Socket>;
  options: Option;
  ball: Ball;
}
