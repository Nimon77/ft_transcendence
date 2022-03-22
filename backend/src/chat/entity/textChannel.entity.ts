import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Channel } from './channel.entity';
import { MutedUser } from './mute.entity';
import { BannedUser } from './banned.entity';

@Entity()
export class TextChannel extends Channel {
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

  @OneToMany(() => MutedUser, (MutedUser) => MutedUser.channel)
  @JoinColumn()
  muted: MutedUser[];

  @OneToMany(() => BannedUser, (BannedUser) => BannedUser.channel)
  @JoinColumn()
  banned: BannedUser[];
}
