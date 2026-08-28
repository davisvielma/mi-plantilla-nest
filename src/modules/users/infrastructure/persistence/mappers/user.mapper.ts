import { UserEntity } from './../../../domain/entities';
import { UserOrmEntity } from './../entities';

/**
 * Mapper: Dominio ↔ Persistencia
 *
 * Convierte entre entidades de dominio y entidades ORM.
 * Métodos estáticos para facilitar el uso sin instanciación.
 */
export class UserMapper {
  /**
   * Convierte una entidad ORM a entidad de dominio
   */
  static toDomain(ormEntity: UserOrmEntity): UserEntity {
    return new UserEntity({
      id: ormEntity.id,
      email: ormEntity.email,
      password: ormEntity.password,
      fullName: ormEntity.fullName,
      roleId: ormEntity.roleId,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
      deletedAt: ormEntity.deletedAt,
      role: ormEntity.role
        ? {
            id: ormEntity.role.id,
            name: ormEntity.role.name,
          }
        : undefined,
    });
  }

  /**
   * Convierte una entidad de dominio a entidad ORM
   */
  static toPersistence(domainEntity: UserEntity): UserOrmEntity {
    const entity = new UserOrmEntity();
    entity.id = domainEntity.getId();
    entity.email = domainEntity.getEmail();
    entity.password = domainEntity.getPassword();
    entity.fullName = domainEntity.getFullName();
    entity.roleId = domainEntity.getRoleId();
    entity.createdAt = domainEntity.getCreatedAt();
    entity.updatedAt = domainEntity.getUpdatedAt();
    entity.deletedAt = domainEntity.getDeletedAt();
    return entity;
  }
}
