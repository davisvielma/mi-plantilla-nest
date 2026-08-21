import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * ★ DTO para Consultar Usuarios
 *
 * Define los filtros opcionales para buscar usuarios.
 */
export class QueryUsersDto {
  @ApiPropertyOptional({
    description: 'Filtrar por email (búsqueda parcial)',
    example: 'ejemplo',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de rol',
    example: 'uuid-del-rol',
  })
  @IsOptional()
  @IsString()
  roleId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por nombre',
    example: 'Juan Pérez',
  })
  @IsOptional()
  @IsString()
  fullName?: string;
}
