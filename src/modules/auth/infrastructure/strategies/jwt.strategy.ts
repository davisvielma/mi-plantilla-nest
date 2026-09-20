import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '@/modules/users/domain/repositories';
import {
  TOKEN_BLACKLIST_REPOSITORY,
  type ITokenBlacklistRepository,
} from '../../domain/repositories';
import { MESSAGES, ROLES } from '@/modules/shared/constants';
import { JwtPayload } from '@/modules/shared/interfaces';

/**
 * Estrategia JWT
 *
 * Valida el token JWT de las peticiones autenticadas.
 * Extrae el payload, verifica que no esté en la blacklist y que el usuario exista.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(TOKEN_BLACKLIST_REPOSITORY)
    private readonly blacklistRepository: ITokenBlacklistRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'jwt-secret'),
      passReqToCallback: true,
    });
  }

  /**
   * Valida el payload del JWT
   *
   * Este método se ejecuta después de verificar la firma del token.
   * Retorna el usuario que se adjuntará al request.
   */
  async validate(req: Request, payload: JwtPayload): Promise<JwtPayload> {
    // Obtener el token raw del request
    const authHeader = req.get('authorization');
    const token = authHeader?.split(' ')[1];

    // Verificar si el token está en la blacklist
    if (token) {
      const isBlacklisted = await this.blacklistRepository.isBlacklisted(token);
      if (isBlacklisted) {
        throw new UnauthorizedException(MESSAGES.TOKEN_INVALID);
      }
    }

    // Buscar usuario por ID (sub del token)
    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException(MESSAGES.TOKEN_INVALID);
    }

    if (user.getDeletedAt())
      throw new UnauthorizedException(
        'El usuario está inactivo, habla con un administrador',
      );

    // Retornar información que se adjuntará a request.user
    return {
      sub: user.getId(),
      email: user.getEmail(),
      fullName: user.getFullName(),
      role: { id: user.getRoleId(), name: user.getRole()?.name || ROLES.USER },
    };
  }
}
