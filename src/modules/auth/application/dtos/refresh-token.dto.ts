import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO para Refresh Token
 *
 * Define el campo necesario para refrescar el access token.
 */
export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token para obtener un nuevo access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty({ message: 'El refresh token es requerido' })
  refreshToken!: string;
}
