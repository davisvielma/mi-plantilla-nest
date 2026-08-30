import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindUserByIdUseCase } from './find-user-by-id.use-case';
import { USER_REPOSITORY } from '../../domain/repositories';
import { UserEntity } from '../../domain/entities';

describe('FindUserByIdUseCase', () => {
  let useCase: FindUserByIdUseCase;

  const mockUserId = 'user-uuid-123';

  const mockUserEntity = {
    getId: () => mockUserId,
    getEmail: () => 'test@example.com',
    getFullName: () => 'Test User',
    getRoleId: () => 'role-uuid-456',
    getPassword: () => 'hashed-password',
    getCreatedAt: () => new Date(),
    getUpdatedAt: () => undefined,
    getDeletedAt: () => undefined,
    isDeleted: () => false,
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
        FindUserByIdUseCase,
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
      ],
    }).compile();

    useCase = module.get<FindUserByIdUseCase>(FindUserByIdUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns a user when found', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(mockUserEntity);

    // Act
    const result = await useCase.execute(mockUserId);

    // Assert
    expect(result).toBeDefined();
    expect(result.getId()).toBe(mockUserId);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
  });

  it('throws NotFoundException when user does not exist', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(mockUserId)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
  });
});
