import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '@/modules/shared/dto/page-options.dto';

/**
 * DTO para Consultar Usuarios
 *
 * Define los filtros opcionales para buscar usuarios.
 * Hereda de PageOptionsDto para soportar paginación.
 */
export class QueryUsersDto extends PageOptionsDto {
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
