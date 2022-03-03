export interface User {
  id: number;
  username?: string;
  onlineStatus?: boolean;
  profileCompleted?: boolean;
  rank?: number;
  friends?: number[];
  blocked?: number[];
}
