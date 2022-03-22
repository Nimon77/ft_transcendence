import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TextChannel } from './textChannel.entity';

@Entity()
export class MutedUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  endOfMute: Date;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => TextChannel)
  @JoinColumn()
  channel: TextChannel;
}
