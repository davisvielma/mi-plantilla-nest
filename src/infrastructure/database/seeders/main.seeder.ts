import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { RolesSeeder, UsersSeeder } from './seeds';

/**
 * Seeder principal que orquesta todos los seeders
 *
 * Este es el punto de entrada que ejecuta los seeders en el orden correcto.
 *
 * Orden de ejecución:
 * 1. RolesSeeder - Crea roles base (admin, user)
 * 2. AdminUserSeeder - Crea usuario administrador (usando variables de entorno)
 */
export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('🚀 Iniciando ejecución de seeders...');

    // 1. Ejecutar seeders base (roles + admin)
    await new RolesSeeder().run(dataSource);
    await new UsersSeeder().run(dataSource);

    // 2. Si estamos en desarrollo, ejecutar seeders de prueba
    if (process.env.NODE_ENV === 'development') {
      console.log('🧪 Ejecutando seeders de desarrollo...');
      // Aquí irían seeders de prueba (productos, categorías, etc.)
      // await new ProductsSeeder().run(dataSource, factoryManager);
      // await new CategoriesSeeder().run(dataSource, factoryManager);
    }

    console.log('✅ Todos los seeders completados exitosamente');
  }
}
