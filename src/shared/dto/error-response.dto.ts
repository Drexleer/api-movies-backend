import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Email already exists',
  })
  message: string;

  @ApiProperty({
    description: 'Descripción del error',
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
    description: 'Timestamp del error',
    example: '2025-06-16T10:30:00Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Ruta donde ocurrió el error',
    example: '/api/users',
  })
  path: string;
}

export class ValidationErrorResponseDto {
  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Errores de validación detallados',
    example: [
      'El nombre debe tener al menos 2 caracteres',
      'Debe ser un email válido',
    ],
    type: [String],
  })
  message: string[];

  @ApiProperty({
    description: 'Descripción del error',
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
    description: 'Timestamp del error',
    example: '2025-06-16T10:30:00Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Ruta donde ocurrió el error',
    example: '/api/users',
  })
  path: string;
}
