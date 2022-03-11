import { Input } from './input.interface';

interface Display {
  width: number;
  height: number;
}

interface Ball {
  speed: number;
  radius: number;
}

interface Tray {
  width: number;
  height: number;
  x: number;
}

interface Score {
  y: number;
  max: number;
}

export interface Option {
  display: Display;
  ball: Ball;
  tray: Tray;
  score: Score;
  input: Input;
}
