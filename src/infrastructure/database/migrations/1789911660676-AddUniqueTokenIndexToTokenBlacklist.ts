import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueTokenIndexToTokenBlacklist1789911660676 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Eliminar tokens duplicados, conservando el más reciente de cada token
    await queryRunner.query(
      `DELETE FROM token_blacklist
        WHERE id NOT IN (
          SELECT DISTINCT ON (token) id
          FROM token_blacklist
          ORDER BY token, "createdAt" ASC
        )`,
    );

    await queryRunner.query(`DROP INDEX IF EXISTS IDX_token_blacklist_token`);

    await queryRunner.query(
      `CREATE UNIQUE INDEX IDX_token_blacklist_token_unique ON token_blacklist (token)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS IDX_token_blacklist_token_unique`,
    );

    await queryRunner.query(
      `CREATE INDEX IDX_token_blacklist_token ON token_blacklist (token)`,
    );
  }
}
