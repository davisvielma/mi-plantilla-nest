import { RoleEntity } from './role.entity';
import { ROLES } from '@/modules/shared/constants';

describe('RoleEntity', () => {
  const mockRoleData = {
    id: 'role-uuid-123',
    name: ROLES.ADMIN,
    createdAt: new Date('2024-01-01'),
  };

  describe('create', () => {
    it('creates a role successfully', () => {
      // Act
      const role = RoleEntity.create(mockRoleData);

      // Assert
      expect(role).toBeDefined();
      expect(role.getId()).toBe(mockRoleData.id);
      expect(role.getName()).toBe(ROLES.ADMIN);
    });
  });

  describe('getName', () => {
    it('returns the role name', () => {
      // Arrange
      const role = RoleEntity.create(mockRoleData);

      // Act & Assert
      expect(role.getName()).toBe(ROLES.ADMIN);
    });
  });

  describe('getCreatedAt', () => {
    it('returns the creation date', () => {
      // Arrange
      const role = RoleEntity.create(mockRoleData);

      // Act & Assert
      expect(role.getCreatedAt()).toBe(mockRoleData.createdAt);
    });
  });

  describe('isAdmin', () => {
    it('returns true when role is admin', () => {
      // Arrange
      const role = RoleEntity.create(mockRoleData);

      // Act & Assert
      expect(role.isAdmin()).toBe(true);
    });

    it('returns false when role is not admin', () => {
      // Arrange
      const role = RoleEntity.create({ ...mockRoleData, name: ROLES.USER });

      // Act & Assert
      expect(role.isAdmin()).toBe(false);
    });
  });

  describe('isUser', () => {
    it('returns true when role is user', () => {
      // Arrange
      const role = RoleEntity.create({ ...mockRoleData, name: ROLES.USER });

      // Act & Assert
      expect(role.isUser()).toBe(true);
    });

    it('returns false when role is not user', () => {
      // Arrange
      const role = RoleEntity.create(mockRoleData);

      // Act & Assert
      expect(role.isUser()).toBe(false);
    });
  });

  describe('isSuperUser', () => {
    it('returns true when role is super-user', () => {
      // Arrange
      const role = RoleEntity.create({
        ...mockRoleData,
        name: ROLES.SUPER_USER,
      });

      // Act & Assert
      expect(role.isSuperUser()).toBe(true);
    });

    it('returns false when role is not super-user', () => {
      // Arrange
      const role = RoleEntity.create(mockRoleData);

      // Act & Assert
      expect(role.isSuperUser()).toBe(false);
    });
  });
});
