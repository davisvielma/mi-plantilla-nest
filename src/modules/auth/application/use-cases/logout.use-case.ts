import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
  type ITokenBlacklistRepository,
  TOKEN_BLACKLIST_REPOSITORY,
} from '../../domain/repositories';
import { MESSAGES } from '@/modules/shared/constants';
import { JwtPayload } from '@/modules/shared/interfaces';
import { LogoutDto } from '../dtos';

/**
 * Caso de Uso: Logout
 *
 * Cierra la sesión del usuario actual.
 * Agrega el access token actual a la blacklist para invalidarlo.
 * Si se envía el refresh token, también se revoca (grant completo).
 *
 * Sigue RFC 7009: el logout es idempotente, por lo que siempre responde éxito
 * cuando hay un token, aunque ya esté en la blacklist o haya expirado.
 */
@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(TOKEN_BLACKLIST_REPOSITORY)
    private readonly blacklistRepository: ITokenBlacklistRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    request: Request,
    dto: LogoutDto,
  ): Promise<{ message: string }> {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(MESSAGES.TOKEN_INVALID);
    }

    const accessToken = authHeader.split(' ')[1];

    await this.addIfValid(accessToken, 'access');

    if (dto.refreshToken) {
      await this.addIfValid(dto.refreshToken, 'refresh');
    }

    return { message: MESSAGES.LOGOUT_SUCCESS };
  }

  private async addIfValid(
    token: string,
    type: 'access' | 'refresh',
  ): Promise<void> {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(token);
    } catch {
      // Token inválido o vencido: se ignora, el logout sigue siendo exitoso
      return;
    }

    const isAlreadyBlacklisted =
      await this.blacklistRepository.isBlacklisted(token);

    // Idempotente: si el token ya está en la blacklist, se responde éxito sin persistir
    if (isAlreadyBlacklisted) {
      return;
    }

    const decoded = this.jwtService.decode<{ exp?: number }>(token);
    const expiresAt = new Date((decoded?.exp || Date.now() / 1000) * 1000);

    await this.blacklistRepository.add(token, payload.sub, type, expiresAt);
  }
}
