import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUseCase } from './login.use-case';
import { USER_REPOSITORY } from '@/modules/users/domain/repositories';
import { LoginDto } from '../dtos';
import { comparePasswords } from '@/modules/shared/utils';
import { UserEntity } from '@/modules/users/domain/entities';

jest.mock('@/modules/shared/utils', () => ({
  comparePasswords: jest.fn(),
}));

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  const mockLoginDto: LoginDto = {
    email: 'test@example.com',
    password: 'ValidPass123',
  };

  const mockUserEntity = {
    getId: () => 'user-uuid-123',
    getEmail: () => 'test@example.com',
    getFullName: () => 'Test User',
    getRoleId: () => 'role-uuid-456',
    getPassword: () => 'hashed-password',
    getRole: () => ({ id: 'role-uuid-456', name: 'admin' }),
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

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns access and refresh tokens on successful login', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(mockUserEntity);
    (comparePasswords as jest.Mock).mockResolvedValue(true);
    mockJwtService.sign.mockReturnValue('mock-token');

    // Act
    const result = await useCase.execute(mockLoginDto);

    // Assert
    expect(result).toBeDefined();
    expect(result.accessToken).toBe('mock-token');
    expect(result.refreshToken).toBe('mock-token');
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
    expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
  });

  it('throws UnauthorizedException when user does not exist', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(mockLoginDto)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
  });

  it('throws UnauthorizedException when password is invalid', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(mockUserEntity);
    (comparePasswords as jest.Mock).mockResolvedValue(false);

    // Act & Assert
    await expect(useCase.execute(mockLoginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
