import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';

/**
 * Caso de Uso: Listar Usuarios
 *
 * Obtiene todos los usuarios del sistema.
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
  async execute(): Promise<UserEntity[]> {
    return await this.userRepository.findAll();
  }
}
