import { Entity } from '../../../shared/domain/base.entity';
import { v4 as uuid } from 'uuid';
import {
  IUser,
  ICreateUser,
  ICreateUserEntity,
} from '../interfaces/user.interface';
import { IRole } from '../interfaces';
import {
  EntityDeletedException,
  InvalidFormatException,
  RequiredFieldException,
} from '@/modules/shared';

export type { IUser, ICreateUser } from '../interfaces/user.interface';

/**
 * ★ Entidad User (Dominio)
 *
 * Representa un usuario en el sistema con sus reglas de negocio.
 * Única forma de crear un usuario es a través del factory method create().
 */
export class UserEntity extends Entity<IUser> {
  constructor(user: IUser) {
    super(user.id, user);
    this.validate();
  }

  private validate(): void {
    this.validateRequiredFields();
    this.validateEmail();
    this.validatePassword();
    this.validateName();
  }

  private validateRequiredFields(): void {
    if (!this.props.email || this.props.email.trim().length === 0) {
      throw new RequiredFieldException('El email es requerido');
    }

    if (!this.props.password || this.props.password.trim().length === 0) {
      throw new RequiredFieldException('La contraseña es requerida');
    }

    if (!this.props.fullName || this.props.fullName.trim().length === 0) {
      throw new RequiredFieldException('El nombre completo es requerido');
    }

    if (!this.props.roleId || this.props.roleId.trim().length === 0) {
      throw new RequiredFieldException('El rol es requerido');
    }
  }

  private validateEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.props.email)) {
      throw new InvalidFormatException('El formato del email es inválido');
    }
  }

  private validatePassword(): void {
    if (this.props.password.length < 8) {
      throw new InvalidFormatException(
        'La contraseña debe tener al menos 8 caracteres',
      );
    }
  }

  private validateName(): void {
    if (this.props.fullName.length < 3) {
      throw new InvalidFormatException(
        'El nombre completo debe tener al menos 3 caracteres',
      );
    }

    if (this.props.fullName.length > 255) {
      throw new InvalidFormatException(
        'El nombre completo no puede exceder los 255 caracteres',
      );
    }
  }

  // ★ Getters
  getFullName(): string {
    return this.props.fullName;
  }

  getEmail(): string {
    return this.props.email;
  }

  getPassword(): string {
    return this.props.password;
  }

  getRoleId(): string {
    return this.props.roleId;
  }

  getRole(): Omit<IRole, 'createdAt'> | undefined {
    return this.props.role;
  }

  getCreatedAt(): Date {
    return this.props.createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  getDeletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  /**
   * ★ Actualiza los datos del usuario (sin rol)
   */
  update(updateData: ICreateUser): void {
    const { email, fullName, password } = updateData;

    this.props.fullName = fullName;
    this.props.email = email;
    this.props.password = password;

    this.props.updatedAt = new Date();

    this.validate();
  }

  /**
   * ★ Actualiza el rol del usuario (solo admin)
   */
  updateRole(roleId: string): void {
    this.props.roleId = roleId;
    this.props.updatedAt = new Date();

    this.validate();
  }

  /**
   * ★ Soft delete - marca el usuario como eliminado
   */
  softDelete(): void {
    if (this.isDeleted()) {
      throw new EntityDeletedException('El usuario ya está eliminado');
    }

    this.props.deletedAt = new Date();
  }

  /**
   * ★ Verifica si el usuario está eliminado
   */
  isDeleted(): boolean {
    return !!this.props.deletedAt;
  }

  /**
   * ★ Factory Method - Única forma de crear un usuario
   */
  static create(user: ICreateUserEntity): UserEntity {
    return new UserEntity({
      id: uuid(),
      fullName: user.fullName.trim(),
      email: user.email.trim().toLowerCase(),
      password: user.password,
      roleId: user.roleId.trim(),
      createdAt: new Date(),
    });
  }
}
