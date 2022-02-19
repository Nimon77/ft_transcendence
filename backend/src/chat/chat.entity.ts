import { User } from '../infrastructure/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class ChatRoom{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    adminId: number;

    @ManyToMany(() => User)
    @JoinTable()
    users: User[];
}