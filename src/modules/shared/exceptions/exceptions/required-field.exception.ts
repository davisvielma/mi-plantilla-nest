import { DomainException } from './domain.exception';

/**
 * ★ Excepción para campos requeridos
 *
 * Esta excepción se lanza cuando un campo obligatorio no fue proporcionado.
 *
 * Ejemplo de uso:
 *   throw new RequiredFieldException('El nombre es obligatorio');
 */
export class RequiredFieldException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'RequiredFieldException';
  }
}
