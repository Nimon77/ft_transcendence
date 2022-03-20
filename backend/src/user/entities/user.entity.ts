import {
  Column,
  PrimaryColumn,
  Entity,
  JoinColumn,
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
  public id: number;

  @Column({ nullable: true, unique: true })
  public username: string;

  @Column({ default: 100 })
  public rank: number;

  @Column({ nullable: true })
  public otp: string;

  @Column('int', { array: true, default: [] })
  public friends: number[];

  @Column('int', { array: true, default: [] })
  public blocked: number[];

  @Column('boolean', { default: false })
  public profileCompleted: boolean;

  @ManyToMany(() => ChatRoom, (room) => room.users)
  @OneToOne(() => Avatar, { onDelete: 'CASCADE' })
  @JoinColumn()
  public avatar: Avatar;

  @Column({ default: Status.OFFLINE })
  public status: Status;

  @OneToMany(() => Match, (match) => match.winner)
  public won: Match[];

  @OneToMany(() => Match, (match) => match.loser)
  public lost: Match[];
}
