import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ChatRoom } from './chat.entity';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  public message: string;

  @Column({ type: 'timestamptz', nullable: true })
  public time: Date;

  @ManyToOne(() => ChatRoom, (room) => room.logs, { nullable: true })
  room: ChatRoom['id'];

  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE"})
  @JoinColumn()
  user: User;
}
