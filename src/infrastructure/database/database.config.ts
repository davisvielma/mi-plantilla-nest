import { DataSourceOptions } from 'typeorm';
import { join } from 'path';
import {
  RoleOrmEntity,
  UserOrmEntity,
} from '@/modules/users/infrastructure/persistence/entities';
import { TokenBlacklistOrmEntity } from '@/modules/auth/infrastructure/persistence/entities';

/**
 * Configuracion compartida de base de datos
 *
 * Funcion pura que genera la configuracion de TypeORM.
 * Usada tanto por data-source.ts (CLI/migraciones) como por database.module.ts (app).
 */
export const getDatabaseConfig = (
  env: Record<string, string | undefined>,
): DataSourceOptions => {
  const isNeon = env.DB_HOST?.includes('neon.tech') ?? false;

  return {
    type: 'postgres',
    host: env.DB_HOST || 'localhost',
    port: parseInt(env.DB_PORT || '5432', 10),
    username: env.DB_USERNAME || 'postgres',
    password: env.DB_PASSWORD || 'postgres',
    database: env.DB_DATABASE || 'mi_proyecto_db',

    // NeonDB requiere SSL
    ssl: isNeon ? { rejectUnauthorized: false } : false,

    entities: [UserOrmEntity, RoleOrmEntity, TokenBlacklistOrmEntity],

    synchronize: false,
    logging: env.NODE_ENV === 'development',
  };
};

export const getMigrationsConfig = (
  env: Record<string, string | undefined>,
): DataSourceOptions => {
  const baseConfig = getDatabaseConfig(env);

  return {
    ...baseConfig,
    migrations: [join(__dirname, 'migrations', '**', '*{.ts,.js}')],
    migrationsTableName: 'migrations',
  };
};
