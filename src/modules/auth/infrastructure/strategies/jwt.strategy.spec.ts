import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtStrategy } from './jwt.strategy';
import { USER_REPOSITORY } from '@/modules/users/domain/repositories';
import { TOKEN_BLACKLIST_REPOSITORY } from '../../domain/repositories';
import { ROLES } from '@/modules/shared/constants';
import { UserEntity } from '@/modules/users/domain/entities';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockPayload = {
    sub: 'user-uuid-123',
    email: 'test@example.com',
    fullName: 'Test User',
    role: { id: 'role-uuid-456', name: ROLES.USER },
  };

  const mockUserEntity = {
    getId: () => 'user-uuid-123',
    getEmail: () => 'test@example.com',
    getFullName: () => 'Test User',
    getRoleId: () => 'role-uuid-456',
    getPassword: () => 'hashed-password',
    getRole: () => ({ id: 'role-uuid-456', name: ROLES.USER }),
    getDeletedAt: () => undefined,
  } as unknown as UserEntity;

  const createMockRequest = (authHeader?: string): Request =>
    ({
      get: jest.fn((field: string) =>
        field.toLowerCase() === 'authorization' ? authHeader : undefined,
      ),
    }) as unknown as Request;

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

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue('jwt-secret'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
        {
          provide: TOKEN_BLACKLIST_REPOSITORY,
          useValue: mockBlacklistRepository,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('returns user payload when token is valid and user exists', async () => {
      // Arrange
      const request = createMockRequest('Bearer valid-token');
      mockBlacklistRepository.isBlacklisted.mockResolvedValue(false);
      mockUserRepository.findById.mockResolvedValue(mockUserEntity);

      // Act
      const result = await strategy.validate(request, mockPayload);

      // Assert
      expect(result).toEqual({
        sub: 'user-uuid-123',
        email: 'test@example.com',
        fullName: 'Test User',
        role: { id: 'role-uuid-456', name: ROLES.USER },
      });
      expect(mockBlacklistRepository.isBlacklisted).toHaveBeenCalledWith(
        'valid-token',
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-uuid-123');
    });

    it('throws UnauthorizedException when token is blacklisted', async () => {
      // Arrange
      const request = createMockRequest('Bearer blacklisted-token');
      mockBlacklistRepository.isBlacklisted.mockResolvedValue(true);

      // Act & Assert
      await expect(strategy.validate(request, mockPayload)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockBlacklistRepository.isBlacklisted).toHaveBeenCalledWith(
        'blacklisted-token',
      );
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
    });

    it('throws UnauthorizedException when user does not exist', async () => {
      // Arrange
      const request = createMockRequest('Bearer valid-token');
      mockBlacklistRepository.isBlacklisted.mockResolvedValue(false);
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(strategy.validate(request, mockPayload)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-uuid-123');
    });

    it('throws UnauthorizedException when user is deleted', async () => {
      // Arrange
      const request = createMockRequest('Bearer valid-token');
      const deletedUserEntity = {
        ...mockUserEntity,
        getDeletedAt: () => new Date(),
      };
      mockBlacklistRepository.isBlacklisted.mockResolvedValue(false);
      mockUserRepository.findById.mockResolvedValue(deletedUserEntity);

      // Act & Assert
      await expect(strategy.validate(request, mockPayload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('validates when request has no authorization header', async () => {
      // Arrange
      const request = createMockRequest(undefined);
      mockBlacklistRepository.isBlacklisted.mockResolvedValue(false);
      mockUserRepository.findById.mockResolvedValue(mockUserEntity);

      // Act
      const result = await strategy.validate(request, mockPayload);

      // Assert
      expect(result).toBeDefined();
      expect(mockBlacklistRepository.isBlacklisted).not.toHaveBeenCalled();
    });
  });
});
