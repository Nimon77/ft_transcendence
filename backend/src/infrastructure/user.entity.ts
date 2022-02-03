import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Photo } from 'src/photo/photo.entity';
 
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column()
  public username: string;

  @Column()
  public log: string;

  @Column()
  public rank: number;

  @Column('int', {array: true})
  public friends: number[];

  @Column('int', {array: true})
  public blocked: number[];

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