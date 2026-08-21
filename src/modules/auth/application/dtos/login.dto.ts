import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * ★ DTO para Login
 *
 * Define los campos necesarios para autenticar un usuario.
 */
export class LoginDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
  })
  @IsEmail({}, { message: 'El formato del email es inválido' })
  email!: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'MiContraseña123',
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;
}
