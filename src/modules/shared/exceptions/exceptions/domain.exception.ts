/**
 * ★ Excepción base para errores del dominio
 *
 * Esta excepción se lanza cuando ocurre un error en la capa de dominio
 * (entidades, value objects, reglas de negocio).
 *
 * Ejemplo de uso:
 *   throw new DomainException('El email ya está registrado');
 */
export class DomainException extends Error {
  constructor(public readonly message: string) {
    super(message);
    this.name = 'DomainException';
  }
}
