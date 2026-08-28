import { DomainException } from './domain.exception';

/**
 * ★ Excepción para formato inválido
 *
 * Esta excepción se lanza cuando un campo no tiene el formato esperado
 * (ej: email inválido, UUID incorrecto, fecha con formato erróneo).
 *
 * Ejemplo de uso:
 *   throw new InvalidFormatException('El email no tiene un formato válido');
 */
export class InvalidFormatException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidFormatException';
  }
}
