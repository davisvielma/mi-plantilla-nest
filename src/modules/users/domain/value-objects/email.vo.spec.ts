import { Email } from './email.vo';
import {
  InvalidFormatException,
  RequiredFieldException,
} from '@/modules/shared/exceptions/exceptions';

describe('Email Value Object', () => {
  describe('create', () => {
    it('creates an email successfully with valid format', () => {
      // Act
      const email = Email.create('test@example.com');

      // Assert
      expect(email).toBeDefined();
      expect(email.value).toBe('test@example.com');
    });

    it('normalizes email to lowercase', () => {
      // Act
      const email = Email.create('Test@Example.COM');

      // Assert
      expect(email.value).toBe('test@example.com');
    });

    it('throws RequiredFieldException when email is empty', () => {
      // Act & Assert
      expect(() => Email.create('')).toThrow(RequiredFieldException);
    });

    it('throws InvalidFormatException when email is invalid', () => {
      // Act & Assert
      expect(() => Email.create('invalid-email')).toThrow(
        InvalidFormatException,
      );
      expect(() => Email.create('invalid@')).toThrow(InvalidFormatException);
      expect(() => Email.create('@invalid.com')).toThrow(
        InvalidFormatException,
      );
    });
  });

  describe('getDomain', () => {
    it('returns the domain part of the email', () => {
      // Arrange
      const email = Email.create('user@company.com');

      // Act & Assert
      expect(email.getDomain()).toBe('company.com');
    });
  });

  describe('getUsername', () => {
    it('returns the username part of the email', () => {
      // Arrange
      const email = Email.create('user@company.com');

      // Act & Assert
      expect(email.getUsername()).toBe('user');
    });
  });

  describe('equals', () => {
    it('returns true when emails are equal', () => {
      // Arrange
      const email1 = Email.create('test@example.com');
      const email2 = Email.create('test@example.com');

      // Act & Assert
      expect(email1.equals(email2)).toBe(true);
    });

    it('returns true when emails differ only in case', () => {
      // Arrange
      const email1 = Email.create('TEST@EXAMPLE.COM');
      const email2 = Email.create('test@example.com');

      // Act & Assert
      expect(email1.equals(email2)).toBe(true);
    });

    it('returns false when emails are different', () => {
      // Arrange
      const email1 = Email.create('test1@example.com');
      const email2 = Email.create('test2@example.com');

      // Act & Assert
      expect(email1.equals(email2)).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns true for valid email', () => {
      // Arrange
      const email = Email.create('test@example.com');

      // Act & Assert
      expect(email.isValid()).toBe(true);
    });
  });
});
