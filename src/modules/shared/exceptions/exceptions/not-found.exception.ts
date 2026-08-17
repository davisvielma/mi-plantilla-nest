import { DomainException } from './domain.exception';

/**
 * ★ Excepción para recursos no encontrados
 *
 * Esta excepción se usa cuando un recurso no existe en la base de datos.
 *
 * Ejemplo de uso:
 *   throw new NotFoundException('Usuario no encontrado', 'USER_NOT_FOUND');
 */
export class NotFoundException extends DomainException {
  constructor(message: string, code?: string) {
    super(message, code || 'NOT_FOUND');
    this.name = 'NotFoundException';
  }
}
