import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';

import { MESSAGES } from '@/modules/shared/constants/messages.constant';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { hashPassword } from '@/modules/shared';

/**
 * Caso de Uso: Actualizar Usuario
 *
 * Actualiza los datos de un usuario (name, email, password).
 * No permite cambiar el rol - para eso está UpdateUserRoleUseCase.
 */
@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * Ejecuta el caso de uso
   */
  async execute(
    id: string,
    dto: UpdateUserDto,
    currentUserId: string,
  ): Promise<UserEntity> {
    // Verificar que el usuario existe
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }

    // Verificar que el usuario solo puede actualizar su propio perfil
    if (user.getId() !== currentUserId) {
      throw new ConflictException(
        'No tienes permiso para actualizar este usuario',
      );
    }

    // Verificar si el email ya está registrado (si se está cambiando)
    if (dto.email && dto.email !== user.getEmail()) {
      const exists = await this.userRepository.existsByEmail(dto.email);
      if (exists) {
        throw new ConflictException(MESSAGES.USER_ALREADY_EXISTS);
      }
    }

    const hashedPassword = dto.password
      ? await hashPassword(dto.password)
      : user.getPassword();

    // Actualizar entidad de dominio
    user.update({
      email: dto.email || user.getEmail(),
      fullName: dto.fullName || user.getFullName(),
      password: hashedPassword,
    });

    // Guardar en repositorio
    const updatedUser = await this.userRepository.save(user);

    if (!updatedUser) {
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }

    return updatedUser;
  }
}
