import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { RoleOrmEntity } from '.';

@Entity({ name: 'users' })
export class UserOrmEntity {
  @PrimaryColumn({ type: 'char', length: 36 })
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  fullName!: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password!: string;

  @Column({
    type: 'char',
    length: 36,
    nullable: false,
  })
  roleId!: string;

  @ManyToOne(() => RoleOrmEntity)
  @JoinColumn({ name: 'roleId' })
  role?: RoleOrmEntity;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime', nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime', nullable: true })
  updatedAt?: Date;

  @Column({ name: 'deletedAt', type: 'datetime', nullable: true })
  deletedAt?: Date;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
    this.fullName = this.fullName.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.email = this.email.toLowerCase().trim();
    this.fullName = this.fullName.toLowerCase().trim();
  }
}
