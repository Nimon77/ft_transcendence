import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Avatar {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public filename: string;

  @Column({ type: 'bytea' })
  public data: Buffer;
}
