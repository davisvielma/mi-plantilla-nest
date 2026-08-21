import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'roles' })
export class RoleOrmEntity {
  @PrimaryColumn({ type: 'char', length: 36 })
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  name!: string;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime', nullable: false })
  createdAt!: Date;
}
