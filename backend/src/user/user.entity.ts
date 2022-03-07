import {
  Column,
  PrimaryColumn,
  Entity,
  JoinColumn,
  OneToOne,
  ManyToMany,
} from 'typeorm';
import { Avatar } from 'src/user/avatar/avatar.entity';
import { ChatRoom } from 'src/chat/chat.entity';

@Entity()
export class User {
  @PrimaryColumn()
  public id: number;

  @Column({ nullable: true, unique: true })
  public username: string;

  @Column({ default: 0 })
  public rank: number;

  @Column({ nullable: true })
  public otp: string;

  @Column('int', { array: true, default: [] })
  public friends: number[];

  @Column('int', { array: true, default: [] })
  public blocked: number[];

  @Column('boolean', { default: false })
  public profileCompleted: boolean;

  @ManyToMany(() => ChatRoom, (room) => room.users)
  rooms: ChatRoom[];

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => Avatar, {
    nullable: true,
    onDelete: "CASCADE" 
  })
  public avatar?: Avatar;
  @Column({ nullable: true })
  public avatarId: number;
}
