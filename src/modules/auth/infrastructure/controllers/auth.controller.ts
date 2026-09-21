import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  LoginDto,
  RefreshTokenDto,
  AuthResponseDto,
  RegisterDto,
  LogoutDto,
} from '../../application/dtos';
import {
  GetCurrentUserUseCase,
  LoginUseCase,
  RefreshTokenUseCase,
  LogoutUseCase,
  RegisterUseCase,
} from '../../application/use-cases';
import { Public, CurrentUser } from '@/modules/shared/decorators';
import { type JwtPayload } from '@/modules/shared/interfaces';
import { UserResponseDto } from '@/modules/users/application/dtos';

/**
 * Controller de Autenticación
 *
 * Adaptador HTTP para la autenticación de usuarios.
 * Endpoints para login, refresh token y logout.
 */
@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario obtenido exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  async getMe(@CurrentUser() user: JwtPayload): Promise<UserResponseDto> {
    return this.getCurrentUserUseCase.execute(user.sub);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar usuario' })
  @ApiResponse({
    status: 200,
    description: 'Autenticación exitosa',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.loginUseCase.execute(dto);
  }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registro de usuario' })
  @ApiResponse({
    status: 201,
    description: 'Registro exitoso',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: 'El email ya está registrado' })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.registerUseCase.execute(dto);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refrescar access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refrescado exitosamente',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async refreshToken(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.refreshTokenUseCase.execute(dto);
  }

  @Post('logout')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Sesión cerrada exitosamente. Logout idempotente (RFC 7009)',
  })
  @ApiResponse({ status: 401, description: 'Token no proporcionado' })
  async logout(
    @Req() request: Request,
    @Body() dto: LogoutDto,
  ): Promise<{ message: string }> {
    return this.logoutUseCase.execute(request, dto);
  }
}
