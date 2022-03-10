import { Option } from './option.interface';

interface Ball {
  x: number;
  y: number;
}

interface Tray {
  left: number;
  right: number;
}

export interface Room {
  start: boolean;
  option: Option;
  ball: Ball;
  tray: Tray;
  player: Array<string>;
  spectator?: Array<string>;
}
