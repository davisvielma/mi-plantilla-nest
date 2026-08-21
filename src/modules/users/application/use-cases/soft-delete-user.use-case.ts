import {
  ConflictException,
  NotFoundException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { MESSAGES } from '@/modules/shared/constants/messages.constant';

/**
 * ★ Caso de Uso: Soft Delete de Usuario
 *
 * Marca un usuario como eliminado (soft delete).
 * Solo accesible por administradores.
 */
@Injectable()
export class SoftDeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * ★ Ejecuta el caso de uso
   */
  async execute(id: string): Promise<{ message: string }> {
    // Verificar que el usuario existe
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }

    // Verificar que no esté ya eliminado
    if (user.isDeleted()) {
      throw new ConflictException('El usuario ya está eliminado');
    }

    // Ejecutar soft delete
    await this.userRepository.softDelete(id);

    return { message: MESSAGES.USER_DELETED };
  }
}
