import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

/**
 * DTO para Actualizar Usuario
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
  @IsString({
    message: 'El nombre completo debe ser una cadena de caracteres.',
  })
  @MinLength(3, {
    message: 'El nombre completo debe tener al menos 3 caracteres',
  })
  @MaxLength(255, {
    message: 'El nombre completo no puede exceder los 255 caracteres',
  })
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Contraseña del usuario (mínimo 8 caracteres)',
    example: 'MiContraseña123',
    minLength: 8,
  })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de caracteres' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password?: string;
}
