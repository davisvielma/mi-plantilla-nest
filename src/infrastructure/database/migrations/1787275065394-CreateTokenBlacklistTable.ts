import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTokenBlacklistTable1787275065394 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS token_blacklist (
        id CHAR(36) PRIMARY KEY,
        token TEXT NOT NULL,
        userId CHAR(36) NOT NULL,
        type VARCHAR(20) NOT NULL,
        expiresAt DATETIME NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT FK_token_blacklist_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IDX_token_blacklist_token ON token_blacklist (token(255))
    `);

    await queryRunner.query(`
      CREATE INDEX IDX_token_blacklist_userId ON token_blacklist (userId)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IDX_token_blacklist_token ON token_blacklist`,
    );
    await queryRunner.query(
      `DROP INDEX IDX_token_blacklist_userId ON token_blacklist`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS token_blacklist`);
  }
}
