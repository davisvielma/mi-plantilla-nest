import { IRole } from './role.interface';

/**
 * Interfaz de Usuario
 *
 * Define la estructura de datos de un usuario en el dominio.
 */
export interface IUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  roleId: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  role?: Omit<IRole, 'createdAt'>;
}

/**
 * Interfaz para Actualizar Usuario
 *
 * Define los campos necesarios para actualizar un usuario.
 */
export interface IUpdateUser {
  email: string;
  fullName: string;
  password: string;
}

/**
 * Interfaz para Crear Usuario Entity (interno)
 *
 * Extiende IUpdateUser con el roleId para la entidad de dominio.
 */
export interface ICreateUserEntity extends IUpdateUser {
  roleId: string;
}
