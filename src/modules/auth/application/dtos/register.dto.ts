import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

/**
 * DTO para Registro de Usuario
 *
 * Define los campos necesarios para registrar un nuevo usuario.
 */
export class RegisterDto {
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
}
