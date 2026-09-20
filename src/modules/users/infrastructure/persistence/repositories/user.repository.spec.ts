import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IsNull, Not } from 'typeorm';
import { UserRepository } from './user.repository';
import { UserOrmEntity } from './../entities';
import { UserEntity } from './../../../domain/entities';

describe('UserRepository', () => {
  let repository: UserRepository;

  const mockUserOrmEntity = {
    id: 'user-uuid-123',
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'hashed-password',
    roleId: 'role-uuid-456',
    createdAt: new Date('2024-01-01'),
    role: {
      id: 'role-uuid-456',
      name: 'admin',
      createdAt: new Date('2024-01-01'),
    },
    updatedAt: undefined,
    deletedAt: undefined,
  };

  const mockTypeOrmRepository = {
    findOne: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(UserOrmEntity),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('findById', () => {
    it('returns a user when found', async () => {
      // Arrange
      mockTypeOrmRepository.findOne.mockResolvedValue(mockUserOrmEntity);

      // Act
      const result = await repository.findById('user-uuid-123');

      // Assert
      expect(result).toBeDefined();
      expect(result?.getEmail()).toBe('test@example.com');
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-uuid-123', deletedAt: IsNull() },
        relations: { role: true },
      });
    });

    it('returns null when user is not found', async () => {
      // Arrange
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findById('non-existent-id');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('returns a user when found', async () => {
      // Arrange
      mockTypeOrmRepository.findOne.mockResolvedValue(mockUserOrmEntity);

      // Act
      const result = await repository.findByEmail('test@example.com');

      // Assert
      expect(result).toBeDefined();
      expect(result?.getEmail()).toBe('test@example.com');
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com', deletedAt: IsNull() },
        relations: { role: true },
      });
    });

    it('returns null when user is not found', async () => {
      // Arrange
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findByEmail('nonexistent@example.com');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('existsByEmail', () => {
    it('returns true when email exists', async () => {
      // Arrange
      mockTypeOrmRepository.count.mockResolvedValue(1);

      // Act
      const result = await repository.existsByEmail('test@example.com');

      // Assert
      expect(result).toBe(true);
      expect(mockTypeOrmRepository.count).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('returns false when email does not exist', async () => {
      // Arrange
      mockTypeOrmRepository.count.mockResolvedValue(0);

      // Act
      const result = await repository.existsByEmail('nonexistent@example.com');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('softDelete', () => {
    it('marks user as deleted', async () => {
      // Arrange
      const now = new Date('2024-01-01T10:00:00Z');
      jest.useFakeTimers();
      jest.setSystemTime(now);
      mockTypeOrmRepository.update.mockResolvedValue({ affected: 1 });

      // Act
      await repository.softDelete('user-uuid-123');

      // Assert
      expect(mockTypeOrmRepository.update).toHaveBeenCalledWith(
        { id: 'user-uuid-123', deletedAt: IsNull() },
        { deletedAt: now },
      );
    });
  });

  describe('save', () => {
    it('saves a user and returns the saved entity', async () => {
      // Arrange
      const mockUserEntity = {
        getId: () => 'user-uuid-123',
        getEmail: () => 'test@example.com',
        getFullName: () => 'Test User',
        getRoleId: () => 'role-uuid-456',
        getPassword: () => 'hashed-password',
        getCreatedAt: () => new Date('2024-01-01'),
        getUpdatedAt: () => undefined,
        getDeletedAt: () => undefined,
        getRole: () => undefined,
      } as unknown as UserEntity;
      mockTypeOrmRepository.save.mockResolvedValue(mockUserOrmEntity);
      mockTypeOrmRepository.findOne.mockResolvedValue(mockUserOrmEntity);

      // Act
      const result = await repository.save(mockUserEntity);

      // Assert
      expect(result).toBeDefined();
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('returns all users with pagination', async () => {
      // Arrange
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockUserOrmEntity], 1]),
      };
      mockTypeOrmRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      // Act
      const result = await repository.findAll({
        page: 1,
        limit: 10,
        sort: 'createdAt',
        order: 'DESC',
      });

      // Assert
      expect(result).toBeDefined();
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('applies email filter when provided', async () => {
      // Arrange
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockUserOrmEntity], 1]),
      };
      mockTypeOrmRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      // Act
      await repository.findAll({
        page: 1,
        limit: 10,
        sort: 'createdAt',
        order: 'DESC',
        filters: { email: 'test' },
      });

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'user.email LIKE :email',
        { email: '%test%' },
      );
    });

    it('applies roleId filter when provided', async () => {
      // Arrange
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockUserOrmEntity], 1]),
      };
      mockTypeOrmRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      // Act
      await repository.findAll({
        page: 1,
        limit: 10,
        sort: 'createdAt',
        order: 'DESC',
        filters: { roleId: 'role-uuid-456' },
      });

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'user.roleId = :roleId',
        { roleId: 'role-uuid-456' },
      );
    });

    it('applies fullName filter when provided', async () => {
      // Arrange
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockUserOrmEntity], 1]),
      };
      mockTypeOrmRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      // Act
      await repository.findAll({
        page: 1,
        limit: 10,
        sort: 'createdAt',
        order: 'DESC',
        filters: { fullName: 'Test' },
      });

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'user.fullName LIKE :fullName',
        { fullName: '%Test%' },
      );
    });
  });

  describe('findByRole', () => {
    it('returns users for a given role', async () => {
      // Arrange
      mockTypeOrmRepository.find.mockResolvedValue([mockUserOrmEntity]);

      // Act
      const result = await repository.findByRole('role-uuid-456');

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]?.getEmail()).toBe('test@example.com');
      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith({
        where: { roleId: 'role-uuid-456', deletedAt: IsNull() },
        relations: { role: true },
      });
    });

    it('returns empty array when no users have the role', async () => {
      // Arrange
      mockTypeOrmRepository.find.mockResolvedValue([]);

      // Act
      const result = await repository.findByRole('non-existent-role');

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('findDeleted', () => {
    it('returns deleted users', async () => {
      // Arrange
      const deletedUserOrmEntity = {
        ...mockUserOrmEntity,
        deletedAt: new Date('2024-01-02'),
      };
      mockTypeOrmRepository.find.mockResolvedValue([deletedUserOrmEntity]);

      // Act
      const result = await repository.findDeleted();

      // Assert
      expect(result).toHaveLength(1);
      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith({
        where: { deletedAt: Not(IsNull()) },
        relations: { role: true },
      });
    });

    it('returns empty array when no users are deleted', async () => {
      // Arrange
      mockTypeOrmRepository.find.mockResolvedValue([]);

      // Act
      const result = await repository.findDeleted();

      // Assert
      expect(result).toHaveLength(0);
    });
  });
});
