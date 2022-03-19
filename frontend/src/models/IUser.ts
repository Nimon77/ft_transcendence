import IAvatar from './IAvatar';
import Status from './Status';
import IChannel from './IChannel';
import IMatch from './IMatch';

interface IUser {
  id: number,
  username: string,
  profileCompleted: boolean,
  rank: number,
  friends: Array<number>,
  blocked: Array<number>,
  otp: string,
  avatarId: number,
  avatar: IAvatar,
  rooms: Array<IChannel>,
  matches: Array<IMatch>,
  status: Status,
  score?: string,
  tray?: number,
}

export default IUser;
