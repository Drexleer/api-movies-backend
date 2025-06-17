import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsDateString,
  IsUrl,
  IsBoolean,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nombre del usuario',
    example: 'Juan Carlos',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Apellido del usuario',
    example: 'Pérez García',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El apellido no puede exceder 100 caracteres' })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del usuario',
    example: 'juan.carlos@ejemplo.com',
    format: 'email',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @MaxLength(100, { message: 'El email no puede exceder 100 caracteres' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono del usuario',
    example: '+1234567890',
    pattern: '^[+]?[1-9]\\d{1,14}$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[+]?[1-9]\d{1,14}$/, {
    message: 'El número de teléfono debe tener un formato válido',
  })
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento del usuario',
    example: '1990-05-15',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser válida' })
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'URL del avatar del usuario',
    example: 'https://ejemplo.com/avatar.jpg',
    format: 'url',
  })
  @IsOptional()
  @IsUrl({}, { message: 'El avatar debe ser una URL válida' })
  @MaxLength(500, {
    message: 'La URL del avatar no puede exceder 500 caracteres',
  })
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Estado activo del usuario',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
