import {
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MovieFiltersDto {
  @ApiPropertyOptional({
    description: 'Filtrar por título de la película',
    example: 'Padrino',
  })
  @IsOptional()
  @IsString({ message: 'El título debe ser una cadena de texto' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de categoría',
    example: 3,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La categoría debe ser un número' })
  @IsInt({ message: 'La categoría debe ser un número entero' })
  @Min(1, { message: 'La categoría debe ser un número positivo' })
  @Type(() => Number)
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La página debe ser un número' })
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(1, { message: 'La página debe ser al menos 1' })
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de elementos por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El límite debe ser un número' })
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite debe ser al menos 1' })
  @Max(100, { message: 'El límite debe ser máximo 100' })
  @Type(() => Number)
  limit?: number = 10;
}
