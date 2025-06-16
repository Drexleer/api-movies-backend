import { ApiProperty } from '@nestjs/swagger';

export class UserMovieResponseDto {
  @ApiProperty({
    description: 'ID único del registro',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID del usuario',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'ID de la película',
    example: 1,
  })
  movieId: number;

  @ApiProperty({
    description: 'Fecha y hora en que se marcó como vista',
    example: '2025-06-16T10:30:00Z',
  })
  viewedAt: Date;

  @ApiProperty({
    description: 'Calificación del usuario (1-5 estrellas)',
    example: 4,
    required: false,
  })
  rating?: number;

  @ApiProperty({
    description: 'Reseña del usuario',
    example: 'Excelente película, muy recomendada.',
    required: false,
  })
  review?: string;

  @ApiProperty({
    description: 'Si es favorita del usuario',
    example: true,
  })
  isFavorite: boolean;

  @ApiProperty({
    description: 'Tiempo visto en minutos',
    example: 175,
    required: false,
  })
  watchTime?: number;

  @ApiProperty({
    description: 'Si completó la película',
    example: true,
  })
  completedMovie: boolean;
}
