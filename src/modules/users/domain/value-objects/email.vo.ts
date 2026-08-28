import {
  InvalidFormatException,
  RequiredFieldException,
} from '@/modules/shared';

/**
 * ★ Value Object: Email
 *
 * Encapsula la validación y el comportamiento del email.
 * Es inmutable y se valida al crearse.
 *
 * Reglas:
 * - El email es requerido
 * - El email debe tener un formato válido
 * - El email se normaliza a minúsculas
 *
 * Se usa en: User, Customer, Employee, etc.
 */
export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value.toLowerCase();
  }

  /**
   * ★ Factory Method - Única forma de crear un Email
   */
  static create(email: string): Email {
    if (!email || email.trim().length === 0) {
      throw new RequiredFieldException('El email es requerido');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new InvalidFormatException('El formato del email es inválido');
    }

    return new Email(email.trim());
  }

  /**
   * ★ Método de dominio: Obtener el valor del email
   */
  get value(): string {
    return this._value;
  }

  /**
   * ★ Método de dominio: Obtener el dominio del email
   *
   * @example "user@company.com" → "company.com"
   */
  getDomain(): string {
    const parts = this._value.split('@');
    return parts[1];
  }

  /**
   * ★ Método de dominio: Obtener el nombre de usuario (antes del @)
   *
   * @example "user@company.com" → "user"
   */
  getUsername(): string {
    const parts = this._value.split('@');
    return parts[0];
  }

  /**
   * ★ Método de dominio: Comparar emails (ignorando mayúsculas)
   */
  equals(other: Email): boolean {
    return this._value === other._value;
  }

  /**
   * ★ Método de dominio: Verificar si el email es válido
   * (ya se valida en create, pero útil para chequeos)
   */
  isValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this._value);
  }
}
