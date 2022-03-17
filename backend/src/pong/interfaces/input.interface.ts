export enum Plan {
  DEFAULT = 0,
  BLUE,
  ORANGE,
}

export enum Mode {
  NONE = 0,
  SPEED,
  SMALL,
}

export interface Input {
  plan: Plan;
  mode: Mode;
}
