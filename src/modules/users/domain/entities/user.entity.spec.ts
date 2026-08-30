import { UserEntity } from './user.entity';
import {
  RequiredFieldException,
  InvalidFormatException,
} from '@/modules/shared/exceptions/exceptions';
import { EntityDeletedException } from '@/modules/shared/exceptions/exceptions';

describe('UserEntity', () => {
  const validUserData = {
    id: 'user-uuid-123',
    email: 'test@example.com',
    password: 'hashed-password',
    fullName: 'Test User',
    roleId: 'role-uuid-456',
    createdAt: new Date('2024-01-01'),
  };

  describe('create', () => {
    it('creates a user successfully with valid data', () => {
      // Act
      const user = UserEntity.create({
        email: 'test@example.com',
        password: 'hashed-password',
        fullName: 'Test User',
        roleId: 'role-uuid-456',
      });

      // Assert
      expect(user).toBeDefined();
      expect(user.getEmail()).toBe('test@example.com');
      expect(user.getFullName()).toBe('Test User');
      expect(user.getRoleId()).toBe('role-uuid-456');
    });

    it('throws RequiredFieldException when fullName is missing', () => {
      // Act & Assert
      expect(() =>
        UserEntity.create({
          email: 'test@example.com',
          password: 'hashed-password',
          fullName: '',
          roleId: 'role-uuid-456',
        }),
      ).toThrow(RequiredFieldException);
    });

    it('throws RequiredFieldException when roleId is missing', () => {
      // Act & Assert
      expect(() =>
        UserEntity.create({
          email: 'test@example.com',
          password: 'hashed-password',
          fullName: 'Test User',
          roleId: '',
        }),
      ).toThrow(RequiredFieldException);
    });

    it('throws InvalidFormatException when fullName is too short', () => {
      // Act & Assert
      expect(() =>
        UserEntity.create({
          email: 'test@example.com',
          password: 'hashed-password',
          fullName: 'AB',
          roleId: 'role-uuid-456',
        }),
      ).toThrow(InvalidFormatException);
    });
  });

  describe('update', () => {
    it('updates user data successfully', () => {
      // Arrange
      const user = UserEntity.create(validUserData);

      // Act
      user.update({
        email: 'updated@example.com',
        password: 'new-hashed-password',
        fullName: 'Updated User',
      });

      // Assert
      expect(user.getEmail()).toBe('updated@example.com');
      expect(user.getFullName()).toBe('Updated User');
      expect(user.getUpdatedAt()).toBeDefined();
    });
  });

  describe('updateRole', () => {
    it('updates user role successfully', () => {
      // Arrange
      const user = UserEntity.create(validUserData);

      // Act
      user.updateRole('new-role-uuid');

      // Assert
      expect(user.getRoleId()).toBe('new-role-uuid');
      expect(user.getUpdatedAt()).toBeDefined();
    });
  });

  describe('softDelete', () => {
    it('marks user as deleted', () => {
      // Arrange
      const user = UserEntity.create(validUserData);

      // Act
      user.softDelete();

      // Assert
      expect(user.isDeleted()).toBe(true);
      expect(user.getDeletedAt()).toBeDefined();
    });

    it('throws EntityDeletedException when user is already deleted', () => {
      // Arrange
      const user = UserEntity.create(validUserData);
      user.softDelete();

      // Act & Assert
      expect(() => user.softDelete()).toThrow(EntityDeletedException);
    });
  });

  describe('getters', () => {
    it('returns correct values', () => {
      // Arrange
      const user = UserEntity.create({
        email: 'test@example.com',
        password: 'hashed-password',
        fullName: 'Test User',
        roleId: 'role-uuid-456',
      });

      // Assert
      expect(user.getId()).toBeDefined();
      expect(user.getEmail()).toBe('test@example.com');
      expect(user.getPassword()).toBe('hashed-password');
      expect(user.getFullName()).toBe('Test User');
      expect(user.getRoleId()).toBe('role-uuid-456');
      expect(user.getCreatedAt()).toBeDefined();
      expect(user.getUpdatedAt()).toBeUndefined();
      expect(user.getDeletedAt()).toBeUndefined();
    });
  });
});
