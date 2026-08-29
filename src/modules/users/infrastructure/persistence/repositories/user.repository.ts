import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { UserOrmEntity } from './../entities';
import {
  IUserRepository,
  FindAllOptions,
  PaginatedResult,
} from './../../../domain/repositories';
import { UserEntity } from './../../../domain/entities';
import { UserMapper } from './../mappers';

/**
 * Implementación del Repositorio de Usuarios
 *
 * Implementa IUserRepository usando TypeORM.
 * Esta es la implementación concreta del puerto definido en el dominio.
 */
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {}

  /**
   * Guarda un usuario (crea o actualiza)
   */
  async save(user: UserEntity): Promise<UserEntity | null> {
    const ormEntity = UserMapper.toPersistence(user);
    const savedOrm = await this.userRepository.save(ormEntity);

    return await this.findById(savedOrm.id);
  }

  /**
   * Busca un usuario por su ID (excluye eliminados)
   */
  async findById(id: string): Promise<UserEntity | null> {
    const ormEntity = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: { role: true },
    });

    return ormEntity ? UserMapper.toDomain(ormEntity) : null;
  }

  /**
   * Busca un usuario por su email (excluye eliminados)
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    const ormEntity = await this.userRepository.findOne({
      where: { email: email.toLowerCase(), deletedAt: IsNull() },
      relations: { role: true },
    });

    return ormEntity ? UserMapper.toDomain(ormEntity) : null;
  }

  /**
   * Obtiene todos los usuarios con paginación y filtros (excluye eliminados)
   */
  async findAll(options: FindAllOptions): Promise<PaginatedResult<UserEntity>> {
    const { page, limit, sort, order, filters } = options;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.deletedAt IS NULL');

    // Aplicar filtros
    if (filters?.email) {
      queryBuilder.andWhere('user.email LIKE :email', {
        email: `%${filters.email.toLowerCase()}%`,
      });
    }

    if (filters?.roleId) {
      queryBuilder.andWhere('user.roleId = :roleId', {
        roleId: filters.roleId,
      });
    }

    if (filters?.fullName) {
      queryBuilder.andWhere('user.fullName LIKE :fullName', {
        fullName: `%${filters.fullName}%`,
      });
    }

    // Aplicar ordenamiento
    const validSortFields = ['createdAt', 'updatedAt', 'email', 'fullName'];
    const sortField = validSortFields.includes(sort) ? sort : 'createdAt';
    queryBuilder.orderBy(`user.${sortField}`, order);

    // Aplicar paginación
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [ormEntities, total] = await queryBuilder.getManyAndCount();
    const data = ormEntities.map((orm) => UserMapper.toDomain(orm));

    return { data, total };
  }

  /**
   * Soft delete - marca el usuario como eliminado
   */
  async softDelete(id: string): Promise<void> {
    await this.userRepository.update(
      { id, deletedAt: IsNull() },
      { deletedAt: new Date() },
    );
  }

  /**
   * Verifica si existe un usuario con un email (excluye eliminados)
   */
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { email: email.toLowerCase() },
    });
    return count > 0;
  }

  /**
   * Obtiene usuarios por rol (excluye eliminados)
   */
  async findByRole(roleId: string): Promise<UserEntity[]> {
    const ormEntities = await this.userRepository.find({
      where: { roleId, deletedAt: IsNull() },
      relations: { role: true },
    });

    return ormEntities.map((orm) => UserMapper.toDomain(orm));
  }

  /**
   * Obtiene usuarios eliminados (soft delete)
   */
  async findDeleted(): Promise<UserEntity[]> {
    const ormEntities = await this.userRepository.find({
      where: { deletedAt: Not(IsNull()) },
      relations: { role: true },
    });

    return ormEntities.map((orm) => UserMapper.toDomain(orm));
  }
}
