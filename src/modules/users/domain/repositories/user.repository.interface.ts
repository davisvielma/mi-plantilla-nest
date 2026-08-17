import { UserEntity } from '../entities/user.entity';

/**
 * ★ Puerto: Repositorio de Usuarios
 *
 * Define las operaciones que debe implementar la infraestructura.
 */
export interface IUserRepository {
  /**
   * ★ Guarda un usuario (crea o actualiza)
   */
  save(user: UserEntity): Promise<UserEntity>;

  /**
   * ★ Busca un usuario por su ID
   */
  findById(id: string): Promise<UserEntity | null>;

  /**
   * ★ Busca un usuario por su email
   */
  findByEmail(email: string): Promise<UserEntity | null>;

  /**
   * ★ Obtiene todos los usuarios
   */
  findAll(): Promise<UserEntity[]>;

  /**
   * ★ Elimina un usuario (hard delete)
   */
  delete(id: string): Promise<void>;

  /**
   * ★ Verifica si existe un usuario con un email
   */
  existsByEmail(email: string): Promise<boolean>;

  /**
   * ★ Obtiene usuarios por rol
   */
  findByRole(roleId: string): Promise<UserEntity[]>;

  /**
   * ★ Obtiene usuarios eliminados (soft delete)
   */
  findDeleted(): Promise<UserEntity[]>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
