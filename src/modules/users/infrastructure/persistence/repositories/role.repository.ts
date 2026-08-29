import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleOrmEntity } from './../entities';
import { IRoleRepository } from './../../../domain/repositories';
import { RoleEntity } from './../../../domain/entities';
import { RoleMapper } from './../mappers';

/**
 * Implementación del Repositorio de Roles
 *
 * Implementa IRoleRepository usando TypeORM.
 * Esta es la implementación concreta del puerto definido en el dominio.
 */
@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepository: Repository<RoleOrmEntity>,
  ) {}

  /**
   * Busca un rol por su ID
   */
  async findById(id: string): Promise<RoleEntity | null> {
    const ormEntity = await this.roleRepository.findOne({
      where: { id },
    });

    return ormEntity ? RoleMapper.toDomain(ormEntity) : null;
  }

  /**
   * Busca un rol por su nombre
   */
  async findByName(name: string): Promise<RoleEntity | null> {
    const ormEntity = await this.roleRepository.findOne({
      where: { name },
    });

    return ormEntity ? RoleMapper.toDomain(ormEntity) : null;
  }

  /**
   * Obtiene todos los roles
   */
  async findAll(): Promise<RoleEntity[]> {
    const ormEntities = await this.roleRepository.find({
      order: { createdAt: 'ASC' },
    });

    return ormEntities.map((orm) => RoleMapper.toDomain(orm));
  }
}
