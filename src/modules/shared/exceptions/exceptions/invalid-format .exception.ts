import { DomainException } from './domain.exception';

/**
 * ★ Excepción para errores de validación
 *
 * Esta excepción se usa cuando los datos de entrada no cumplen
 * con las validaciones (ej: email inválido, campo requerido).
 *
 * Ejemplo de uso:
 *   throw new ValidationException('El email no tiene un formato válido');
 */
export class InvalidFormatException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidFormatException';
  }
}
