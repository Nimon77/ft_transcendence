import {
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  JoinColumn,
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

  @OneToMany(() => Log, (Log) => Log.channel)
  @JoinColumn()
  logs: Log[];
}
