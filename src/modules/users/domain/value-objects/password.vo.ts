import {
  InvalidFormatException,
  RequiredFieldException,
} from '@/modules/shared';

/**
 * Value Object: Password
 *
 * Encapsula la validación de la contraseña.
 * NOTA: El hashing se hace en la capa de infraestructura.
 *
 * Reglas:
 * - La contraseña es requerida
 * - La contraseña debe tener al menos 8 caracteres
 *
 * Se usa en: User, Customer, Employee, etc.
 */
export class Password {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Factory Method - Única forma de crear una Password
   */
  static create(plainPassword: string): Password {
    if (!plainPassword || plainPassword.trim().length === 0) {
      throw new RequiredFieldException('La contraseña es requerida');
    }

    if (plainPassword.length < 8) {
      throw new InvalidFormatException(
        'La contraseña debe tener al menos 8 caracteres',
      );
    }

    return new Password(plainPassword);
  }

  /**
   * Método de dominio: Obtener el valor de la contraseña
   */
  get value(): string {
    return this._value;
  }

  /**
   * Método de dominio: Verificar si la contraseña es segura
   *
   * Reglas adicionales de seguridad (opcionales):
   * - Al menos una mayúscula
   * - Al menos una minúscula
   * - Al menos un número
   * - Al menos un carácter especial
   */
  isStrong(): boolean {
    const hasUpperCase = /[A-Z]/.test(this._value);
    const hasLowerCase = /[a-z]/.test(this._value);
    const hasNumber = /\d/.test(this._value);
    const hasSpecialChar = /[!@#$%^&*_+-=;':"|,./?]/.test(this._value);

    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  }

  /**
   * Método de dominio: Obtener la fortaleza de la contraseña (0-5)
   *
   * @returns Número entre 0 y 5 indicando la fortaleza
   */
  getStrength(): number {
    let strength = 0;
    if (this._value.length >= 8) strength++;
    if (/[A-Z]/.test(this._value)) strength++;
    if (/[a-z]/.test(this._value)) strength++;
    if (/\d/.test(this._value)) strength++;
    if (/[!@#$%^&*_+-=;':"|,./?]/.test(this._value)) strength++;
    return strength;
  }

  /**
   * Método de dominio: Obtener descripción de la fortaleza
   */
  getStrengthLabel(): string {
    const strength = this.getStrength();
    const labels = [
      'Muy débil',
      'Débil',
      'Regular',
      'Fuerte',
      'Muy fuerte',
      'Excelente',
    ];
    return labels[Math.min(strength, 5)];
  }

  /**
   * Método de dominio: Verificar si la contraseña tiene mayúsculas
   */
  hasUpperCase(): boolean {
    return /[A-Z]/.test(this._value);
  }

  /**
   * Método de dominio: Verificar si la contraseña tiene minúsculas
   */
  hasLowerCase(): boolean {
    return /[a-z]/.test(this._value);
  }

  /**
   * Método de dominio: Verificar si la contraseña tiene números
   */
  hasNumbers(): boolean {
    return /\d/.test(this._value);
  }

  /**
   * Método de dominio: Verificar si la contraseña tiene caracteres especiales
   */
  hasSpecialChars(): boolean {
    return /[!@#$%^&*_+-=;':"|,./?]/.test(this._value);
  }

  /**
   * Método de dominio: Comparar contraseñas
   */
  equals(other: Password): boolean {
    return this._value === other._value;
  }

  /**
   * Método de dominio: Verificar si la contraseña es válida
   * (ya se valida en create, pero útil para chequeos)
   */
  isValid(): boolean {
    return this._value.length >= 8;
  }
}
