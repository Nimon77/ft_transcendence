import { Column, Entity, PrimaryGeneratedColumn, JoinTable, JoinColumn, ManyToOne, OneToOne} from 'typeorm';
import { ChatRoom } from './chat.entity';
import { User } from 'src/user/user.entity';

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

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}