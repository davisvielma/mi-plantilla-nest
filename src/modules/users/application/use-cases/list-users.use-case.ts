import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../domain/repositories';
import { UserEntity } from '../../domain/entities';
import { QueryUsersDto } from '../dtos';
import { PageDto, PageMetaDto } from '@/modules/shared/dto';

/**
 * Caso de Uso: Listar Usuarios
 *
 * Obtiene usuarios paginados del sistema con filtros y ordenamiento.
 */
@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * Ejecuta el caso de uso
   */
  async execute(query: QueryUsersDto): Promise<PageDto<UserEntity>> {
    const { data, total } = await this.userRepository.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      order: query.order,
      filters: {
        email: query.email,
        roleId: query.roleId,
        fullName: query.fullName,
      },
    });

    const meta = new PageMetaDto(total, query.page, query.limit);
    return new PageDto(data, meta);
  }
}
