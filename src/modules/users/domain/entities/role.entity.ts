import { ROLES } from '@/modules/shared/constants/roles.constant';
import { Entity } from '@/modules/shared/domain/base.entity';

export interface IRole {
  id: string;
  name: string;
  createdAt: Date;
}

export class RoleEntity extends Entity<IRole> {
  private constructor(role: IRole) {
    super(role.id, role);
  }

  get getName(): string {
    return this.props.name;
  }

  get getCreatedAt(): Date {
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
