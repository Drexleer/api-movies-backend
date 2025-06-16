import { ApiProperty } from '@nestjs/swagger';

export class MovieResponseDto {
  @ApiProperty({
    description: 'ID único de la película',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Título de la película',
    example: 'El Padrino',
  })
  title: string;

  @ApiProperty({
    description: 'Descripción de la película',
    example: 'Una saga épica sobre una familia mafiosa italiana en América.',
  })
  description: string;

  @ApiProperty({
    description: 'Sinopsis completa de la película',
    example:
      'Don Vito Corleone es el patriarca de una de las cinco familias...',
  })
  synopsis: string;

  @ApiProperty({
    description: 'Fecha de estreno de la película',
    example: '1972-03-24',
  })
  releaseDate: Date;

  @ApiProperty({
    description: 'Duración de la película en minutos',
    example: 175,
  })
  duration: number;

  @ApiProperty({
    description: 'Duración formateada (ej: 2h 55m)',
    example: '2h 55m',
  })
  durationFormatted: string;

  @ApiProperty({
    description: 'Clasificación de la película',
    example: 'R',
  })
  rating: string;

  @ApiProperty({
    description: 'Director de la película',
    example: 'Francis Ford Coppola',
  })
  director: string;

  @ApiProperty({
    description: 'Reparto principal',
    example: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    type: [String],
  })
  cast: string[];

  @ApiProperty({
    description: 'Géneros de la película',
    example: ['Drama', 'Crimen'],
    type: [String],
  })
  genres: string[];

  @ApiProperty({
    description: 'País de origen',
    example: 'Estados Unidos',
  })
  country: string;

  @ApiProperty({
    description: 'Idioma original',
    example: 'Inglés',
  })
  language: string;

  @ApiProperty({
    description: 'ID de la categoría',
    example: 3,
  })
  categoryId: number;

  @ApiProperty({
    description: 'Calificación IMDB',
    example: 9.2,
    required: false,
  })
  imdbRating?: number;

  @ApiProperty({
    description: 'URL del póster',
    example: 'https://example.com/poster.jpg',
    required: false,
  })
  poster?: string;

  @ApiProperty({
    description: 'URL del tráiler',
    example: 'https://youtube.com/watch?v=abc123',
    required: false,
  })
  trailer?: string;

  @ApiProperty({
    description: 'Si la película es una novedad (estreno < 3 semanas)',
    example: true,
  })
  isNewRelease: boolean;

  @ApiProperty({
    description: 'Si la película es un clásico (> 25 años)',
    example: true,
  })
  isClassic: boolean;

  @ApiProperty({
    description: 'Estado activo de la película',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2025-06-16T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-06-16T10:30:00Z',
  })
  updatedAt: Date;
}
