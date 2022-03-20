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
  score: number[];

  @Column({ type: 'timestamptz' })
  date: Date;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  winner: User;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  loser: User;
}
