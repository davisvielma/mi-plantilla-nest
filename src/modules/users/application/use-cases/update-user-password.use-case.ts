import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../../domain/repositories';
import { UpdateUserPasswordDto } from '../dtos';
import { UserEntity } from '../../domain/entities';
import { MESSAGES } from '@/modules/shared/constants';
import { comparePasswords, hashPassword } from '@/modules/shared/utils';

/**
 * Caso de Uso: Actualizar contraseña del usuario
 *
 * Cambia la contraseña del usuario autenticado.
 * Exige la contraseña actual como verificación y rechaza reutilizarla.
 */
@Injectable()
export class UpdateUserPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * Ejecuta el caso de uso
   */
  async execute(
    dto: UpdateUserPasswordDto,
    currentUserId: string,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findById(currentUserId);
    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }

    const isCurrentPasswordValid = await comparePasswords(
      dto.currentPassword,
      user.getPassword(),
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException(MESSAGES.CURRENT_PASSWORD_INVALID);
    }

    // Se compara contra el hash para cubrir el truncamiento de bcrypt
    const isSamePassword = await comparePasswords(
      dto.newPassword,
      user.getPassword(),
    );

    if (isSamePassword) {
      throw new BadRequestException(MESSAGES.PASSWORD_SAME_AS_CURRENT);
    }

    const hashedPassword = await hashPassword(dto.newPassword);

    user.updatePassword(hashedPassword);

    const updatedUser = await this.userRepository.save(user);

    if (!updatedUser) {
      throw new InternalServerErrorException(
        'Error al cambiar la contraseña del usuario',
      );
    }

    return updatedUser;
  }
}
