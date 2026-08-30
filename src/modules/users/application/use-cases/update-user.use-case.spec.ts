import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateUserUseCase } from './update-user.use-case';
import { USER_REPOSITORY } from '../../domain/repositories';
import { UpdateUserDto } from '../dtos';
import { UserEntity } from '../../domain/entities';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;

  const mockUserId = 'user-uuid-123';
  const mockCurrentUserId = 'user-uuid-123';

  const mockUpdateUserDto: UpdateUserDto = {
    email: 'updated@example.com',
    fullName: 'Updated User',
    password: 'NewPass123',
  };

  const mockUserEntity = {
    getId: () => mockUserId,
    getEmail: () => 'test@example.com',
    getFullName: () => 'Test User',
    getRoleId: () => 'role-uuid-456',
    getPassword: () => 'hashed-password',
    update: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
      ],
    }).compile();

    useCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updates user successfully when user exists and is the same user', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(mockUserEntity);
    mockUserRepository.existsByEmail.mockResolvedValue(false);
    mockUserRepository.save.mockResolvedValue(mockUserEntity);

    // Act
    const result = await useCase.execute(
      mockUserId,
      mockUpdateUserDto,
      mockCurrentUserId,
    );

    // Assert
    expect(result).toBeDefined();
    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
    expect(mockUserRepository.save).toHaveBeenCalled();
  });

  it('throws NotFoundException when user does not exist', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      useCase.execute(mockUserId, mockUpdateUserDto, mockCurrentUserId),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws ConflictException when user is not the same user', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(mockUserEntity);
    const differentUserId = 'different-user-uuid';

    // Act & Assert
    await expect(
      useCase.execute(mockUserId, mockUpdateUserDto, differentUserId),
    ).rejects.toThrow(ConflictException);
  });

  it('throws ConflictException when email already exists', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(mockUserEntity);
    mockUserRepository.existsByEmail.mockResolvedValue(true);

    // Act & Assert
    await expect(
      useCase.execute(mockUserId, mockUpdateUserDto, mockCurrentUserId),
    ).rejects.toThrow(ConflictException);
  });

  it('does not check email existence when email is not changed', async () => {
    // Arrange
    const mockUpdatedUserEntity = {
      ...mockUserEntity,
      update: jest.fn(),
    };
    mockUserRepository.findById.mockResolvedValue(mockUpdatedUserEntity);
    mockUserRepository.save.mockResolvedValue(mockUpdatedUserEntity);
    const sameEmailDto: UpdateUserDto = {
      email: 'test@example.com',
      fullName: 'Updated User',
    };

    // Act
    await useCase.execute(mockUserId, sameEmailDto, mockCurrentUserId);

    // Assert
    expect(mockUserRepository.existsByEmail).not.toHaveBeenCalled();
  });
});
