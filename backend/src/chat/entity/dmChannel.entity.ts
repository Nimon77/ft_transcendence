import { User } from 'src/user/entities/user.entity';
import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from './channel.entity';

@Entity()
export class DMChannel extends Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User, { onDelete: 'CASCADE' })
  @JoinTable()
  users: User[];
}
