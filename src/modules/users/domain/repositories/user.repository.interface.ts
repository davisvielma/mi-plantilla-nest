import { UserEntity } from '../entities';

/**
 * Opciones de paginación para el repositorio
 */
export interface FindAllOptions {
  page: number;
  limit: number;
  sort: string;
  order: 'ASC' | 'DESC';
  filters?: {
    email?: string;
    roleId?: string;
    fullName?: string;
  };
}

/**
 * Resultado paginado del repositorio
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

/**
 * Puerto: Repositorio de Usuarios
 *
 * Define las operaciones que debe implementar la infraestructura.
 */
export interface IUserRepository {
  /**
   * Guarda un usuario (crea o actualiza)
   */
  save(user: UserEntity): Promise<UserEntity | null>;

  /**
   * Busca un usuario por su ID
   */
  findById(id: string): Promise<UserEntity | null>;

  /**
   * Busca un usuario por su email
   */
  findByEmail(email: string): Promise<UserEntity | null>;

  /**
   * Obtiene todos los usuarios con paginación y filtros
   */
  findAll(options: FindAllOptions): Promise<PaginatedResult<UserEntity>>;

  /**
   * Elimina un usuario (soft delete)
   */
  softDelete(id: string): Promise<void>;

  /**
   * Verifica si existe un usuario con un email
   */
  existsByEmail(email: string): Promise<boolean>;

  /**
   * Obtiene usuarios por rol
   */
  findByRole(roleId: string): Promise<UserEntity[]>;

  /**
   * Obtiene usuarios eliminados (soft delete)
   */
  findDeleted(): Promise<UserEntity[]>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
