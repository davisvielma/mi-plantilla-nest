import { RoleOrmEntity } from './../entities';
import { RoleEntity } from '../../../domain/entities';

/**
 * Mapper: Dominio ↔ Persistencia (Roles)
 *
 * Convierte entre entidades de dominio y entidades ORM.
 * Métodos estáticos para facilitar el uso sin instanciación.
 */
export class RoleMapper {
  /**
   * Convierte una entidad ORM a entidad de dominio
   */
  static toDomain(ormEntity: RoleOrmEntity): RoleEntity {
    return RoleEntity.create({
      id: ormEntity.id,
      name: ormEntity.name,
      createdAt: ormEntity.createdAt,
    });
  }

  /**
   * Convierte una entidad de dominio a entidad ORM
   */
  static toPersistence(domainEntity: RoleEntity): RoleOrmEntity {
    const entity = new RoleOrmEntity();
    entity.id = domainEntity.getId();
    entity.name = domainEntity.getName();
    entity.createdAt = domainEntity.getCreatedAt();
    return entity;
  }
}
