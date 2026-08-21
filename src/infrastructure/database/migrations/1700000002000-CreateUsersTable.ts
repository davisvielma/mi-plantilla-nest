import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1700000002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS users (
                id CHAR(36) PRIMARY KEY,
                fullName VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                roleId CHAR(36) NOT NULL,
                createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
                deletedAt DATETIME DEFAULT NULL,
                CONSTRAINT FK_USER_ROLE FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE RESTRICT
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
  }
}
