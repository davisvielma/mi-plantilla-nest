import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { getDatabaseConfig } from './database.config';

/**
 * Modulo de Base de Datos
 *
 * Configura la conexion a TypeORM para la aplicacion NestJS.
 * Usa la configuracion compartida de database.config.ts.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const env = {
          DB_HOST: config.get<string>('DB_HOST'),
          DB_PORT: config.get<string>('DB_PORT'),
          DB_USERNAME: config.get<string>('DB_USERNAME'),
          DB_PASSWORD: config.get<string>('DB_PASSWORD'),
          DB_DATABASE: config.get<string>('DB_DATABASE'),
          NODE_ENV: config.get<string>('NODE_ENV'),
        };

        return getDatabaseConfig(env);
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
