import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import {
  UserOrmEntity,
  RoleOrmEntity,
} from '@/modules/users/infrastructure/persistence/entities';
import { TokenBlacklistOrmEntity } from '@/modules/auth/infrastructure/persistence/entities';

/**
 * Módulo de Base de Datos
 *
 * Configura la conexión a TypeORM para la aplicación NestJS.
 * Este módulo es separado de data-source.ts (que se usa para CLI/migraciones).
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', 'rootpassword'),
        database: config.get<string>('DB_DATABASE', 'mi_proyecto_db'),
        entities: [UserOrmEntity, RoleOrmEntity, TokenBlacklistOrmEntity],
        synchronize: false,
        logging: config.get<string>('NODE_ENV') === 'development',
        timezone: 'Z',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
