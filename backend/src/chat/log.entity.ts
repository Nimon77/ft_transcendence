import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToOne} from 'typeorm';
import { ChatRoom } from './chat.entity';

@Entity()
export class Log{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    public userId: number;

    @Column()
    public message: string;

    @Column({ type: 'timestamptz', nullable: true })
    public time: Date;

    @ManyToOne(() => ChatRoom, room => room.logs, { nullable: true })
    room: ChatRoom['id'];
}