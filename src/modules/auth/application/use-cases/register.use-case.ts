import {
  Inject,
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { USER_REPOSITORY } from '@/modules/users/domain/repositories';
import type { IUserRepository } from '@/modules/users/domain/repositories';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { RoleOrmEntity } from '@/modules/users/infrastructure/persistence/entities';
import { MESSAGES } from '@/modules/shared/constants/messages.constant';
import { ROLES } from '@/modules/shared/constants/roles.constant';
import { RegisterDto, AuthResponseDto } from '../dtos';
import { hashPassword, JwtPayload } from '@/modules/shared';
import type { StringValue } from 'ms';

/**
 * ★ Caso de Uso: Registro de Usuario
 *
 * Registra un nuevo usuario con rol por defecto (user).
 * Retorna access token y refresh token.
 */
@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepository: Repository<RoleOrmEntity>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * ★ Ejecuta el caso de uso
   */
  async execute(dto: RegisterDto): Promise<AuthResponseDto> {
    const exists = await this.userRepository.existsByEmail(dto.email);
    if (exists) {
      throw new ConflictException(MESSAGES.USER_ALREADY_EXISTS);
    }

    const role = await this.roleRepository.findOne({
      where: { name: ROLES.USER },
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

    const savedUser = await this.userRepository.save(user);

    if (!savedUser) {
      throw new InternalServerErrorException('Error al crear el usuario');
    }

    const payload: JwtPayload = {
      sub: savedUser.getId(),
      email: savedUser.getEmail(),
      role: savedUser.getRole()?.name || ROLES.USER,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as StringValue,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '5d') as StringValue,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: savedUser.getId(),
        email: savedUser.getEmail(),
        fullName: savedUser.getFullName(),
        role: savedUser.getRole()?.name || ROLES.USER,
      },
    };
  }
}
