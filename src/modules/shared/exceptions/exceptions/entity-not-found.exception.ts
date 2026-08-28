import { DomainException } from './domain.exception';

/**
 * Excepción para entidades no encontradas
 *
 * Esta excepción se lanza cuando una entidad no existe en la base de datos.
 *
 * @example
 * throw new EntityNotFoundException('Usuario no encontrado');
 */
export class EntityNotFoundException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'EntityNotFoundException';
  }
}
