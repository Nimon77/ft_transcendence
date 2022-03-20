import { MutedUser } from './mute.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { BannedUser } from './banned.entity';
import { Log } from './log.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  public: boolean;

  @Column({ nullable: true })
  password: string;

  @Column()
  ownerId: number;

  @Column('int', { array: true, default: [] })
  adminId: number[];

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => MutedUser, (MutedUser) => MutedUser.room)
  @JoinTable()
  muted: MutedUser[];

  @OneToMany(() => BannedUser, (BannedUser) => BannedUser.room)
  @JoinTable()
  banned: BannedUser[];

  @OneToMany(() => Log, (Log) => Log.room)
  @JoinTable()
  logs: Log[];
}
