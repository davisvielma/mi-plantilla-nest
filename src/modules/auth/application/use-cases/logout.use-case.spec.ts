import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LogoutUseCase } from './logout.use-case';
import { TOKEN_BLACKLIST_REPOSITORY } from '../../domain/repositories';
import { MESSAGES } from '@/modules/shared/constants';
import { Request } from 'express';

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;

  const mockDecodedToken = {
    sub: 'user-uuid-123',
    email: 'test@example.com',
    fullName: 'Test User',
    role: { id: 'role-uuid-456', name: 'user' },
    iat: 1704067200,
    exp: 1704585600,
  };

  const createMockRequest = (authHeader?: string): Request => {
    return {
      headers: {
        authorization: authHeader,
      },
    } as unknown as Request;
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
        LogoutUseCase,
        {
          provide: TOKEN_BLACKLIST_REPOSITORY,
          useValue: mockBlacklistRepository,
        },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    useCase = module.get<LogoutUseCase>(LogoutUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('logs out successfully and blacklists the token', async () => {
    // Arrange
    const request = createMockRequest('Bearer valid-access-token');
    mockJwtService.verify.mockReturnValue(mockDecodedToken);
    mockBlacklistRepository.isBlacklisted.mockResolvedValue(false);
    mockJwtService.decode.mockReturnValue(mockDecodedToken);
    mockBlacklistRepository.add.mockResolvedValue(undefined);

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result).toEqual({ message: MESSAGES.LOGOUT_SUCCESS });
    expect(mockJwtService.verify).toHaveBeenCalledWith('valid-access-token');
    expect(mockBlacklistRepository.isBlacklisted).toHaveBeenCalledWith(
      'valid-access-token',
    );
    expect(mockBlacklistRepository.add).toHaveBeenCalledWith(
      'valid-access-token',
      'user-uuid-123',
      'access',
      expect.any(Date),
    );
  });

  it('returns success when token is already blacklisted', async () => {
    // Arrange
    const request = createMockRequest('Bearer blacklisted-token');
    mockJwtService.verify.mockReturnValue(mockDecodedToken);
    mockBlacklistRepository.isBlacklisted.mockResolvedValue(true);

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result).toEqual({ message: MESSAGES.LOGOUT_SUCCESS });
    expect(mockBlacklistRepository.isBlacklisted).toHaveBeenCalledWith(
      'blacklisted-token',
    );
    expect(mockBlacklistRepository.add).not.toHaveBeenCalled();
  });

  it('throws UnauthorizedException when authorization header is missing', async () => {
    // Arrange
    const request = createMockRequest(undefined);

    // Act & Assert
    await expect(useCase.execute(request)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws UnauthorizedException when authorization header does not start with Bearer', async () => {
    // Arrange
    const request = createMockRequest('InvalidHeader');

    // Act & Assert
    await expect(useCase.execute(request)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws UnauthorizedException when token is invalid', async () => {
    // Arrange
    const request = createMockRequest('Bearer invalid-token');
    mockJwtService.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    // Act & Assert
    await expect(useCase.execute(request)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockJwtService.verify).toHaveBeenCalledWith('invalid-token');
  });
});
