import { User } from 'src/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TextChannel } from './textChannel.entity';

@Entity()
export class BannedUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'timestamptz' })
  endOfBan: Date;

  @ManyToOne(() => TextChannel, (channel) => channel.banned)
  channel: TextChannel;
}
