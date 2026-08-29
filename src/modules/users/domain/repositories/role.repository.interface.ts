import { RoleEntity } from '../entities';

/**
 * Puerto: Repositorio de Roles
 *
 * Define las operaciones que debe implementar la infraestructura.
 */
export interface IRoleRepository {
  /**
   * Busca un rol por su ID
   */
  findById(id: string): Promise<RoleEntity | null>;

  /**
   * Busca un rol por su nombre
   */
  findByName(name: string): Promise<RoleEntity | null>;

  /**
   * Obtiene todos los roles
   */
  findAll(): Promise<RoleEntity[]>;
}

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');
