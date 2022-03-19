import IUser from './IUser';

interface IMatch {
  id: number,
  score: string,
  time: string,
  winner: IUser,
  loser: IUser,
}

export default IMatch;
