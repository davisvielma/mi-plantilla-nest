import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * DTO para Logout
 *
 * Define los campos opcionales para cerrar la sesión.
 * El refresh token permite revocar el grant completo, no solo el access token.
 */
export class LogoutDto {
  @ApiPropertyOptional({
    description: 'Refresh token para revocar la sesión completa',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsOptional()
  @IsString({
    message: 'El refresh token debe ser una cadena de caracteres',
  })
  refreshToken?: string;
}
