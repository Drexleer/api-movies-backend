import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  lastName: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  fullName: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: '+57 300 123 4567',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario',
    example: '1990-05-15',
    required: false,
  })
  dateOfBirth?: Date;

  @ApiProperty({
    description: 'Edad del usuario',
    example: 33,
    required: false,
  })
  age?: number;

  @ApiProperty({
    description: 'URL del avatar del usuario',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar?: string;

  @ApiProperty({
    description: 'Estado activo del usuario',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2025-06-16T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-06-16T10:30:00Z',
  })
  updatedAt: Date;

  @Exclude()
  password: string;
}
