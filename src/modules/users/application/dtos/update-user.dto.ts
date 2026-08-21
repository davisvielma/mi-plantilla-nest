import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

/**
 * ★ DTO para Actualizar Usuario
 *
 * Define los campos que un usuario puede actualizar de su perfil.
 * No incluye roleId - para eso está el endpoint de cambio de rol.
 */
export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Email del usuario',
    example: 'nuevo@email.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'El formato del email es inválido' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez Actualizado',
    minLength: 3,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, {
    message: 'El nombre completo debe tener al menos 3 caracteres',
  })
  @MaxLength(255, {
    message: 'El nombre completo no puede exceder los 255 caracteres',
  })
  fullName?: string;
}
