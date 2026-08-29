import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { ROLE_REPOSITORY } from '../../domain/repositories/role.repository.interface';
import type { IRoleRepository } from '../../domain/repositories/role.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { MESSAGES } from '@/modules/shared/constants/messages.constant';
import { CreateUserDto } from '../dtos/create-user.dto';
import { hashPassword } from '@/modules/shared';

/**
 * Caso de Uso: Crear Usuario
 *
 * Crea un nuevo usuario en el sistema.
 * Valida que el email no esté registrado y hashea la contraseña.
 */
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  /**
   * Ejecuta el caso de uso
   */
  async execute(dto: CreateUserDto): Promise<UserEntity> {
    const exists = await this.userRepository.existsByEmail(dto.email);
    if (exists) {
      throw new ConflictException(MESSAGES.USER_ALREADY_EXISTS);
    }

    const role = await this.roleRepository.findById(dto.roleId);

    if (!role) {
      throw new NotFoundException(MESSAGES.ROLE_NOT_FOUND);
    }

    const hashedPassword = await hashPassword(dto.password);

    const user = UserEntity.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      roleId: role.getId(),
    });

    const savedUser = await this.userRepository.save(user);

    if (!savedUser) {
      throw new InternalServerErrorException('Error al crear el usuario');
    }

    return savedUser;
  }
}
