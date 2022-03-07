import { User } from '../user/user.entity';
import { MutedUser } from './mute.entity';
import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany, OneToMany, ManyToOne } from 'typeorm';
import { BannedUser } from './banned.entity';

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

    @OneToMany(() => MutedUser, MutedUser => MutedUser.room, { nullable: true })
    @JoinTable()
    muted: MutedUser[];

    @OneToMany(() => BannedUser, BannedUser => BannedUser.room, { nullable: true })
    @JoinTable()
    banned: BannedUser[];
}