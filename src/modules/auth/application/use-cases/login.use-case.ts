import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { USER_REPOSITORY } from '@/modules/users/domain/repositories/user.repository.interface';
import type { IUserRepository } from '@/modules/users/domain/repositories/user.repository.interface';
import { MESSAGES } from '@/modules/shared/constants/messages.constant';
import { LoginDto } from '../dtos/login.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { comparePasswords, JwtPayload } from '@/modules/shared';
import { ROLES } from '@/modules/shared/constants/roles.constant';
import type { StringValue } from 'ms';

/**
 * ★ Caso de Uso: Login
 *
 * Autentica un usuario con email y contraseña.
 * Retorna access token y refresh token.
 */
@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * ★ Ejecuta el caso de uso
   */
  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await comparePasswords(
      dto.password,
      user.getPassword(),
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);
    }

    // Generar tokens
    const payload: JwtPayload = {
      sub: user.getId(),
      email: user.getEmail(),
      fullName: user.getFullName(),
      role: { id: user.getRoleId(), name: user.getRole()?.name || ROLES.USER },
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
        id: user.getId(),
        email: user.getEmail(),
        fullName: user.getFullName(),
        role: {
          id: user.getRoleId(),
          name: user.getRole()?.name || ROLES.USER,
        },
      },
    };
  }
}
