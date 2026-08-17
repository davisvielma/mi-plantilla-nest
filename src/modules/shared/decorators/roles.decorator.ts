import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';

export const ROLES_KEY = 'roles';

/**
 * ★ Decorador para definir qué roles tienen acceso a una ruta
 *
 * @example
 * @Roles('admin')
 * @Delete(':id')
 * async deleteUser() { ... }
 *
 * @example
 * @Roles('admin', 'manager')
 * @Patch(':id')
 * async updateUser() { ... }
 */
export const Roles = (...roles: ValidRoles[]) => SetMetadata(ROLES_KEY, roles);
