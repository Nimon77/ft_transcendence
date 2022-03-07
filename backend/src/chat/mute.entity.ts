import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToOne} from 'typeorm';
import { ChatRoom } from './chat.entity';

@Entity()
export class MutedUser{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    public userId: number;

    @Column({ type: 'timestamptz' })
    public endOfMute: Date;

    @ManyToOne(() => ChatRoom, room => room.muted, { nullable: true })
    room: ChatRoom;
}