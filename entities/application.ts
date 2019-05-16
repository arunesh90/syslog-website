import { Column, CreateDateColumn, BaseEntity, UpdateDateColumn, Index, PrimaryGeneratedColumn, Entity } from 'typeorm'

@Entity('application')
export default class applicationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Index({unique: true})
  key: string;

  @Column({nullable: true})
  teamId?: number;

  @Column({nullable: true})
  ownerId?: number;
 
  @CreateDateColumn({type: 'datetime'})
  createdAt: Date;

  @UpdateDateColumn({type: 'datetime'})
  updatedAt: Date;
}
