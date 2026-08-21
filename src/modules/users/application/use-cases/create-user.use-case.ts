import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { MESSAGES } from '@/modules/shared/constants/messages.constant';
import { CreateUserDto } from '../dtos/create-user.dto';
import { hashPassword } from '@/modules/shared';
import { RoleOrmEntity } from '../../infrastructure/persistence/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepository: Repository<RoleOrmEntity>,
  ) {}

  /**
   * ★ Ejecuta el caso de uso
   */
  async execute(dto: CreateUserDto): Promise<UserEntity> {
    // Verificar si el email ya está registrado
    const exists = await this.userRepository.existsByEmail(dto.email);
    if (exists) {
      throw new ConflictException(MESSAGES.USER_ALREADY_EXISTS);
    }

    const role = await this.roleRepository.findOne({
      where: { id: dto.roleId },
    });

    if (!role) {
      throw new InternalServerErrorException(MESSAGES.ROLE_NOT_FOUND);
    }

    const hashedPassword = await hashPassword(dto.password);

    const user = UserEntity.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      roleId: role.id,
    });

    // Guardar en repositorio
    const savedUser = await this.userRepository.save(user);

    if (!savedUser) {
      throw new InternalServerErrorException('Error al crear el usuario');
    }

    return savedUser;
  }
}
