import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  USER_REPOSITORY,
  type IUserRepository,
  ROLE_REPOSITORY,
  type IRoleRepository,
} from '../../domain/repositories';
import { UpdateUserRoleDto } from '../dtos';
import { UserEntity } from '../../domain/entities';
import { MESSAGES } from '@/modules/shared/constants';

/**
 * Caso de Uso: Actualizar Rol de Usuario
 *
 * Cambia el rol de un usuario. Solo accesible por administradores.
 */
@Injectable()
export class UpdateUserRoleUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  /**
   * Ejecuta el caso de uso
   */
  async execute(id: string, dto: UpdateUserRoleDto): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }

    const role = await this.roleRepository.findById(dto.roleId);

    if (!role) {
      throw new InternalServerErrorException(MESSAGES.ROLE_NOT_FOUND);
    }

    user.updateRole(dto.roleId);

    const updatedUser = await this.userRepository.save(user);

    if (!updatedUser) {
      throw new InternalServerErrorException(
        'Error al cambiar el rol del usuario',
      );
    }

    return updatedUser;
  }
}
