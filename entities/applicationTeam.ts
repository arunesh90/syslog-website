import { BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Entity } from "typeorm"

@Entity('applicationTeam')
export default class applicationTeam extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({type: 'simple-array', transformer: {
    from: (array: string[]) => array.map(parseInt),
    to  : (array: number[]) => array
  }})
  memberIds: number[]

  @CreateDateColumn({type: 'datetime'})
  createdAt: Date;

  @UpdateDateColumn({type: 'datetime'})
  updatedAt: Date;
}
