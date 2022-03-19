import IUser from './IUser';

interface ILog {
  id: number,
  userId: number,
  time: string,
  room: number,
  user: IUser,
}

export default ILog;
