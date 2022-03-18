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

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  winner: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  loser: User;
}
