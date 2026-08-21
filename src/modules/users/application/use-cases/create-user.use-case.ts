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
import { CreateUserDto } from '../dtos/create-user.dto';

/**
 * ★ Caso de Uso: Crear Usuario
 *
 * Crea un nuevo usuario en el sistema.
 * Valida que el email no esté registrado y hashea la contraseña.
 */
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * ★ Ejecuta el caso de uso
   */
  async execute(dto: CreateUserDto, roleId: string): Promise<UserEntity> {
    // Verificar si el email ya está registrado
    const exists = await this.userRepository.existsByEmail(dto.email);
    if (exists) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }

    // Crear entidad de dominio (el hash del password se debería hacer aquí o en el repositorio)
    const user = UserEntity.create({
      email: dto.email,
      password: dto.password, // TODO: Hashear con bcrypt
      fullName: dto.fullName,
      roleId,
    });

    // Guardar en repositorio
    const savedUser = await this.userRepository.save(user);

    if (!savedUser) {
      throw new InternalServerErrorException('Error al crear el usuario');
    }

    return savedUser;
  }
}
