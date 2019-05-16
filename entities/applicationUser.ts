import { BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity } from "typeorm"

@Entity('applicationUser')
export default class applicationUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  githubId: string;
  
  @Column()
  githubUsername: string;

  @CreateDateColumn({type: 'datetime'})
  createdAt: Date;

  @UpdateDateColumn({type: 'datetime'})
  updatedAt: Date;
}
