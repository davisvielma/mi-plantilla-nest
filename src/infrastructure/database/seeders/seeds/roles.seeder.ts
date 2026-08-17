import { RoleOrmEntity } from '@/modules/users/infrastructure/persistence';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { v4 as uuid } from 'uuid';

/**
 * ★ Seeder para crear roles base del sistema
 *
 * Crea los roles mínimos necesarios para que la aplicación funcione:
 * - admin: Administrador del sistema
 * - user: Usuario regular
 *
 * Es idempotente: si los roles ya existen, no los duplica.
 */
export class RolesSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const roleRepo = dataSource.getRepository(RoleOrmEntity);

    const roles = [
      { id: uuid(), name: 'admin' },
      { id: uuid(), name: 'super-user' },
      { id: uuid(), name: 'user' },
    ];

    console.log('🌱 Sembrando roles...');

    let createdCount = 0;

    for (const role of roles) {
      const exists = await roleRepo.findOne({ where: { name: role.name } });
      if (!exists) {
        await roleRepo.save(role);
        createdCount++;
        console.log(`✅ Rol creado: ${role.name}`);
      } else {
        console.log(`ℹ️ Rol ya existe: ${role.name}`);
      }
    }

    console.log(
      `✅ Roles completados (${createdCount} creados, ${roles.length - createdCount} existentes)`,
    );
  }
}
