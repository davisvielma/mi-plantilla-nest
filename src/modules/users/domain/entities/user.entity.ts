import { Entity } from '../../../shared/domain/base.entity';
import { IRole } from './role.entity';
import { ValidationException } from '../../../shared/exceptions/exceptions/validation.exception';
import { BusinessException } from '@/modules/shared/exceptions/exceptions';
import { v4 as uuid } from 'uuid';

/**
 * ★ Propiedades del User
 */
export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  roleId: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  role?: IRole;
}

export interface ICreateUser {
  email: string;
  password: string;
  name: string;
}

interface ICreateUserEntity extends ICreateUser {
  roleId: string;
}

/**
 * ★ Entidad User (Dominio)
 */
export class UserEntity extends Entity<IUser> {
  private constructor(user: IUser) {
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
      throw new ValidationException('El email es requerido', 'EMAIL_REQUIRED');
    }

    if (!this.props.password || this.props.password.trim().length === 0) {
      throw new ValidationException(
        'La contraseña es requerida',
        'PASSWORD_REQUIRED',
      );
    }

    if (!this.props.name || this.props.name.trim().length === 0) {
      throw new ValidationException('El nombre es requerido', 'NAME_REQUIRED');
    }

    if (!this.props.roleId || this.props.roleId.trim().length === 0) {
      throw new ValidationException('El rol es requerido', 'ROLE_ID_REQUIRED');
    }
  }

  private validateEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.props.email)) {
      throw new ValidationException(
        'El formato del email es inválido',
        'INVALID_EMAIL',
      );
    }
  }

  private validatePassword(): void {
    if (this.props.password.length < 8) {
      throw new ValidationException(
        'La contraseña debe tener al menos 8 caracteres',
        'PASSWORD_TOO_SHORT',
      );
    }
  }

  private validateName(): void {
    if (this.props.name.length < 3) {
      throw new ValidationException(
        'El nombre debe tener al menos 3 caracteres',
        'INVALID_NAME',
      );
    }

    if (this.props.name.length > 255) {
      throw new ValidationException(
        'El nombre no puede exceder los 255 caracteres',
        'NAME_TOO_LONG',
      );
    }
  }

  // ★ Getters
  get getName(): string {
    return this.props.name;
  }

  get getEmail(): string {
    return this.props.email;
  }

  get getPassword(): string {
    return this.props.password;
  }

  get getRoleId(): string {
    return this.props.roleId;
  }

  get getRole(): IRole | undefined {
    return this.props.role;
  }

  get getCreatedAt(): Date {
    return this.props.createdAt;
  }

  get getUpdatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get getDeletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  update(updateData: ICreateUser): void {
    const { email, name, password } = updateData;

    this.props.name = name;
    this.props.email = email;
    this.props.password = password;

    this.props.updatedAt = new Date();

    this.validate();
  }

  delete(): void {
    if (this.isDeleted()) {
      throw new BusinessException(
        'El usuario ya está eliminado',
        'DELETED_CONFLICT',
      );
    }

    this.props.deletedAt = new Date();
  }

  isDeleted(): boolean {
    return !!this.props.deletedAt;
  }

  /**
   * ★ Factory Method - Única forma de crear un usuario
   */
  static create(user: ICreateUserEntity): UserEntity {
    return new UserEntity({
      id: uuid(),
      name: user.name.trim(),
      email: user.email.trim(),
      password: user.password,
      roleId: user.roleId.trim(),
      createdAt: new Date(),
    });
  }
}
