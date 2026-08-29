import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '@/modules/users/domain/repositories';
import {
  type ITokenBlacklistRepository,
  TOKEN_BLACKLIST_REPOSITORY,
} from '../../domain/repositories';
import { AuthResponseDto, RefreshTokenDto } from '../dtos';
import { JwtPayload } from '@/modules/shared/interfaces';
import { ROLES, MESSAGES } from '@/modules/shared/constants';
import type { StringValue } from 'ms';

/**
 * Caso de Uso: Refresh Token
 *
 * Refresca el access token usando un refresh token válido.
 * Implementa token rotation: el refresh token viejo se blacklistea.
 */
@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(TOKEN_BLACKLIST_REPOSITORY)
    private readonly blacklistRepository: ITokenBlacklistRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    // Verificar y decodificar el refresh token
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(dto.refreshToken);
    } catch {
      throw new UnauthorizedException(MESSAGES.TOKEN_INVALID);
    }

    const isBlacklisted = await this.blacklistRepository.isBlacklisted(
      dto.refreshToken,
    );

    if (isBlacklisted) {
      throw new UnauthorizedException(MESSAGES.TOKEN_INVALID);
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException(MESSAGES.TOKEN_INVALID);
    }

    try {
      // Blacklistear el refresh token viejo (token rotation)
      const decoded = this.jwtService.decode<
        { iat: number; exp: number } & JwtPayload
      >(dto.refreshToken);
      const oldExpiresAt = new Date((decoded.exp || 0) * 1000);

      await this.blacklistRepository.add(
        dto.refreshToken,
        user.getId(),
        'refresh',
        oldExpiresAt,
      );
    } catch {
      throw new InternalServerErrorException('Error al rotar el token');
    }

    const newPayload: JwtPayload = {
      sub: user.getId(),
      email: user.getEmail(),
      fullName: user.getFullName(),
      role: { id: user.getRoleId(), name: user.getRole()?.name || ROLES.USER },
    };

    const accessToken = this.jwtService.sign(newPayload, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as StringValue,
    });
    const refreshToken = this.jwtService.sign(newPayload, {
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
