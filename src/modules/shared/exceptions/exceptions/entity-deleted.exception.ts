import { DomainException } from './domain.exception';

/**
 * Excepción para entidades eliminadas
 *
 * Esta excepción se lanza cuando se intenta acceder o modificar
 * una entidad que ha sido eliminada lógicamente.
 *
 * @example
 * throw new EntityDeletedException('El usuario ha sido eliminado');
 */
export class EntityDeletedException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'EntityDeletedException';
  }
}
