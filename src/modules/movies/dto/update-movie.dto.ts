import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  IsArray,
  IsInt,
  IsPositive,
  MinLength,
  MaxLength,
  IsUrl,
  Min,
  Max,
} from 'class-validator';

export class UpdateMovieDto {
  @ApiPropertyOptional({
    description: 'Título de la película',
    example: 'El Padrino',
    minLength: 1,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'El título debe tener al menos 1 carácter' })
  @MaxLength(255, { message: 'El título no puede exceder 255 caracteres' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Descripción breve de la película',
    example:
      'Una obra maestra del cine que narra la historia de una familia mafiosa...',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Sinopsis detallada de la película',
    example:
      'Don Vito Corleone es el patriarca de una de las cinco familias que dominan el crimen organizado...',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'La sinopsis no puede exceder 2000 caracteres' })
  synopsis?: string;

  @ApiPropertyOptional({
    description: 'Fecha de estreno de la película',
    example: '1972-03-24',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de estreno debe ser válida' })
  releaseDate?: string;

  @ApiPropertyOptional({
    description: 'Duración de la película en minutos',
    example: 175,
    minimum: 1,
    maximum: 600,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La duración debe ser un número' })
  @IsInt({ message: 'La duración debe ser un número entero' })
  @IsPositive({ message: 'La duración debe ser un número positivo' })
  @Min(1, { message: 'La duración mínima es 1 minuto' })
  @Max(600, { message: 'La duración máxima es 600 minutos' })
  duration?: number;

  @ApiPropertyOptional({
    description: 'Clasificación de la película',
    example: 'R',
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'TE', 'T', '+13', '+16', '+18'],
  })
  @IsOptional()
  @IsString()
  rating?: string;

  @ApiPropertyOptional({
    description: 'Director de la película',
    example: 'Francis Ford Coppola',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'El director no puede exceder 255 caracteres' })
  director?: string;

  @ApiPropertyOptional({
    description: 'Reparto principal de la película',
    example: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cast?: string[];

  @ApiPropertyOptional({
    description: 'Géneros de la película',
    example: ['Drama', 'Crimen'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];

  @ApiPropertyOptional({
    description: 'País de origen de la película',
    example: 'Estados Unidos',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'El país no puede exceder 100 caracteres' })
  country?: string;

  @ApiPropertyOptional({
    description: 'Idioma original de la película',
    example: 'Inglés',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'El idioma no puede exceder 50 caracteres' })
  language?: string;

  @ApiPropertyOptional({
    description: 'ID de la categoría de la película',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El ID de categoría debe ser un número' })
  @IsInt({ message: 'El ID de categoría debe ser un número entero' })
  @IsPositive({ message: 'El ID de categoría debe ser un número positivo' })
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Calificación en IMDb',
    example: 9.2,
    minimum: 0,
    maximum: 10,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La calificación de IMDb debe ser un número' })
  @Min(0, { message: 'La calificación mínima es 0' })
  @Max(10, { message: 'La calificación máxima es 10' })
  imdbRating?: number;

  @ApiPropertyOptional({
    description: 'URL del póster de la película',
    example: 'https://example.com/poster.jpg',
    format: 'url',
  })
  @IsOptional()
  @IsUrl({}, { message: 'El póster debe ser una URL válida' })
  poster?: string;

  @ApiPropertyOptional({
    description: 'URL del tráiler de la película',
    example: 'https://youtube.com/watch?v=example',
    format: 'url',
  })
  @IsOptional()
  @IsUrl({}, { message: 'El tráiler debe ser una URL válida' })
  trailer?: string;
}
