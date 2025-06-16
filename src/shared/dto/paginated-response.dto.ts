import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Datos de la página actual',
    isArray: true,
  })
  data: T[];

  @ApiProperty({
    description: 'Total de elementos en toda la colección',
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: 'Página actual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Elementos por página',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total de páginas disponibles',
    example: 15,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Si hay página anterior disponible',
    example: false,
  })
  hasPreviousPage: boolean;

  @ApiProperty({
    description: 'Si hay página siguiente disponible',
    example: true,
  })
  hasNextPage: boolean;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
    this.hasPreviousPage = page > 1;
    this.hasNextPage = page < this.totalPages;
  }
}
