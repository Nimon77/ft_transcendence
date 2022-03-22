import { MutedUser } from './mute.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BannedUser } from './banned.entity';
import { Log } from './log.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: true })
  public: boolean;

  @Column({ nullable: true })
  password: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  owner: User;

  @Column('int', { array: true, default: [] })
  adminId: number[];

  @ManyToMany(() => User, (user) => user.rooms)
  @JoinTable()
  users: User[];

  @OneToMany(() => MutedUser, (MutedUser) => MutedUser.room)
  @JoinColumn()
  muted: MutedUser[];

  @OneToMany(() => BannedUser, (BannedUser) => BannedUser.room)
  @JoinColumn()
  banned: BannedUser[];

  @OneToMany(() => Log, (Log) => Log.room)
  @JoinColumn()
  logs: Log[];
}
