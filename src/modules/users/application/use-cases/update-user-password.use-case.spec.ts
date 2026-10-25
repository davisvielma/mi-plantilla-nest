import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserPasswordUseCase } from './update-user-password.use-case';
import { USER_REPOSITORY } from '../../domain/repositories';
import { UpdateUserPasswordDto } from '../dtos';
import { UserEntity } from '../../domain/entities';
import { comparePasswords, hashPassword } from '@/modules/shared/utils';
import { MESSAGES } from '@/modules/shared/constants';

jest.mock('@/modules/shared/utils', () => ({
  comparePasswords: jest.fn(),
  hashPassword: jest.fn(),
}));

describe('UpdateUserPasswordUseCase', () => {
  let useCase: UpdateUserPasswordUseCase;

  const mockCurrentUserId = 'user-uuid-123';

  const mockDto: UpdateUserPasswordDto = {
    currentPassword: 'CurrentPass123',
    newPassword: 'NewPass456',
  };

  const mockUpdatePassword = jest.fn();

  const mockUserEntity = {
    getId: () => mockCurrentUserId,
    getPassword: () => 'hashed-password',
    updatePassword: mockUpdatePassword,
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
        UpdateUserPasswordUseCase,
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
      ],
    }).compile();

    useCase = module.get<UpdateUserPasswordUseCase>(UpdateUserPasswordUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updates the password when the current password is valid', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(mockUserEntity);
    (comparePasswords as jest.Mock)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    (hashPassword as jest.Mock).mockResolvedValue('new-hashed-password');
    mockUserRepository.save.mockResolvedValue(mockUserEntity);

    // Act
    const result = await useCase.execute(mockDto, mockCurrentUserId);

    // Assert
    expect(result).toBeDefined();
    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockCurrentUserId);
    expect(hashPassword).toHaveBeenCalledWith(mockDto.newPassword);
    expect(mockUpdatePassword).toHaveBeenCalledWith('new-hashed-password');
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUserEntity);
  });

  it('throws NotFoundException when the user does not exist', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(mockDto, mockCurrentUserId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws BadRequestException when the current password is incorrect', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(mockUserEntity);
    (comparePasswords as jest.Mock).mockResolvedValueOnce(false);

    // Act & Assert
    await expect(useCase.execute(mockDto, mockCurrentUserId)).rejects.toThrow(
      BadRequestException,
    );
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('throws BadRequestException when the new password equals the current one', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(mockUserEntity);
    (comparePasswords as jest.Mock)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true);

    // Act & Assert
    await expect(useCase.execute(mockDto, mockCurrentUserId)).rejects.toThrow(
      MESSAGES.PASSWORD_SAME_AS_CURRENT,
    );
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('throws InternalServerErrorException when the user cannot be saved', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(mockUserEntity);
    (comparePasswords as jest.Mock)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    (hashPassword as jest.Mock).mockResolvedValue('new-hashed-password');
    mockUserRepository.save.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(mockDto, mockCurrentUserId)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
