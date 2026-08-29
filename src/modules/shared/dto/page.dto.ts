import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from './page-meta.dto';

/**
 * DTO de respuesta paginada
 *
 * Wrapper genérico para respuestas que contienen datos paginados.
 *
 * @template T Tipo de los elementos en el array data
 */
export class PageDto<T> {
  @ApiProperty({ description: 'Array de datos' })
  readonly data: T[];

  @ApiProperty({ description: 'Metadata de paginación' })
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
