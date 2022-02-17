import { Column,PrimaryColumn, Entity, JoinColumn, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Photo } from 'src/photo/photo.entity';
 
@Entity()
export class User {
  @PrimaryColumn()
  public id: number;
 
  @Column({nullable: true})
  public username: string;

  @Column()
  public log: string;

  @Column({default: 0})
  public rank: number;

  @Column({default: false})
  public onlineStatus: boolean;

  @Column('int', {array: true, nullable: true})
  public friends: number[];

  @Column('int', {array: true, nullable: true})
  public blocked: number[];

  @Column('boolean', {default: false})
  public profileCompleted: boolean;

  @JoinColumn({ name: 'avatarId'})
  @OneToOne(
    () => Photo,
    {
      nullable: true
    }
  )

  public avatar?: Photo;
  @Column({ nullable: true })
  public avatarId: number;
}