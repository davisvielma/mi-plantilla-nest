import { Password } from './password.vo';
import {
  InvalidFormatException,
  RequiredFieldException,
} from '@/modules/shared/exceptions/exceptions';

describe('Password Value Object', () => {
  describe('create', () => {
    it('creates a password successfully with valid length', () => {
      // Act
      const password = Password.create('ValidPass123');

      // Assert
      expect(password).toBeDefined();
      expect(password.value).toBe('ValidPass123');
    });

    it('throws RequiredFieldException when password is empty', () => {
      // Act & Assert
      expect(() => Password.create('')).toThrow(RequiredFieldException);
    });

    it('throws InvalidFormatException when password is too short', () => {
      // Act & Assert
      expect(() => Password.create('short')).toThrow(InvalidFormatException);
    });
  });

  describe('isStrong', () => {
    it('returns true for strong password', () => {
      // Arrange
      const password = Password.create('StrongPass123!');

      // Act & Assert
      expect(password.isStrong()).toBe(true);
    });

    it('returns false for weak password', () => {
      // Arrange
      const password = Password.create('weakpassword');

      // Act & Assert
      expect(password.isStrong()).toBe(false);
    });
  });

  describe('getStrength', () => {
    it('returns 5 for excellent password', () => {
      // Arrange
      const password = Password.create('Excellent123!');

      // Act & Assert
      expect(password.getStrength()).toBe(5);
    });

    it('returns lower score for weaker passwords', () => {
      // Arrange
      const password = Password.create('weakpassword');

      // Act & Assert
      expect(password.getStrength()).toBeLessThan(5);
    });
  });

  describe('getStrengthLabel', () => {
    it('returns correct label for strength level', () => {
      // Arrange
      const password = Password.create('Excellent123!');

      // Act & Assert
      expect(password.getStrengthLabel()).toBe('Excelente');
    });
  });

  describe('hasUpperCase', () => {
    it('returns true when password has uppercase letters', () => {
      // Arrange
      const password = Password.create('WithUpperCase123');

      // Act & Assert
      expect(password.hasUpperCase()).toBe(true);
    });

    it('returns false when password has no uppercase letters', () => {
      // Arrange
      const password = Password.create('nouppercase123');

      // Act & Assert
      expect(password.hasUpperCase()).toBe(false);
    });
  });

  describe('hasLowerCase', () => {
    it('returns true when password has lowercase letters', () => {
      // Arrange
      const password = Password.create('WithLowerCase123');

      // Act & Assert
      expect(password.hasLowerCase()).toBe(true);
    });

    it('returns false when password has no lowercase letters', () => {
      // Arrange
      const password = Password.create('NOLOWERCASE123');

      // Act & Assert
      expect(password.hasLowerCase()).toBe(false);
    });
  });

  describe('hasNumbers', () => {
    it('returns true when password has numbers', () => {
      // Arrange
      const password = Password.create('WithNumbers123');

      // Act & Assert
      expect(password.hasNumbers()).toBe(true);
    });

    it('returns false when password has no numbers', () => {
      // Arrange
      const password = Password.create('NoNumbersHere');

      // Act & Assert
      expect(password.hasNumbers()).toBe(false);
    });
  });

  describe('hasSpecialChars', () => {
    it('returns true when password has special characters', () => {
      // Arrange
      const password = Password.create('WithSpecial!@#$%^&*');

      // Act & Assert
      expect(password.hasSpecialChars()).toBe(true);
    });

    it('returns false when password has no special characters', () => {
      // Arrange
      const password = Password.create('NoSpecialCharsHere');

      // Act & Assert
      expect(password.hasSpecialChars()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true when passwords are equal', () => {
      // Arrange
      const password1 = Password.create('SamePass123');
      const password2 = Password.create('SamePass123');

      // Act & Assert
      expect(password1.equals(password2)).toBe(true);
    });

    it('returns false when passwords are different', () => {
      // Arrange
      const password1 = Password.create('Password123');
      const password2 = Password.create('Different123');

      // Act & Assert
      expect(password1.equals(password2)).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns true for valid password', () => {
      // Arrange
      const password = Password.create('ValidPass123');

      // Act & Assert
      expect(password.isValid()).toBe(true);
    });
  });
});
