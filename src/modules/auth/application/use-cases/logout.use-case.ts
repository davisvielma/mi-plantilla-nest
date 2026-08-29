import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
  type ITokenBlacklistRepository,
  TOKEN_BLACKLIST_REPOSITORY,
} from '../../domain/repositories';
import { MESSAGES } from '@/modules/shared/constants';
import { JwtPayload } from '@/modules/shared/interfaces';

/**
 * Caso de Uso: Logout
 *
 * Cierra la sesión del usuario actual.
 * Agrega el token actual a la blacklist para invalidarlo.
 */
@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(TOKEN_BLACKLIST_REPOSITORY)
    private readonly blacklistRepository: ITokenBlacklistRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(request: Request): Promise<{ message: string }> {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(MESSAGES.TOKEN_INVALID);
    }

    const token = authHeader.split(' ')[1];

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException(MESSAGES.TOKEN_INVALID);
    }

    const isBlacklisted = await this.blacklistRepository.isBlacklisted(token);

    if (isBlacklisted) {
      return { message: MESSAGES.LOGOUT_SUCCESS };
    }

    // Obtener fecha de expiración del token
    const decoded = this.jwtService.decode<
      { iat: number; exp: number } & JwtPayload
    >(token);
    const expiresAt = new Date((decoded.exp || 0) * 1000);

    try {
      await this.blacklistRepository.add(
        token,
        payload.sub,
        'access',
        expiresAt,
      );
    } catch {
      throw new InternalServerErrorException('Error al cerrar sesión');
    }

    return { message: MESSAGES.LOGOUT_SUCCESS };
  }
}
