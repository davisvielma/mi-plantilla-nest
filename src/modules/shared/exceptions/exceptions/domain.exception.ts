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
  public readonly code?: string;

  constructor(
    public readonly message: string,
    code?: string,
  ) {
    super(message);
    this.name = 'DomainException';
    this.code = code || 'DOMAIN_ERROR';
  }

  /**
   * ★ Método para convertir la excepción a un objeto JSON
   * Útil para respuestas estructuradas
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
    };
  }
}
