import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Avatar {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public filename: string;

  @Column({ type: 'bytea' })
  public data: Buffer;
}
