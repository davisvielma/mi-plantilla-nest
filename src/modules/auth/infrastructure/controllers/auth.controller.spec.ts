import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import {
  LoginUseCase,
  RefreshTokenUseCase,
  LogoutUseCase,
  RegisterUseCase,
} from '../../application/use-cases';
import { LoginDto, RegisterDto, RefreshTokenDto } from '../../application/dtos';
import { Request } from 'express';

describe('AuthController', () => {
  let controller: AuthController;

  const mockLoginUseCase = {
    execute: jest.fn(),
  };

  const mockRefreshTokenUseCase = {
    execute: jest.fn(),
  };

  const mockLogoutUseCase = {
    execute: jest.fn(),
  };

  const mockRegisterUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: LoginUseCase, useValue: mockLoginUseCase },
        { provide: RefreshTokenUseCase, useValue: mockRefreshTokenUseCase },
        { provide: LogoutUseCase, useValue: mockLogoutUseCase },
        { provide: RegisterUseCase, useValue: mockRegisterUseCase },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('returns auth response on successful login', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'ValidPass123',
      };
      const expectedResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: 'user-uuid-123',
          email: 'test@example.com',
          fullName: 'Test User',
          role: { id: 'role-uuid-456', name: 'user' },
        },
      };
      mockLoginUseCase.execute.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockLoginUseCase.execute).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('register', () => {
    it('returns auth response on successful registration', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'ValidPass123',
        fullName: 'New User',
      };
      const expectedResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: 'user-uuid-123',
          email: 'newuser@example.com',
          fullName: 'New User',
          role: { id: 'role-uuid-456', name: 'user' },
        },
      };
      mockRegisterUseCase.execute.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.register(registerDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockRegisterUseCase.execute).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('refreshToken', () => {
    it('returns new tokens on successful refresh', async () => {
      // Arrange
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'valid-refresh-token',
      };
      const expectedResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: {
          id: 'user-uuid-123',
          email: 'test@example.com',
          fullName: 'Test User',
          role: { id: 'role-uuid-456', name: 'user' },
        },
      };
      mockRefreshTokenUseCase.execute.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.refreshToken(refreshTokenDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockRefreshTokenUseCase.execute).toHaveBeenCalledWith(
        refreshTokenDto,
      );
    });
  });

  describe('logout', () => {
    it('returns success message on successful logout', async () => {
      // Arrange
      const request = {
        headers: { authorization: 'Bearer valid-token' },
      } as unknown as Request;
      const expectedResponse = { message: 'Sesión cerrada exitosamente' };
      mockLogoutUseCase.execute.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.logout(request);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockLogoutUseCase.execute).toHaveBeenCalledWith(request);
    });
  });
});
