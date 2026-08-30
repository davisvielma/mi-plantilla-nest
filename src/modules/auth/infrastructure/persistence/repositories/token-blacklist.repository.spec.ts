import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TokenBlacklistRepository } from './token-blacklist.repository';
import { TokenBlacklistOrmEntity } from '../entities';

describe('TokenBlacklistRepository', () => {
  let repository: TokenBlacklistRepository;

  const mockToken = 'jwt-access-token-123';
  const mockUserId = 'user-uuid-456';
  const mockExpiresAt = new Date('2024-12-31');

  const mockTypeOrmRepository = {
    create: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenBlacklistRepository,
        {
          provide: getRepositoryToken(TokenBlacklistOrmEntity),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<TokenBlacklistRepository>(TokenBlacklistRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('creates and saves a token to the blacklist', async () => {
      // Arrange
      const mockEntity = {
        id: 'uuid-123',
        token: mockToken,
        userId: mockUserId,
        type: 'access',
        expiresAt: mockExpiresAt,
      };
      mockTypeOrmRepository.create.mockReturnValue(mockEntity);
      mockTypeOrmRepository.save.mockResolvedValue(mockEntity);

      // Act
      await repository.add(mockToken, mockUserId, 'access', mockExpiresAt);

      // Assert
      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(mockEntity);
    });

    it('creates a refresh token entry', async () => {
      // Arrange
      const mockEntity = {
        id: 'uuid-456',
        token: mockToken,
        userId: mockUserId,
        type: 'refresh',
        expiresAt: mockExpiresAt,
      };
      mockTypeOrmRepository.create.mockReturnValue(mockEntity);
      mockTypeOrmRepository.save.mockResolvedValue(mockEntity);

      // Act
      await repository.add(mockToken, mockUserId, 'refresh', mockExpiresAt);

      // Assert
      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(mockEntity);
    });
  });

  describe('isBlacklisted', () => {
    it('returns true when token is blacklisted', async () => {
      // Arrange
      mockTypeOrmRepository.count.mockResolvedValue(1);

      // Act
      const result = await repository.isBlacklisted(mockToken);

      // Assert
      expect(result).toBe(true);
      expect(mockTypeOrmRepository.count).toHaveBeenCalledWith({
        where: { token: mockToken },
      });
    });

    it('returns false when token is not blacklisted', async () => {
      // Arrange
      mockTypeOrmRepository.count.mockResolvedValue(0);

      // Act
      const result = await repository.isBlacklisted(mockToken);

      // Assert
      expect(result).toBe(false);
      expect(mockTypeOrmRepository.count).toHaveBeenCalledWith({
        where: { token: mockToken },
      });
    });
  });

  describe('cleanExpired', () => {
    it('deletes tokens that have expired', async () => {
      // Arrange
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 5 });

      // Act
      await repository.cleanExpired();

      // Assert
      expect(mockTypeOrmRepository.delete).toHaveBeenCalled();
    });
  });
});
