import {
  Column,
  PrimaryColumn,
  Entity,
  OneToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Avatar } from 'src/user/entities/avatar.entity';
import { ChatRoom } from 'src/chat/entity/chat.entity';
import { Status } from '../enums/status.enum';
import { Match } from './match.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Avatar, (avatar) => avatar.user)
  avatar: Avatar;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true })
  otp: string;

  @Column('boolean', { default: false })
  profileCompleted: boolean;

  @Column({ default: 100 })
  rank: number;

  @Column('int', { array: true, default: [] })
  followed: number[];

  @Column('int', { array: true, default: [] })
  blocked: number[];

  @ManyToMany(() => ChatRoom, (room) => room.users, {
    onDelete: 'CASCADE',
  })
  rooms: ChatRoom[];

  @Column({ default: Status.OFFLINE })
  status: Status;

  @OneToMany(() => Match, (match) => match.winner)
  won: Match[];

  @OneToMany(() => Match, (match) => match.loser)
  lost: Match[];
}
