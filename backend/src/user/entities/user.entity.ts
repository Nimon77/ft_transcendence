import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Avatar } from 'src/user/entities/avatar.entity';
import { Status } from '../enums/status.enum';
import { Match } from './match.entity';
import { Connection } from './connection.entity';
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

  @Column({ default: Status.OFFLINE })
  status: Status;

  @OneToMany(() => Match, (match) => match.winner)
  won: Match[];

  @OneToMany(() => Match, (match) => match.loser)
  lost: Match[];
}
