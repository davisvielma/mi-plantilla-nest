import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorador para marcar una ruta como pública
 * (no requiere autenticación JWT)
 *
 * @example
 * @Public()
 * @Post('register')
 * async register() { ... }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
