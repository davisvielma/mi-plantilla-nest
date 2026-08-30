import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { SoftDeleteUserUseCase } from './soft-delete-user.use-case';
import { USER_REPOSITORY } from '../../domain/repositories';
import { MESSAGES } from '@/modules/shared/constants';
import { UserEntity } from '../../domain/entities';

describe('SoftDeleteUserUseCase', () => {
  let useCase: SoftDeleteUserUseCase;

  const mockUserId = 'user-uuid-123';

  const mockUserEntity = {
    getId: () => mockUserId,
    getEmail: () => 'test@example.com',
    getFullName: () => 'Test User',
    getRoleId: () => 'role-uuid-456',
    getPassword: () => 'hashed-password',
    isDeleted: () => false,
  } as unknown as UserEntity;

  const mockDeletedUserEntity = {
    getId: () => mockUserId,
    getEmail: () => 'test@example.com',
    getFullName: () => 'Test User',
    getRoleId: () => 'role-uuid-456',
    getPassword: () => 'hashed-password',
    isDeleted: () => true,
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
        SoftDeleteUserUseCase,
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
      ],
    }).compile();

    useCase = module.get<SoftDeleteUserUseCase>(SoftDeleteUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deletes a user successfully when user exists and is not deleted', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(mockUserEntity);
    mockUserRepository.softDelete.mockResolvedValue(undefined);

    // Act
    const result = await useCase.execute(mockUserId);

    // Assert
    expect(result).toEqual({ message: MESSAGES.USER_DELETED });
    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
    expect(mockUserRepository.softDelete).toHaveBeenCalledWith(mockUserId);
  });

  it('throws NotFoundException when user does not exist', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(mockUserId)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockUserRepository.softDelete).not.toHaveBeenCalled();
  });

  it('throws ConflictException when user is already deleted', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(mockDeletedUserEntity);

    // Act & Assert
    await expect(useCase.execute(mockUserId)).rejects.toThrow(
      ConflictException,
    );
    expect(mockUserRepository.softDelete).not.toHaveBeenCalled();
  });
});
