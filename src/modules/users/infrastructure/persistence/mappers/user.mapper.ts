import { UserEntity } from './../../../domain/entities';
import { UserOrmEntity } from './../entities';
import { UserResponseDto } from '../../../application/dtos';

/**
 * Mapper: Dominio ↔ Persistencia ↔ Respuesta
 *
 * Convierte entre entidades de dominio, entidades ORM y DTOs de respuesta.
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

  /**
   * Convierte una entidad de dominio a DTO de respuesta
   *
   * Excluye sensible data como password.
   */
  static toResponse(entity: UserEntity): UserResponseDto {
    return {
      id: entity.getId(),
      email: entity.getEmail(),
      fullName: entity.getFullName(),
      roleId: entity.getRoleId(),
      role: entity.getRole(),
      createdAt: entity.getCreatedAt(),
      updatedAt: entity.getUpdatedAt(),
    };
  }

  /**
   * Convierte un array de entidades de dominio a DTOs de respuesta
   */
  static toResponseList(entities: UserEntity[]): UserResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
