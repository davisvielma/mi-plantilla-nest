import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRolesTable1700000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id CHAR(36) PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE,
                createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS roles`);
  }
}
