import { User } from "../user/interfaces/user.interface";

export interface ChatRoomI{
    id?: number;
    name?: string;
    password?:string;
    public?: boolean;
    ownerId?: number;
    adminId?: number[];
    users?: User[];
}