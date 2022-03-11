export enum Plan {
  default = 0,
}

export enum Mode {
  none = 0,
  blind,
}

export interface Input {
  plan: Plan;
  mode: Mode;
}
