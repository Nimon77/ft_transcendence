import {
  Column,
  Entity,
  OneToOne,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Avatar } from 'src/user/entities/avatar.entity';
import { Status } from '../enums/status.enum';
import { Match } from './match.entity';
import { Connection } from './connection.entity';
import { TextChannel } from 'src/chat/entity/textChannel.entity';
import { DMChannel } from 'src/chat/entity/dmChannel.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Connection, (connection) => connection.user)
  connection: Connection;

  @OneToOne(() => Avatar, (avatar) => avatar.user)
  avatar: Avatar;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column('boolean', { default: false })
  profileCompleted: boolean;

  @Column({ default: 100 })
  rank: number;

  @Column('int', { array: true, default: [] })
  followed: number[];

  @Column('int', { array: true, default: [] })
  blocked: number[];

  @ManyToMany(() => DMChannel, (channel) => channel.users, {
    onDelete: 'CASCADE',
  })
  dmChannels: DMChannel[];

  @ManyToMany(() => TextChannel, (channel) => channel.users, {
    onDelete: 'CASCADE',
  })
  textChannels: TextChannel[];

  @Column({ default: Status.OFFLINE })
  status: Status;

  @OneToMany(() => Match, (match) => match.winner)
  won: Match[];

  @OneToMany(() => Match, (match) => match.loser)
  lost: Match[];
}
