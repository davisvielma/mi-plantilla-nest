import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'token_blacklist' })
export class TokenBlacklistOrmEntity {
  @PrimaryColumn({ type: 'char', length: 36 })
  id!: string;

  @Column({ type: 'text', nullable: false })
  @Index()
  token!: string;

  @Column({ type: 'char', length: 36, nullable: false })
  userId!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  type!: 'access' | 'refresh';

  @Column({ type: 'datetime', nullable: false })
  expiresAt!: Date;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime', nullable: false })
  createdAt!: Date;
}
