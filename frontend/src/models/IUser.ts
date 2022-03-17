interface IUser {
  id: number,
  username: string,
  avatarId: number,
  rank: number,
  status: number,
  profileCompleted: boolean,
  otp: string,
  blocked: Array<number>,
  friends: Array<number>,
  score?: string,
  tray?: number,
}

export default IUser;
