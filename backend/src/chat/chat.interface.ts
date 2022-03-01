import { User } from "../user/interfaces/user.interface";

export interface ChatRoomI{
    id?: number;
    name?: string;
    adminId?: number[];
    users?: User[];
}