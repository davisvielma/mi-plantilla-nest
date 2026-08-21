import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from '@/modules/shared/decorators/roles.decorator';
import { CurrentUser } from '@/modules/shared/decorators/current-user.decorator';
import { ValidRoles } from '@/modules/shared/interfaces';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserRoleDto,
  UserResponseDto,
} from '../../application/dtos';
import {
  CreateUserUseCase,
  FindUserByIdUseCase,
  ListUsersUseCase,
  UpdateUserUseCase,
  UpdateUserRoleUseCase,
  SoftDeleteUserUseCase,
} from '../../application/use-cases';

/**
 * ★ Controller de Usuarios
 *
 * Adaptador HTTP para la gestión de usuarios.
 * Endpoints protegidos por autenticación JWT y roles.
 */
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase,
    private readonly softDeleteUserUseCase: SoftDeleteUserUseCase,
  ) {}

  /**
   * ★ Crear un nuevo usuario
   */
  @Post()
  @Roles(ValidRoles.admin)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'El email ya está registrado' })
  async create(
    @Body() dto: CreateUserDto,
    @CurrentUser() user: { roleId: string },
  ): Promise<UserResponseDto> {
    const response = await this.createUserUseCase.execute(dto, user.roleId);

    return {
      id: response.getId(),
      email: response.getEmail(),
      fullName: response.getFullName(),
      roleId: response.getRoleId(),
      createdAt: response.getCreatedAt(),
      updatedAt: response.getUpdatedAt(),
      role: response.getRole(),
    };
  }

  /**
   * ★ Listar todos los usuarios
   */
  @Get()
  @Roles(ValidRoles.admin)
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
    type: [UserResponseDto],
  })
  async findAll(): Promise<UserResponseDto[]> {
    const response = await this.listUsersUseCase.execute();

    return response.map((user) => ({
      id: user.getId(),
      email: user.getEmail(),
      fullName: user.getFullName(),
      roleId: user.getRoleId(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
      role: user.getRole(),
    }));
  }

  /**
   * ★ Obtener un usuario por ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario obtenido exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    const response = await this.findUserByIdUseCase.execute(id);

    return {
      id: response.getId(),
      email: response.getEmail(),
      fullName: response.getFullName(),
      roleId: response.getRoleId(),
      createdAt: response.getCreatedAt(),
      updatedAt: response.getUpdatedAt(),
      role: response.getRole(),
    };
  }

  /**
   * ★ Actualizar perfil de usuario
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar perfil de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: { sub: string },
  ): Promise<UserResponseDto> {
    const response = await this.updateUserUseCase.execute(id, dto, user.sub);

    return {
      id: response.getId(),
      email: response.getEmail(),
      fullName: response.getFullName(),
      roleId: response.getRoleId(),
      createdAt: response.getCreatedAt(),
      updatedAt: response.getUpdatedAt(),
      role: response.getRole(),
    };
  }

  /**
   * ★ Actualizar rol de usuario (solo admin)
   */
  @Patch(':id/role')
  @Roles(ValidRoles.admin)
  @ApiOperation({ summary: 'Actualizar rol de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Rol actualizado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserRoleDto,
  ): Promise<UserResponseDto> {
    const response = await this.updateUserRoleUseCase.execute(id, dto);

    return {
      id: response.getId(),
      email: response.getEmail(),
      fullName: response.getFullName(),
      roleId: response.getRoleId(),
      createdAt: response.getCreatedAt(),
      updatedAt: response.getUpdatedAt(),
      role: response.getRole(),
    };
  }

  /**
   * ★ Eliminar usuario (soft delete)
   */
  @Delete(':id')
  @Roles(ValidRoles.admin)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar usuario (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return this.softDeleteUserUseCase.execute(id);
  }
}
