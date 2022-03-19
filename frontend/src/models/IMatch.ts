import IUser from './IUser';

interface IMatch {
  id: number,
  score: Array<number>,
  date: Date,
  winner: IUser,
  loser: IUser,
}

export default IMatch;
