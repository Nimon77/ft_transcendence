import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Avatar {
  @PrimaryColumn()
  public id: number;

  @Column()
  filename: string;

  @Column({
    type: 'bytea',
  })
  data: Uint8Array;
}
