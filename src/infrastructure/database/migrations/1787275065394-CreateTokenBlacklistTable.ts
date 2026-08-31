import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTokenBlacklistTable1787275065394 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS token_blacklist (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        token TEXT NOT NULL,
        "userId" UUID NOT NULL,
        type VARCHAR(20) NOT NULL,
        "expiresAt" TIMESTAMPTZ NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT FK_token_blacklist_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IDX_token_blacklist_token ON token_blacklist (token)
    `);

    await queryRunner.query(`
      CREATE INDEX IDX_token_blacklist_userId ON token_blacklist ("userId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS IDX_token_blacklist_token`);
    await queryRunner.query(`DROP INDEX IF EXISTS IDX_token_blacklist_userId`);
    await queryRunner.query(`DROP TABLE IF EXISTS token_blacklist`);
  }
}
