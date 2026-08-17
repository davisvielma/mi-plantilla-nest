import { DomainException } from './domain.exception';

/**
 * ★ Excepción para errores de lógica de negocio
 *
 * Esta excepción se usa en los casos de uso para errores que violan
 * reglas de negocio (ej: email ya existe, stock insuficiente).
 *
 * Ejemplo de uso:
 *   throw new BusinessException('El email ya está registrado', 'EMAIL_ALREADY_EXISTS');
 */
export class BusinessException extends DomainException {
  constructor(message: string, code?: string) {
    super(message, code || 'BUSINESS_ERROR');
    this.name = 'BusinessException';
  }
}
