import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsIn, Max, Min } from 'class-validator';

/**
 * DTO de opciones de paginación
 *
 * Genérico y reutilizable para cualquier endpoint que requiera paginación.
 */
export class PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Número de página',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Registros por página',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Campo para ordenar',
    default: 'createdAt',
  })
  @IsOptional()
  sort: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Dirección del orden',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC' = 'DESC';
}
