/**
 * ★ Clase base abstracta para todas las entidades de dominio
 *
 * Proporciona comportamiento común:
 * - Identificador único (ID)
 * - Comparación por ID (equals)
 *
 * @example
 * export class User extends Entity<{ name: string; email: Email }> {
 *   constructor(id: string, props: { name: string; email: Email }) {
 *     super(id, props);
 *   }
 * }
 */
export abstract class Entity<T> {
  protected readonly _id: string;
  protected readonly props: T;

  constructor(id: string, props: T) {
    this._id = id;
    this.props = props;
  }

  /**
   * ★ Obtiene el ID de la entidad
   */
  public getId(): string {
    return this._id;
  }

  /**
   * ★ Compara dos entidades por su ID
   */
  public equals(entity: Entity<T>): boolean {
    if (!entity) return false;
    if (this === entity) return true;
    return this._id === entity._id;
  }

  /**
   * ★ Obtiene todas las propiedades como objeto
   */
  public toObject(): T {
    return { ...this.props };
  }
}
