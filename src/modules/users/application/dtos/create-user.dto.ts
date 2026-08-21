import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';

/**
 * ★ DTO para Crear Usuario
 *
 * Define los campos necesarios para crear un nuevo usuario.
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
  })
  @IsEmail({}, { message: 'El formato del email es inválido' })
  email!: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 8 caracteres)',
    example: 'MiContraseña123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @MinLength(3, {
    message: 'El nombre completo debe tener al menos 3 caracteres',
  })
  @MaxLength(255, {
    message: 'El nombre completo no puede exceder los 255 caracteres',
  })
  fullName!: string;

  @ApiPropertyOptional({
    description: 'ID del rol',
    example: 'uuid-del-rol',
  })
  @IsNotEmpty({ message: 'El ID del rol es requerido' })
  @IsUUID('4', { message: 'El formato del ID del rol es inválido' })
  roleId!: string;
}
