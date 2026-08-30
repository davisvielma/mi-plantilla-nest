import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenUseCase } from './refresh-token.use-case';
import { USER_REPOSITORY } from '@/modules/users/domain/repositories';
import { TOKEN_BLACKLIST_REPOSITORY } from '../../domain/repositories';
import { RefreshTokenDto } from '../dtos';
import { ROLES } from '@/modules/shared/constants';
import { UserEntity } from '@/modules/users/domain/entities';

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;

  const mockRefreshTokenDto: RefreshTokenDto = {
    refreshToken: 'valid-refresh-token',
  };

  const mockDecodedToken = {
    sub: 'user-uuid-123',
    email: 'test@example.com',
    fullName: 'Test User',
    role: { id: 'role-uuid-456', name: ROLES.USER },
    iat: 1704067200,
    exp: 1704585600,
  };

  const mockUserEntity = {
    getId: () => 'user-uuid-123',
    getEmail: () => 'test@example.com',
    getFullName: () => 'Test User',
    getRoleId: () => 'role-uuid-456',
    getPassword: () => 'hashed-password',
    getRole: () => ({ id: 'role-uuid-456', name: ROLES.USER }),
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

  const mockBlacklistRepository = {
    add: jest.fn(),
    isBlacklisted: jest.fn(),
    cleanExpired: jest.fn(),
  };

  const mockJwtService = {
    verify: jest.fn(),
    sign: jest.fn(),
    decode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenUseCase,
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
        {
          provide: TOKEN_BLACKLIST_REPOSITORY,
          useValue: mockBlacklistRepository,
        },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    useCase = module.get<RefreshTokenUseCase>(RefreshTokenUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('refreshes tokens successfully with valid refresh token', async () => {
    // Arrange
    mockJwtService.verify.mockReturnValue(mockDecodedToken);
    mockBlacklistRepository.isBlacklisted.mockResolvedValue(false);
    mockUserRepository.findById.mockResolvedValue(mockUserEntity);
    mockJwtService.decode.mockReturnValue(mockDecodedToken);
    mockBlacklistRepository.add.mockResolvedValue(undefined);
    mockJwtService.sign.mockReturnValue('new-token');

    // Act
    const result = await useCase.execute(mockRefreshTokenDto);

    // Assert
    expect(result).toBeDefined();
    expect(result.accessToken).toBe('new-token');
    expect(result.refreshToken).toBe('new-token');
    expect(result.user.email).toBe('test@example.com');
    expect(mockJwtService.verify).toHaveBeenCalledWith('valid-refresh-token');
    expect(mockBlacklistRepository.isBlacklisted).toHaveBeenCalledWith(
      'valid-refresh-token',
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith('user-uuid-123');
    expect(mockBlacklistRepository.add).toHaveBeenCalled();
    expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
  });

  it('throws UnauthorizedException when token is invalid', async () => {
    // Arrange
    mockJwtService.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    // Act & Assert
    await expect(useCase.execute(mockRefreshTokenDto)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockJwtService.verify).toHaveBeenCalledWith('valid-refresh-token');
  });

  it('throws UnauthorizedException when token is blacklisted', async () => {
    // Arrange
    mockJwtService.verify.mockReturnValue(mockDecodedToken);
    mockBlacklistRepository.isBlacklisted.mockResolvedValue(true);

    // Act & Assert
    await expect(useCase.execute(mockRefreshTokenDto)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockBlacklistRepository.isBlacklisted).toHaveBeenCalledWith(
      'valid-refresh-token',
    );
    expect(mockUserRepository.findById).not.toHaveBeenCalled();
  });

  it('throws UnauthorizedException when user does not exist', async () => {
    // Arrange
    mockJwtService.verify.mockReturnValue(mockDecodedToken);
    mockBlacklistRepository.isBlacklisted.mockResolvedValue(false);
    mockUserRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(mockRefreshTokenDto)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith('user-uuid-123');
    expect(mockBlacklistRepository.add).not.toHaveBeenCalled();
  });
});
