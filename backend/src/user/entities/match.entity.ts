import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { array: true, default: [] })
  public score: number[];

  @Column({ type: 'timestamptz' })
  public date: Date;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  winner: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  loser: User;
}
