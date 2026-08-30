import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.use-case';
import { USER_REPOSITORY, ROLE_REPOSITORY } from '../../domain/repositories';
import { CreateUserDto } from '../dtos';
import { RoleEntity, UserEntity } from '../../domain/entities';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;

  const mockRoleId = 'role-uuid-123';
  const mockUserId = 'user-uuid-456';

  const mockCreateUserDto: CreateUserDto = {
    email: 'test@example.com',
    password: 'ValidPass123',
    fullName: 'Test User',
    roleId: mockRoleId,
  };

  const mockRoleEntity = {
    getId: () => mockRoleId,
    getName: () => 'admin',
  } as unknown as RoleEntity;

  const mockUserEntity = {
    getId: () => mockUserId,
    getEmail: () => 'test@example.com',
    getFullName: () => 'Test User',
    getRoleId: () => mockRoleId,
    getPassword: () => 'hashed-password',
  } as unknown as UserEntity;

  const mockUserRepository = {
    existsByEmail: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    softDelete: jest.fn(),
    findByRole: jest.fn(),
    findDeleted: jest.fn(),
  };

  const mockRoleRepository = {
    findById: jest.fn(),
    findByName: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
        { provide: ROLE_REPOSITORY, useValue: mockRoleRepository },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a user successfully when email is unique and role exists', async () => {
    // Arrange
    mockUserRepository.existsByEmail.mockResolvedValue(false);
    mockRoleRepository.findById.mockResolvedValue(mockRoleEntity);
    mockUserRepository.save.mockResolvedValue(mockUserEntity);

    // Act
    const result = await useCase.execute(mockCreateUserDto);

    // Assert
    expect(result).toBeDefined();
    expect(result.getId()).toBe(mockUserId);
    expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
    expect(mockRoleRepository.findById).toHaveBeenCalledWith(mockRoleId);
    expect(mockUserRepository.save).toHaveBeenCalled();
  });

  it('throws ConflictException when email already exists', async () => {
    // Arrange
    mockUserRepository.existsByEmail.mockResolvedValue(true);

    // Act & Assert
    await expect(useCase.execute(mockCreateUserDto)).rejects.toThrow(
      ConflictException,
    );
    expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
    expect(mockRoleRepository.findById).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when role does not exist', async () => {
    // Arrange
    mockUserRepository.existsByEmail.mockResolvedValue(false);
    mockRoleRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(mockCreateUserDto)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockRoleRepository.findById).toHaveBeenCalledWith(mockRoleId);
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('throws when save fails', async () => {
    // Arrange
    mockUserRepository.existsByEmail.mockResolvedValue(false);
    mockRoleRepository.findById.mockResolvedValue(mockRoleEntity);
    mockUserRepository.save.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(mockCreateUserDto)).rejects.toThrow();
  });
});
