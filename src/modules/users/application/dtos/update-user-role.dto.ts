import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * DTO para Actualizar Rol de Usuario
 *
 * Define el campo necesario para cambiar el rol de un usuario.
 * Solo accesible por administradores.
 */
export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'ID del nuevo rol',
    example: 'uuid-del-rol',
  })
  @IsNotEmpty({ message: 'El ID del rol es requerido' })
  @IsUUID('4', { message: 'El formato del ID del rol es inválido' })
  roleId!: string;
}
