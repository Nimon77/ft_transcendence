import {
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
  TableInheritance,
} from 'typeorm';
import { Log } from './log.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
@TableInheritance()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @ManyToMany(() => Log)
  @JoinTable()
  logs: Log[];
}
