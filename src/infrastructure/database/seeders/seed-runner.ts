import 'tsconfig-paths/register';
import { runSeeders } from 'typeorm-extension';
import dataSource from '../data-source';

/**
 * Script para ejecutar seeders desde la línea de comandos
 *
 * Uso: npm run seed:run
 */
async function runSeeding() {
  console.log('🚀 Ejecutando seeders desde CLI...');

  try {
    // Inicializar la conexión
    await dataSource.initialize();
    console.log('📦 Conectado a la base de datos');

    // Ejecutar el seeder principal
    await runSeeders(dataSource);

    // Cerrar conexión
    await dataSource.destroy();
    console.log('🔌 Conexión cerrada');
    console.log('✅ Seeders ejecutados correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando seeders:', error);
    process.exit(1);
  }
}

runSeeding();
