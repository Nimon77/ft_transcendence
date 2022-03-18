import {
  Column,
  PrimaryColumn,
  Entity,
  JoinColumn,
  OneToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Avatar } from 'src/user/avatar/avatar.entity';
import { ChatRoom } from 'src/chat/entity/chat.entity';
import { Status } from '../enums/status.enum';
import { Match } from './match.entity';

@Entity()
export class User {
  @PrimaryColumn()
  public id: number;

  @Column({ nullable: true, unique: true })
  public username: string;

  @Column({ default: 0 })
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
  public rooms: ChatRoom[];

  @OneToOne(() => Avatar, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'avatarId' })
  public avatar?: Avatar;
  @Column({ nullable: true })
  public avatarId: number;

  @Column({ default: Status.OFFLINE })
  public status: Status;

  @OneToMany(() => Match, (match) => match.winner || match.loser)
  public matches: Match[];
}
