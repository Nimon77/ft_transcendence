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
  message: string;

  @ManyToOne(() => ChatRoom, (room) => room.logs)
  room: ChatRoom;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  user: User;
}
