import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '@/modules/users/domain/repositories/user.repository.interface';
import type { IUserRepository } from '@/modules/users/domain/repositories/user.repository.interface';
import { MESSAGES } from '@/modules/shared/constants/messages.constant';
import { ROLES } from '@/modules/shared/constants/roles.constant';
import { comparePasswords } from '@/modules/shared';

/**
 * ★ Estrategia Local
 *
 * Valida las credenciales (email + contraseña) para login.
 * Se usa en el endpoint POST /auth/login.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  /**
   * ★ Valida las credenciales del usuario
   *
   * Este método se ejecuta al intentar autenticar.
   * Retorna el usuario si las credenciales son válidas.
   */
  async validate(email: string, password: string): Promise<any> {
    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await comparePasswords(
      password,
      user.getPassword(),
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);
    }

    // Retornar información del usuario
    return {
      sub: user.getId(),
      email: user.getEmail(),
      fullName: user.getFullName(),
      role: user.getRole()?.name || ROLES.USER,
    };
  }
}
