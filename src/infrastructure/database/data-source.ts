import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { SeederOptions } from 'typeorm-extension';
import { MainSeeder } from './seeders/main.seeder';
import {
  RoleOrmEntity,
  UserOrmEntity,
} from '@/modules/users/infrastructure/persistence';
import { config } from 'dotenv';

config({ path: join(process.cwd(), '.env') });

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_DATABASE || 'mi_proyecto_db',
  timezone: 'Z',
  dateStrings: ['DATE'],

  entities: [UserOrmEntity, RoleOrmEntity],

  migrations: [join(__dirname, 'migrations', '**', '*{.ts,.js}')],
  migrationsTableName: 'migrations',

  seeds: [MainSeeder],
  factories: [join(__dirname, 'factories', '**', '*{.ts,.js}')],

  // Logging
  logging: process.env.NODE_ENV === 'development',

  // IMPORTANT: Never use synchronize in production
  synchronize: false,
};

// Crear y exportar el DataSource
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
