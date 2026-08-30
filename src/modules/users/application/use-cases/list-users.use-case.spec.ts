import { Test, TestingModule } from '@nestjs/testing';
import { ListUsersUseCase } from './list-users.use-case';
import { USER_REPOSITORY } from '../../domain/repositories';
import { QueryUsersDto } from '../dtos';
import { UserEntity } from '../../domain/entities';

describe('ListUsersUseCase', () => {
  let useCase: ListUsersUseCase;

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
  } as unknown as UserEntity;

  const mockQuery: QueryUsersDto = {
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'DESC',
  };

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
        ListUsersUseCase,
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
      ],
    }).compile();

    useCase = module.get<ListUsersUseCase>(ListUsersUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns paginated users', async () => {
    // Arrange
    mockUserRepository.findAll.mockResolvedValue({
      data: [mockUserEntity],
      total: 1,
    });

    // Act
    const result = await useCase.execute(mockQuery);

    // Assert
    expect(result).toBeDefined();
    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
    expect(mockUserRepository.findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      sort: 'createdAt',
      order: 'DESC',
      filters: {
        email: undefined,
        roleId: undefined,
        fullName: undefined,
      },
    });
  });

  it('returns empty array when no users exist', async () => {
    // Arrange
    mockUserRepository.findAll.mockResolvedValue({
      data: [],
      total: 0,
    });

    // Act
    const result = await useCase.execute(mockQuery);

    // Assert
    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(0);
  });

  it('applies email filter when provided', async () => {
    // Arrange
    const queryWithEmail: QueryUsersDto = {
      ...mockQuery,
      email: 'test',
    };
    mockUserRepository.findAll.mockResolvedValue({
      data: [mockUserEntity],
      total: 1,
    });

    // Act
    await useCase.execute(queryWithEmail);

    // Assert
    expect(mockUserRepository.findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      sort: 'createdAt',
      order: 'DESC',
      filters: {
        email: 'test',
        roleId: undefined,
        fullName: undefined,
      },
    });
  });
});
