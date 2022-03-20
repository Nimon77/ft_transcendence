import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ChatRoom } from './chat.entity';

@Entity()
export class MutedUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'timestamptz' })
  endOfMute: Date;

  @ManyToOne(() => ChatRoom, (room) => room.muted)
  room: ChatRoom;
}
