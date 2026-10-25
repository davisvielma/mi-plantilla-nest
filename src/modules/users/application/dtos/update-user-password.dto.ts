import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * DTO para Actualizar Contraseña del Usuario
 *
 * Define los campos necesarios para cambiar la contraseña del usuario autenticado.
 */
export class UpdateUserPasswordDto {
  @ApiProperty({
    description: 'Contraseña actual del usuario',
    example: 'Actual1234',
  })
  @IsString({
    message: 'La contraseña actual debe ser una cadena de caracteres',
  })
  @IsNotEmpty({ message: 'La contraseña actual es requerida' })
  currentPassword!: string;

  @ApiProperty({
    description: 'Contraseña nueva del usuario (mínimo 8 caracteres)',
    example: 'NuevaClave456',
    minLength: 8,
    maxLength: 72,
  })
  @IsString({
    message: 'La contraseña nueva debe ser una cadena de caracteres',
  })
  @MinLength(8, {
    message: 'La contraseña nueva debe tener al menos 8 caracteres',
  })
  @MaxLength(72, {
    message: 'La contraseña nueva no puede exceder los 72 caracteres',
  })
  newPassword!: string;
}
