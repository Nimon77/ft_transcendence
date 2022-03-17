interface IGameOptions {
  ball: {
    radius: number,
    speed: number,
  },
  display: {
    height: number,
    width: number,
  },
  input: {
    mode: number,
    plan: number,
  },
  score: {
    max: number,
    y: number,
  },
  tray: {
    height: number,
    width: number,
    x: number,
  },
}

export default IGameOptions;
