import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'token_blacklist' })
export class TokenBlacklistOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'text', nullable: false })
  @Index()
  token!: string;

  @Column({ type: 'uuid', nullable: false })
  userId!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  type!: 'access' | 'refresh';

  @Column({ type: 'timestamptz', nullable: false })
  expiresAt!: Date;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamptz', nullable: false })
  createdAt!: Date;
}
