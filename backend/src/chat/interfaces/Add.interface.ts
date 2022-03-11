import { Room } from "src/pong/interfaces/room.interface";
import { User } from "src/user/user.entity";
import { ChatRoom } from "../chat.entity";
export interface AddI{
    user: User,
    room: ChatRoom
}