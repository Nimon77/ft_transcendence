import { User } from '../database/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class ChatRoom{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    adminId: number;

    @ManyToMany(() => User, { cascade: true, onUpdate:'CASCADE' })
    @JoinTable()
    users: User[];
}