import { User } from '../user/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class ChatRoom{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('int', {array: true, default: []})
    public adminId: number[];

    @Column()
    ownerId: number;

    @Column({nullable: true})
    password: string;

    @Column({default: true})
    public: boolean;

    @ManyToMany(() => User, { cascade: true, onUpdate:'CASCADE' })
    @JoinTable()
    users: User[];
}