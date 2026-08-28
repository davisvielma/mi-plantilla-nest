import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de Respuesta de Autenticación
 *
 * Define la estructura de respuesta al autenticar un usuario.
 */
export class AuthResponseDto {
  @ApiProperty({
    description: 'Access token JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @ApiProperty({
    description: 'Refresh token JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken!: string;

  @ApiProperty({
    description: 'Información del usuario autenticado',
    example: {
      id: 'uuid-del-usuario',
      email: 'usuario@ejemplo.com',
      fullName: 'Juan Pérez',
      role: {
        id: 'uuid-del-rol',
        name: 'user',
      },
    },
  })
  user!: {
    id: string;
    email: string;
    fullName: string;
    role: {
      id: string;
      name: string;
    };
  };
}
