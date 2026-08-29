import { ApiProperty } from '@nestjs/swagger';

/**
 * Metadata de paginación
 *
 * Contiene información sobre el estado de la paginación.
 */
export class PageMetaDto {
  @ApiProperty({ description: 'Total de registros', example: 150 })
  readonly total: number;

  @ApiProperty({ description: 'Página actual', example: 1 })
  readonly page: number;

  @ApiProperty({ description: 'Registros por página', example: 10 })
  readonly limit: number;

  @ApiProperty({ description: 'Total de páginas', example: 15 })
  readonly totalPages: number;

  constructor(total: number, page: number, limit: number) {
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}
