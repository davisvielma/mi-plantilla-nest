import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import {
  RoleOrmEntity,
  UserOrmEntity,
} from '@/modules/users/infrastructure/persistence';

/**
 * ★ Seeder para crear el usuario administrador
 *
 * Crea el usuario administrador usando variables de entorno:
 * - ADMIN_EMAIL: Email del administrador
 * - ADMIN_PASSWORD: Contraseña del administrador
 *
 * Es idempotente: si el admin ya existe, no lo duplica.
 */
export class UsersSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepo = dataSource.getRepository(UserOrmEntity);
    const roleRepo = dataSource.getRepository(RoleOrmEntity);

    // ★ Obtener variables de entorno
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

    console.log('🌱 Sembrando usuario administrador...');

    // ★ Buscar rol admin
    const adminRole = await roleRepo.findOne({ where: { name: 'admin' } });

    if (!adminRole) {
      console.warn('⚠️ Rol admin no encontrado. No se crea usuario admin.');
      return;
    }

    // ★ Verificar si el admin ya existe
    const existingAdmin = await userRepo.findOne({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log(`ℹ️ Usuario admin ya existe: ${adminEmail}`);
      return;
    }

    // ★ Hashear contraseña
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // ★ Crear usuario admin
    await userRepo.save({
      id: uuid(),
      email: adminEmail,
      password: hashedPassword,
      name: 'Fortlexus Admin',
      roleId: adminRole.id,
    });

    console.log(`✅ Usuario admin creado: ${adminEmail}`);
  }
}
