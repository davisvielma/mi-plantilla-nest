import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import {
  CreateUserUseCase,
  FindUserByIdUseCase,
  ListUsersUseCase,
  UpdateUserUseCase,
  UpdateUserRoleUseCase,
  SoftDeleteUserUseCase,
} from '../../application/use-cases';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserRoleDto,
  QueryUsersDto,
} from '../../application/dtos';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUserId = 'user-uuid-123';
  const mockCurrentUserId = 'user-uuid-123';

  const mockUserEntity = {
    getId: () => mockUserId,
    getEmail: () => 'test@example.com',
    getFullName: () => 'Test User',
    getRoleId: () => 'role-uuid-456',
    getPassword: () => 'hashed-password',
    getRole: () => ({ id: 'role-uuid-456', name: 'admin' }),
    getCreatedAt: () => new Date(),
    getUpdatedAt: () => undefined,
    getDeletedAt: () => undefined,
    isDeleted: () => false,
  };

  const mockJwtPayload = {
    sub: mockUserId,
    email: 'test@example.com',
    fullName: 'Test User',
    role: { id: 'role-uuid-456', name: 'admin' },
  };

  const mockCreateUserUseCase = {
    execute: jest.fn(),
  };

  const mockFindUserByIdUseCase = {
    execute: jest.fn(),
  };

  const mockListUsersUseCase = {
    execute: jest.fn(),
  };

  const mockUpdateUserUseCase = {
    execute: jest.fn(),
  };

  const mockUpdateUserRoleUseCase = {
    execute: jest.fn(),
  };

  const mockSoftDeleteUserUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: CreateUserUseCase, useValue: mockCreateUserUseCase },
        { provide: FindUserByIdUseCase, useValue: mockFindUserByIdUseCase },
        { provide: ListUsersUseCase, useValue: mockListUsersUseCase },
        { provide: UpdateUserUseCase, useValue: mockUpdateUserUseCase },
        { provide: UpdateUserRoleUseCase, useValue: mockUpdateUserRoleUseCase },
        { provide: SoftDeleteUserUseCase, useValue: mockSoftDeleteUserUseCase },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates a user successfully', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'ValidPass123',
        fullName: 'Test User',
        roleId: 'role-uuid-456',
      };
      mockCreateUserUseCase.execute.mockResolvedValue(mockUserEntity);

      // Act
      const result = await controller.create(createUserDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
      expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('returns paginated users', async () => {
      // Arrange
      const query: QueryUsersDto = {
        page: 1,
        limit: 10,
        sort: 'createdAt',
        order: 'DESC',
      };
      mockListUsersUseCase.execute.mockResolvedValue({
        data: [mockUserEntity],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });

      // Act
      const result = await controller.findAll(query);

      // Assert
      expect(result).toBeDefined();
      expect(result.data).toHaveLength(1);
      expect(mockListUsersUseCase.execute).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('returns a user by id', async () => {
      // Arrange
      mockFindUserByIdUseCase.execute.mockResolvedValue(mockUserEntity);

      // Act
      const result = await controller.findOne(mockUserId);

      // Assert
      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
      expect(mockFindUserByIdUseCase.execute).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe('update', () => {
    it('updates a user successfully', async () => {
      // Arrange
      const updateUserDto: UpdateUserDto = {
        email: 'updated@example.com',
        fullName: 'Updated User',
      };
      mockUpdateUserUseCase.execute.mockResolvedValue(mockUserEntity);

      // Act
      const result = await controller.update(
        mockUserId,
        updateUserDto,
        mockJwtPayload,
      );

      // Assert
      expect(result).toBeDefined();
      expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith(
        mockUserId,
        updateUserDto,
        mockCurrentUserId,
      );
    });
  });

  describe('remove', () => {
    it('deletes a user successfully', async () => {
      // Arrange
      mockSoftDeleteUserUseCase.execute.mockResolvedValue({
        message: 'Usuario eliminado exitosamente',
      });

      // Act
      const result = await controller.remove(mockUserId);

      // Assert
      expect(result).toEqual({ message: 'Usuario eliminado exitosamente' });
      expect(mockSoftDeleteUserUseCase.execute).toHaveBeenCalledWith(
        mockUserId,
      );
    });
  });

  describe('updateRole', () => {
    it('updates user role successfully', async () => {
      // Arrange
      const updateUserRoleDto: UpdateUserRoleDto = {
        roleId: 'new-role-uuid-789',
      };
      const updatedUserEntity = {
        ...mockUserEntity,
        getRoleId: () => 'new-role-uuid-789',
        getRole: () => ({ id: 'new-role-uuid-789', name: 'user' }),
      };
      mockUpdateUserRoleUseCase.execute.mockResolvedValue(updatedUserEntity);

      // Act
      const result = await controller.updateRole(mockUserId, updateUserRoleDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.roleId).toBe('new-role-uuid-789');
      expect(mockUpdateUserRoleUseCase.execute).toHaveBeenCalledWith(
        mockUserId,
        updateUserRoleDto,
      );
    });
  });
});
