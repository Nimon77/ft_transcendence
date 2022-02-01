import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
 
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

  @Column({ nullable: true })
  public avatarId: number;
}