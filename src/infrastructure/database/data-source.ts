import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { SeederOptions } from 'typeorm-extension';
import { MainSeeder } from './seeders';
import { getMigrationsConfig } from './database.config';
import { config } from 'dotenv';

config({ path: join(process.cwd(), '.env') });

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  ...getMigrationsConfig(process.env),

  seeds: [MainSeeder],
  factories: [join(__dirname, 'factories', '**', '*{.ts,.js}')],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
