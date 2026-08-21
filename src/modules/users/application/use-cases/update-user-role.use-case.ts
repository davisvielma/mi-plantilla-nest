import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { MESSAGES } from '@/modules/shared/constants/messages.constant';
import { UpdateUserRoleDto } from '../dtos/update-user-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleOrmEntity } from '../../infrastructure/persistence/entities';
import { Repository } from 'typeorm';

/**
 * ★ Caso de Uso: Actualizar Rol de Usuario
 *
 * Cambia el rol de un usuario. Solo accesible por administradores.
 */
@Injectable()
export class UpdateUserRoleUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepository: Repository<RoleOrmEntity>,
  ) {}

  /**
   * ★ Ejecuta el caso de uso
   */
  async execute(id: string, dto: UpdateUserRoleDto): Promise<UserEntity> {
    // Verificar que el usuario existe
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }

    const role = await this.roleRepository.findOne({
      where: { id: dto.roleId },
    });

    if (!role) {
      throw new InternalServerErrorException(MESSAGES.ROLE_NOT_FOUND);
    }

    // Actualizar rol
    user.updateRole(dto.roleId);

    // Guardar en repositorio
    const updatedUser = await this.userRepository.save(user);

    if (!updatedUser) {
      throw new InternalServerErrorException(
        'Error al cambiar el rol del usuario',
      );
    }

    return updatedUser;
  }
}
