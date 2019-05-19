import { BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Entity } from "typeorm"

@Entity('applicationTeam')
export default class applicationTeam extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ownerId: number;

  @Column({type: 'simple-array'})
  memberIds: number[];

  @CreateDateColumn({type: 'timestamptz'})
  createdAt: Date;

  @UpdateDateColumn({type: 'timestamptz'})
  updatedAt: Date;
}
