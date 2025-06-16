import {
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsPositive,
  IsOptional,
  Min,
  Max,
  IsString,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MarkMovieAsViewedDto {
  @ApiProperty({
    description: 'ID de la película a marcar como vista',
    example: 1,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'El ID de la película es requerido' })
  @IsNumber({}, { message: 'El ID de la película debe ser un número' })
  @IsInt({ message: 'El ID de la película debe ser un número entero' })
  @IsPositive({ message: 'El ID de la película debe ser un número positivo' })
  @Type(() => Number)
  movieId: number;

  @ApiPropertyOptional({
    description: 'Calificación del usuario para la película (1-5 estrellas)',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La calificación debe ser un número' })
  @IsInt({ message: 'La calificación debe ser un número entero' })
  @Min(1, { message: 'La calificación debe ser al menos 1' })
  @Max(5, { message: 'La calificación debe ser máximo 5' })
  rating?: number;

  @ApiPropertyOptional({
    description: 'Reseña del usuario sobre la película',
    example:
      'Excelente película, muy recomendada. La actuación de Al Pacino es impresionante.',
  })
  @IsOptional()
  @IsString({ message: 'La reseña debe ser una cadena de texto' })
  review?: string;

  @ApiPropertyOptional({
    description: 'Si la película es favorita del usuario',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo favorito debe ser verdadero o falso' })
  isFavorite?: boolean = false;

  @ApiPropertyOptional({
    description: 'Tiempo que el usuario vio la película (en minutos)',
    example: 175,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El tiempo visto debe ser un número' })
  @IsInt({ message: 'El tiempo visto debe ser un número entero' })
  @IsPositive({ message: 'El tiempo visto debe ser un número positivo' })
  watchTime?: number;

  @ApiPropertyOptional({
    description: 'Si el usuario completó la película',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo completada debe ser verdadero o falso' })
  completedMovie?: boolean = true;
}
