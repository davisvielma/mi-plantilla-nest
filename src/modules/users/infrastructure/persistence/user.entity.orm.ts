import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RoleOrmEntity } from '.';

@Entity({ name: 'users' })
export class UserOrmEntity {
  @PrimaryColumn({ type: 'char', length: 36 })
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password!: string;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({
    type: 'char',
    length: 36,
    nullable: false,
  })
  roleId!: string;

  @ManyToOne(() => RoleOrmEntity)
  @JoinColumn({ name: 'roleId' })
  role!: RoleOrmEntity;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime', nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime', nullable: true })
  updatedAt?: Date;

  @Column({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt?: Date;
}
