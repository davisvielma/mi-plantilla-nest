import { v4 as uuid } from 'uuid';
import { IRole, IUser, IUpdateUser, ICreateUserEntity } from '../interfaces';
import { Email, Password } from '../value-objects';
import { Entity } from '@/modules/shared/domain';
import {
  EntityDeletedException,
  InvalidFormatException,
  RequiredFieldException,
} from '@/modules/shared/exceptions/exceptions';

/**
 * Entidad User (Dominio)
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
    this.validateName();
  }

  private validateRequiredFields(): void {
    if (!this.props.fullName || this.props.fullName.trim().length === 0) {
      throw new RequiredFieldException('El nombre completo es requerido');
    }

    if (!this.props.roleId || this.props.roleId.trim().length === 0) {
      throw new RequiredFieldException('El rol es requerido');
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

  // Getters
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
   * Actualiza los datos del usuario (sin rol)
   */
  update(updateData: IUpdateUser): void {
    const email = Email.create(updateData.email);
    const password = Password.create(updateData.password);

    this.props.fullName = updateData.fullName;
    this.props.email = email.value;
    this.props.password = password.value;

    this.props.updatedAt = new Date();

    this.validate();
  }

  /**
   * Actualiza el rol del usuario (solo admin)
   */
  updateRole(roleId: string): void {
    this.props.roleId = roleId;
    this.props.updatedAt = new Date();

    this.validate();
  }

  /**
   * Soft delete - marca el usuario como eliminado
   */
  softDelete(): void {
    if (this.isDeleted()) {
      throw new EntityDeletedException('El usuario ya está eliminado');
    }

    this.props.deletedAt = new Date();
  }

  /**
   * Verifica si el usuario está eliminado
   */
  isDeleted(): boolean {
    return !!this.props.deletedAt;
  }

  /**
   * Factory Method - Única forma de crear un usuario
   */
  static create(user: ICreateUserEntity): UserEntity {
    const email = Email.create(user.email);
    const password = Password.create(user.password);

    return new UserEntity({
      id: uuid(),
      fullName: user.fullName.trim(),
      email: email.value,
      password: password.value,
      roleId: user.roleId.trim(),
      createdAt: new Date(),
    });
  }
}
