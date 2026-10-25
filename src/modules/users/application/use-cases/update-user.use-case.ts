import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../domain/repositories';
import { UserEntity } from '../../domain/entities';
import { UpdateUserDto } from '../dtos';
import { MESSAGES } from '@/modules/shared/constants';

/**
 * Caso de Uso: Actualizar Usuario
 *
 * Actualiza los datos de un usuario (fullName, email).
 * No permite cambiar el rol - para eso está UpdateUserRoleUseCase.
 * No permite cambiar la contraseña - para eso está UpdateUserPasswordUseCase.
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
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }

    if (user.getId() !== currentUserId) {
      throw new ForbiddenException(
        'No tienes permiso para actualizar este usuario',
      );
    }

    if (dto.email && dto.email !== user.getEmail()) {
      const exists = await this.userRepository.existsByEmail(dto.email);
      if (exists) {
        throw new ConflictException(MESSAGES.USER_ALREADY_EXISTS);
      }
    }

    // Actualizar entidad de dominio
    user.update({
      email: dto.email || user.getEmail(),
      fullName: dto.fullName || user.getFullName(),
    });

    const updatedUser = await this.userRepository.save(user);

    if (!updatedUser) {
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }

    return updatedUser;
  }
}
