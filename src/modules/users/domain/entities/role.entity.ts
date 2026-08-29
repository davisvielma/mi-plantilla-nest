import { ROLES } from '@/modules/shared/constants/roles.constant';
import { Entity } from '@/modules/shared/domain/base.entity';
import { IRole } from '../interfaces/role.interface';

/**
 * Entidad Role (Dominio)
 *
 * Representa un rol en el sistema con sus reglas de negocio.
 */
export class RoleEntity extends Entity<IRole> {
  private constructor(role: IRole) {
    super(role.id, role);
  }

  /**
   * Factory Method - Única forma de crear un RoleEntity
   */
  static create(role: IRole): RoleEntity {
    return new RoleEntity(role);
  }

  getName(): string {
    return this.props.name;
  }

  getCreatedAt(): Date {
    return this.props.createdAt;
  }

  isAdmin(): boolean {
    return this.props.name === ROLES.ADMIN;
  }

  isUser(): boolean {
    return this.props.name === ROLES.USER;
  }

  isSuperUser(): boolean {
    return this.props.name === ROLES.SUPER_USER;
  }
}
