export enum Plan {
  DEFAULT = 0,
}

export enum Mode {
  NONE = 0,
  BLIND,
}

export interface Input {
  plan: Plan;
  mode: Mode;
}
