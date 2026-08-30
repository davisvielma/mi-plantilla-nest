import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoleRepository } from './role.repository';
import { RoleOrmEntity } from './../entities';

describe('RoleRepository', () => {
  let repository: RoleRepository;

  const mockRoleOrmEntity = {
    id: 'role-uuid-123',
    name: 'admin',
    createdAt: new Date('2024-01-01'),
  };

  const mockTypeOrmRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleRepository,
        {
          provide: getRepositoryToken(RoleOrmEntity),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<RoleRepository>(RoleRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('returns a role when found', async () => {
      // Arrange
      mockTypeOrmRepository.findOne.mockResolvedValue(mockRoleOrmEntity);

      // Act
      const result = await repository.findById('role-uuid-123');

      // Assert
      expect(result).toBeDefined();
      expect(result?.getName()).toBe('admin');
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'role-uuid-123' },
      });
    });

    it('returns null when role is not found', async () => {
      // Arrange
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findById('non-existent-id');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findByName', () => {
    it('returns a role when found', async () => {
      // Arrange
      mockTypeOrmRepository.findOne.mockResolvedValue(mockRoleOrmEntity);

      // Act
      const result = await repository.findByName('admin');

      // Assert
      expect(result).toBeDefined();
      expect(result?.getName()).toBe('admin');
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'admin' },
      });
    });

    it('returns null when role is not found', async () => {
      // Arrange
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findByName('nonexistent');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('returns all roles ordered by createdAt ASC', async () => {
      // Arrange
      const mockRoles = [
        mockRoleOrmEntity,
        {
          id: 'role-uuid-456',
          name: 'user',
          createdAt: new Date('2024-01-02'),
        },
      ];
      mockTypeOrmRepository.find.mockResolvedValue(mockRoles);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]?.getName()).toBe('admin');
      expect(result[1]?.getName()).toBe('user');
      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'ASC' },
      });
    });

    it('returns empty array when no roles exist', async () => {
      // Arrange
      mockTypeOrmRepository.find.mockResolvedValue([]);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(result).toHaveLength(0);
    });
  });
});
