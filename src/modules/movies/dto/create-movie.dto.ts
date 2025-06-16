import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  Max,
  IsUrl,
  ArrayMinSize,
  IsInt,
  IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @ApiProperty({
    description: 'Título de la película',
    example: 'El Padrino',
  })
  @IsNotEmpty({ message: 'El título es requerido' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  title: string;

  @ApiProperty({
    description: 'Descripción corta de la película',
    example: 'Una saga épica sobre una familia mafiosa italiana en América.',
  })
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description: string;

  @ApiProperty({
    description: 'Sinopsis completa de la película',
    example:
      'Don Vito Corleone es el patriarca de una de las cinco familias que ejercen el mando de la Cosa Nostra en Nueva York en los años cuarenta...',
  })
  @IsNotEmpty({ message: 'La sinopsis es requerida' })
  @IsString({ message: 'La sinopsis debe ser una cadena de texto' })
  synopsis: string;

  @ApiProperty({
    description: 'Fecha de estreno de la película',
    example: '1972-03-24',
  })
  @IsNotEmpty({ message: 'La fecha de estreno es requerida' })
  @IsDateString({}, { message: 'Debe ser una fecha válida (YYYY-MM-DD)' })
  releaseDate: string;

  @ApiProperty({
    description: 'Duración de la película en minutos',
    example: 175,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'La duración es requerida' })
  @IsNumber({}, { message: 'La duración debe ser un número' })
  @IsInt({ message: 'La duración debe ser un número entero' })
  @IsPositive({ message: 'La duración debe ser un número positivo' })
  @Min(1, { message: 'La duración debe ser al menos 1 minuto' })
  duration: number;

  @ApiProperty({
    description: 'Clasificación de la película',
    example: 'R',
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
  })
  @IsNotEmpty({ message: 'La clasificación es requerida' })
  @IsString({ message: 'La clasificación debe ser una cadena de texto' })
  rating: string;

  @ApiProperty({
    description: 'Director de la película',
    example: 'Francis Ford Coppola',
  })
  @IsNotEmpty({ message: 'El director es requerido' })
  @IsString({ message: 'El director debe ser una cadena de texto' })
  director: string;

  @ApiProperty({
    description: 'Reparto principal de la película',
    example: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    type: [String],
  })
  @IsNotEmpty({ message: 'El reparto es requerido' })
  @IsArray({ message: 'El reparto debe ser un array' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos un actor' })
  @IsString({ each: true, message: 'Cada actor debe ser una cadena de texto' })
  cast: string[];

  @ApiProperty({
    description: 'Géneros de la película',
    example: ['Drama', 'Crimen'],
    type: [String],
  })
  @IsNotEmpty({ message: 'Los géneros son requeridos' })
  @IsArray({ message: 'Los géneros deben ser un array' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos un género' })
  @IsString({ each: true, message: 'Cada género debe ser una cadena de texto' })
  genres: string[];

  @ApiProperty({
    description: 'País de origen de la película',
    example: 'Estados Unidos',
  })
  @IsNotEmpty({ message: 'El país es requerido' })
  @IsString({ message: 'El país debe ser una cadena de texto' })
  country: string;

  @ApiProperty({
    description: 'Idioma original de la película',
    example: 'Inglés',
  })
  @IsNotEmpty({ message: 'El idioma es requerido' })
  @IsString({ message: 'El idioma debe ser una cadena de texto' })
  language: string;

  @ApiProperty({
    description: 'ID de la categoría de la película',
    example: 3,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'La categoría es requerida' })
  @IsNumber({}, { message: 'La categoría debe ser un número' })
  @IsInt({ message: 'La categoría debe ser un número entero' })
  @IsPositive({ message: 'La categoría debe ser un número positivo' })
  @Type(() => Number)
  categoryId: number;

  @ApiPropertyOptional({
    description: 'Calificación IMDB de la película',
    example: 9.2,
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La calificación IMDB debe ser un número' })
  @Min(1, { message: 'La calificación IMDB debe ser al menos 1' })
  @Max(10, { message: 'La calificación IMDB debe ser máximo 10' })
  imdbRating?: number;

  @ApiPropertyOptional({
    description: 'URL del póster de la película',
    example: 'https://example.com/poster.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'El póster debe ser una URL válida' })
  poster?: string;

  @ApiPropertyOptional({
    description: 'URL del tráiler de la película',
    example: 'https://youtube.com/watch?v=abc123',
  })
  @IsOptional()
  @IsUrl({}, { message: 'El tráiler debe ser una URL válida' })
  trailer?: string;
}
