import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

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
  @IsString()
  @IsUUID('4', { message: 'El ID del rol es requerido' })
  roleId!: string;
}
