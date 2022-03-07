import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToOne} from 'typeorm';
import { ChatRoom } from './chat.entity';

@Entity()
export class BannedUser{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    public userId: number;

    @Column({ type: 'timestamptz' })
    public endOfBan: Date;

    @ManyToOne(() => ChatRoom, room => room.banned, { nullable: true})
    room: ChatRoom;
}