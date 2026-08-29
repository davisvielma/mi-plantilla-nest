import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../domain/repositories';
import { UserEntity } from '../../domain/entities';
import { MESSAGES } from '@/modules/shared/constants';

/**
 * Caso de Uso: Buscar Usuario por ID
 *
 * Busca un usuario por su ID y retorna su información.
 */
@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * Ejecuta el caso de uso
   */
  async execute(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }
}
