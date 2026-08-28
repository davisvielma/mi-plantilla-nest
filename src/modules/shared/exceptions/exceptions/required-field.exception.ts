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
export class RequiredFieldException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'RequiredFieldException';
  }
}
