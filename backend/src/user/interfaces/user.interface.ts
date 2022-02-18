export interface User {
  id: number;
  log: string;
  username: string;
  onlineStatus: boolean;
  profileCompleted: boolean;
  rank: number;
  friends: number[];
  blocked: number[];
}
