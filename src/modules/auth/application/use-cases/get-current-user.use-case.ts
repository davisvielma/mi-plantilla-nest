import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '@/modules/users/domain/repositories';
import { MESSAGES } from '@/modules/shared/constants';
import { UserResponseDto } from '@/modules/users/application/dtos';
import { UserMapper } from '@/modules/users/infrastructure/persistence/mappers';

/**
 * Caso de Uso: Obtener Usuario Autenticado
 *
 * Obtiene la información actualizada del usuario autenticado a partir de su ID.
 */
@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * Ejecuta el caso de uso
   */
  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException(MESSAGES.TOKEN_INVALID);
    }

    return UserMapper.toResponse(user);
  }
}
