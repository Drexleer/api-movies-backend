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
    description: 'Buscar por título, descripción o director',
    example: 'Padrino',
  })
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser una cadena de texto' })
  search?: string;

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
    description: 'Filtrar por género',
    example: 'Drama',
  })
  @IsOptional()
  @IsString({ message: 'El género debe ser una cadena de texto' })
  genre?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por año de estreno',
    example: 1972,
    minimum: 1900,
    maximum: 2030,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El año debe ser un número' })
  @IsInt({ message: 'El año debe ser un número entero' })
  @Min(1900, { message: 'El año debe ser mayor a 1900' })
  @Max(2030, { message: 'El año debe ser menor a 2030' })
  @Type(() => Number)
  year?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por clasificación',
    example: 'R',
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'TE', 'T', '+13', '+16', '+18'],
  })
  @IsOptional()
  @IsString({ message: 'La clasificación debe ser una cadena de texto' })
  rating?: string;

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

  @ApiPropertyOptional({
    description: 'Ordenar por fecha de estreno',
    example: 'desc',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsString({ message: 'El orden debe ser una cadena de texto' })
  sortByReleaseDate?: 'asc' | 'desc' = 'desc';
}
