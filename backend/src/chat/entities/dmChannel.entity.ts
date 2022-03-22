import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from './channel.entity';

@Entity()
export class DMChannel extends Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User, { onDelete: 'CASCADE' })
  users: User[];
}
