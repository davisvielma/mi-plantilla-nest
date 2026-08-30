import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUseCase } from './register.use-case';
import {
  USER_REPOSITORY,
  ROLE_REPOSITORY,
} from '@/modules/users/domain/repositories';
import { RegisterDto } from '../dtos';
import { ROLES } from '@/modules/shared/constants';
import { hashPassword } from '@/modules/shared/utils';
import { RoleEntity, UserEntity } from '@/modules/users/domain/entities';

jest.mock('@/modules/shared/utils', () => ({
  hashPassword: jest.fn(),
}));

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;

  const mockRegisterDto: RegisterDto = {
    email: 'newuser@example.com',
    password: 'ValidPass123',
    fullName: 'New User',
  };

  const mockRoleEntity = {
    getId: () => 'role-uuid-user',
    getName: () => ROLES.USER,
  } as unknown as RoleEntity;

  const mockUserEntity = {
    getId: () => 'user-uuid-123',
    getEmail: () => 'newuser@example.com',
    getFullName: () => 'New User',
    getRoleId: () => 'role-uuid-user',
    getPassword: () => 'hashed-password',
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

  const mockRoleRepository = {
    findById: jest.fn(),
    findByName: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUseCase,
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
        { provide: ROLE_REPOSITORY, useValue: mockRoleRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    useCase = module.get<RegisterUseCase>(RegisterUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('registers a new user successfully', async () => {
    // Arrange
    mockUserRepository.existsByEmail.mockResolvedValue(false);
    mockRoleRepository.findByName.mockResolvedValue(mockRoleEntity);
    (hashPassword as jest.Mock).mockResolvedValue('hashed-password');
    mockUserRepository.save.mockResolvedValue(mockUserEntity);
    mockJwtService.sign.mockReturnValue('mock-token');

    // Act
    const result = await useCase.execute(mockRegisterDto);

    // Assert
    expect(result).toBeDefined();
    expect(result.accessToken).toBe('mock-token');
    expect(result.refreshToken).toBe('mock-token');
    expect(result.user.email).toBe('newuser@example.com');
    expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith(
      'newuser@example.com',
    );
    expect(mockRoleRepository.findByName).toHaveBeenCalledWith(ROLES.USER);
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
  });

  it('throws ConflictException when email already exists', async () => {
    // Arrange
    mockUserRepository.existsByEmail.mockResolvedValue(true);

    // Act & Assert
    await expect(useCase.execute(mockRegisterDto)).rejects.toThrow(
      ConflictException,
    );
    expect(mockUserRepository.existsByEmail).toHaveBeenCalledWith(
      'newuser@example.com',
    );
    expect(mockRoleRepository.findByName).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when user role does not exist', async () => {
    // Arrange
    mockUserRepository.existsByEmail.mockResolvedValue(false);
    mockRoleRepository.findByName.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(mockRegisterDto)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockRoleRepository.findByName).toHaveBeenCalledWith(ROLES.USER);
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('throws when save fails', async () => {
    // Arrange
    mockUserRepository.existsByEmail.mockResolvedValue(false);
    mockRoleRepository.findByName.mockResolvedValue(mockRoleEntity);
    (hashPassword as jest.Mock).mockResolvedValue('hashed-password');
    mockUserRepository.save.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(mockRegisterDto)).rejects.toThrow();
  });
});
