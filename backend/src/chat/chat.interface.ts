import { User } from "../user/interfaces/user.interface";

export interface ChatRoom{
    id: number;
    name?: string;
    adminId?: number;
    users?: User[];
}