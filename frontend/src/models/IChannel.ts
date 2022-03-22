import IUser from './IUser';
import IMutedUser from './IMutedUser';
import IBannedUser from './IBannedUser';
import ILog from './ILog';

interface IChannel {
  id: number,
  name: string,
  adminId: Array<number>,
  users: Array<IUser>,
  public: boolean,
  password: string,
  muted: Array<IMutedUser>,
  banned: Array<IBannedUser>,
  log: Array<ILog>,
  owner: IUser,
}

export default IChannel;
