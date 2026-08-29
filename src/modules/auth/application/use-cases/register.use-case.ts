import {
  Inject,
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  USER_REPOSITORY,
  type IUserRepository,
  ROLE_REPOSITORY,
  type IRoleRepository,
} from '@/modules/users/domain/repositories';
import { RegisterDto, AuthResponseDto } from '../dtos';
import { UserEntity } from '@/modules/users/domain/entities';
import { MESSAGES, ROLES } from '@/modules/shared/constants';
import { hashPassword } from '@/modules/shared/utils';
import { JwtPayload } from '@/modules/shared/interfaces';
import type { StringValue } from 'ms';

/**
 * Caso de Uso: Registro de Usuario
 *
 * Registra un nuevo usuario con rol por defecto (user).
 * Retorna access token y refresh token.
 */
@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: RegisterDto): Promise<AuthResponseDto> {
    const exists = await this.userRepository.existsByEmail(dto.email);
    if (exists) {
      throw new ConflictException(MESSAGES.USER_ALREADY_EXISTS);
    }

    const role = await this.roleRepository.findByName(ROLES.USER);

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

    const payload: JwtPayload = {
      sub: savedUser.getId(),
      email: savedUser.getEmail(),
      fullName: savedUser.getFullName(),
      role: { id: savedUser.getRoleId(), name: role.getName() },
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
        role: {
          id: savedUser.getRoleId(),
          name: role.getName(),
        },
      },
    };
  }
}
