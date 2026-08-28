import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IRole } from '../../domain/interfaces';

/**
 * DTO de Respuesta de Usuario
 *
 * Define la estructura de respuesta al devolver información de un usuario.
 * Nunca incluye el password.
 */
export class UserResponseDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: 'uuid-del-usuario',
  })
  id!: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Pérez',
  })
  fullName!: string;

  @ApiProperty({
    description: 'ID del rol',
    example: 'uuid-del-rol',
  })
  roleId!: string;

  @ApiPropertyOptional({
    description: 'Información del rol',
    example: { id: 'uuid', name: 'user' },
  })
  role?: Omit<IRole, 'createdAt'>;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiPropertyOptional({
    description: 'Fecha de última actualización',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt?: Date;
}
