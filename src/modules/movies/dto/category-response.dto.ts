import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'ID único de la categoría',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Acción',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción de la categoría',
    example: 'Películas llenas de acción, aventura y adrenalina',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Estado activo de la categoría',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación de la categoría',
    example: '2025-06-16T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-06-16T10:30:00Z',
  })
  updatedAt: Date;
}
