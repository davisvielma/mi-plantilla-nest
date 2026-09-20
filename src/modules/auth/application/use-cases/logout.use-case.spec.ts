import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LogoutUseCase } from './logout.use-case';
import { TOKEN_BLACKLIST_REPOSITORY } from '../../domain/repositories';
import { MESSAGES } from '@/modules/shared/constants';
import { Request } from 'express';
import { LogoutDto } from '../dtos';

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

  it('blacklists the access token and returns success', async () => {
    // Arrange
    const request = createMockRequest('Bearer valid-access-token');
    mockJwtService.verify.mockReturnValue(mockDecodedToken);
    mockJwtService.decode.mockReturnValue(mockDecodedToken);
    mockBlacklistRepository.isBlacklisted.mockResolvedValue(false);
    mockBlacklistRepository.add.mockResolvedValue(undefined);

    // Act
    const result = await useCase.execute(request, {});

    // Assert
    expect(result).toEqual({ message: MESSAGES.LOGOUT_SUCCESS });
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

  it('blacklists the refresh token when provided', async () => {
    // Arrange
    const request = createMockRequest('Bearer valid-access-token');
    const dto: LogoutDto = { refreshToken: 'valid-refresh-token' };
    mockJwtService.verify.mockReturnValue(mockDecodedToken);
    mockJwtService.decode.mockReturnValue(mockDecodedToken);
    mockBlacklistRepository.isBlacklisted.mockResolvedValue(false);
    mockBlacklistRepository.add.mockResolvedValue(undefined);

    // Act
    const result = await useCase.execute(request, dto);

    // Assert
    expect(result).toEqual({ message: MESSAGES.LOGOUT_SUCCESS });
    expect(mockBlacklistRepository.isBlacklisted).toHaveBeenCalledWith(
      'valid-access-token',
    );
    expect(mockBlacklistRepository.isBlacklisted).toHaveBeenCalledWith(
      'valid-refresh-token',
    );
    expect(mockBlacklistRepository.add).toHaveBeenNthCalledWith(
      1,
      'valid-access-token',
      'user-uuid-123',
      'access',
      expect.any(Date),
    );
    expect(mockBlacklistRepository.add).toHaveBeenNthCalledWith(
      2,
      'valid-refresh-token',
      'user-uuid-123',
      'refresh',
      expect.any(Date),
    );
  });

  it('returns success without persisting when the access token is already blacklisted', async () => {
    // Arrange
    const request = createMockRequest('Bearer blacklisted-token');
    mockJwtService.verify.mockReturnValue(mockDecodedToken);
    mockJwtService.decode.mockReturnValue(mockDecodedToken);
    mockBlacklistRepository.isBlacklisted.mockResolvedValue(true);

    // Act
    const result = await useCase.execute(request, {});

    // Assert
    expect(result).toEqual({ message: MESSAGES.LOGOUT_SUCCESS });
    expect(mockBlacklistRepository.isBlacklisted).toHaveBeenCalledWith(
      'blacklisted-token',
    );
    expect(mockBlacklistRepository.add).not.toHaveBeenCalled();
  });

  it('returns success when the token is invalid or expired', async () => {
    // Arrange
    const request = createMockRequest('Bearer expired-access-token');
    const dto: LogoutDto = { refreshToken: 'expired-refresh-token' };
    mockJwtService.verify.mockImplementation(() => {
      throw new Error('Token expired');
    });

    // Act
    const result = await useCase.execute(request, dto);

    // Assert
    expect(result).toEqual({ message: MESSAGES.LOGOUT_SUCCESS });
    expect(mockBlacklistRepository.add).not.toHaveBeenCalled();
  });

  it('throws UnauthorizedException when authorization header is missing', async () => {
    // Arrange
    const request = createMockRequest(undefined);

    // Act & Assert
    await expect(useCase.execute(request, {})).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws UnauthorizedException when authorization header does not start with Bearer', async () => {
    // Arrange
    const request = createMockRequest('InvalidHeader');

    // Act & Assert
    await expect(useCase.execute(request, {})).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockBlacklistRepository.add).not.toHaveBeenCalled();
  });
});
