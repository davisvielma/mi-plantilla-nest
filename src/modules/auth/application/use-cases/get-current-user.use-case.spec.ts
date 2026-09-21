import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { GetCurrentUserUseCase } from './get-current-user.use-case';
import { USER_REPOSITORY } from '@/modules/users/domain/repositories';
import { UserEntity } from '@/modules/users/domain/entities';

describe('GetCurrentUserUseCase', () => {
  let useCase: GetCurrentUserUseCase;

  const userId = 'user-uuid-123';

  const mockUserEntity = {
    getId: () => userId,
    getEmail: () => 'test@example.com',
    getFullName: () => 'Test User',
    getRoleId: () => 'role-uuid-456',
    getRole: () => ({ id: 'role-uuid-456', name: 'admin' }),
    getCreatedAt: () => new Date(),
    getUpdatedAt: () => undefined,
    getDeletedAt: () => undefined,
  } as unknown as UserEntity;

  const mockUserRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCurrentUserUseCase,
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
      ],
    }).compile();

    useCase = module.get<GetCurrentUserUseCase>(GetCurrentUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns the user response dto when the user exists', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(mockUserEntity);

    // Act
    const result = await useCase.execute(userId);

    // Assert
    expect(result).toBeDefined();
    expect(result.id).toBe(userId);
    expect(result.email).toBe('test@example.com');
    expect(result.fullName).toBe('Test User');
    expect(result.roleId).toBe('role-uuid-456');
    expect(result.role).toEqual({ id: 'role-uuid-456', name: 'admin' });
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
  });

  it('throws UnauthorizedException when the user does not exist', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(userId)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
  });
});
