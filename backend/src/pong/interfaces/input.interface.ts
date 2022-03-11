export enum Plan {
  default,
}

export enum Mode {
  none,
  blind,
}

export interface Input {
  plan: Plan;
  mode: Mode;
}
