import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateUserRoleUseCase } from './update-user-role.use-case';
import { USER_REPOSITORY, ROLE_REPOSITORY } from '../../domain/repositories';
import { UpdateUserRoleDto } from '../dtos';
import { RoleEntity, UserEntity } from '../../domain/entities';

describe('UpdateUserRoleUseCase', () => {
  let useCase: UpdateUserRoleUseCase;

  const mockUserId = 'user-uuid-123';
  const mockRoleId = 'role-uuid-456';
  const mockNewRoleId = 'role-uuid-789';

  const mockUpdateUserRoleDto: UpdateUserRoleDto = {
    roleId: mockNewRoleId,
  };

  const mockRoleEntity = {
    getId: () => mockNewRoleId,
    getName: () => 'user',
  } as unknown as RoleEntity;

  const mockUserEntity = {
    getId: () => mockUserId,
    getEmail: () => 'test@example.com',
    getFullName: () => 'Test User',
    getRoleId: () => mockRoleId,
    getPassword: () => 'hashed-password',
    updateRole: jest.fn(),
  } as unknown as UserEntity;

  const mockUpdatedUserEntity = {
    ...mockUserEntity,
    getRoleId: () => mockNewRoleId,
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
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserRoleUseCase,
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
        { provide: ROLE_REPOSITORY, useValue: mockRoleRepository },
      ],
    }).compile();

    useCase = module.get<UpdateUserRoleUseCase>(UpdateUserRoleUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updates user role successfully', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(mockUserEntity);
    mockRoleRepository.findById.mockResolvedValue(mockRoleEntity);
    mockUserRepository.save.mockResolvedValue(mockUpdatedUserEntity);

    // Act
    const result = await useCase.execute(mockUserId, mockUpdateUserRoleDto);

    // Assert
    expect(result).toBeDefined();
    expect(result.getRoleId()).toBe(mockNewRoleId);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
    expect(mockRoleRepository.findById).toHaveBeenCalledWith(mockNewRoleId);
    expect(mockUserRepository.save).toHaveBeenCalled();
  });

  it('throws NotFoundException when user does not exist', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      useCase.execute(mockUserId, mockUpdateUserRoleDto),
    ).rejects.toThrow(NotFoundException);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
    expect(mockRoleRepository.findById).not.toHaveBeenCalled();
  });

  it('throws InternalServerErrorException when role does not exist', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(mockUserEntity);
    mockRoleRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      useCase.execute(mockUserId, mockUpdateUserRoleDto),
    ).rejects.toThrow(InternalServerErrorException);
    expect(mockRoleRepository.findById).toHaveBeenCalledWith(mockNewRoleId);
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('throws InternalServerErrorException when save fails', async () => {
    // Arrange
    mockUserRepository.findById.mockResolvedValue(mockUserEntity);
    mockRoleRepository.findById.mockResolvedValue(mockRoleEntity);
    mockUserRepository.save.mockResolvedValue(null);

    // Act & Assert
    await expect(
      useCase.execute(mockUserId, mockUpdateUserRoleDto),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
