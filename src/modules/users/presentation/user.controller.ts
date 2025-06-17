import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from '../application/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { MarkMovieAsViewedDto } from '../dto/mark-movie-viewed.dto';
import { UserMovieResponseDto } from '../dto/user-movie-response.dto';
import { PaginatedResponseDto } from '../../../shared/dto/paginated-response.dto';
import { ErrorResponseDto } from '../../../shared/dto/error-response.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
    description:
      'Crea un nuevo usuario en el sistema con validaciones de negocio',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario creado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El email ya está registrado',
    type: ErrorResponseDto,
  })
  async createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return await this.userService.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener lista de usuarios',
    description: 'Retorna una lista paginada de todos los usuarios activos',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (por defecto: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Número de elementos por página (por defecto: 10)',
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuarios obtenida exitosamente',
    type: PaginatedResponseDto,
  })
  async findAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    return await this.userService.findAllUsers({
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener usuario por ID',
    description: 'Retorna los detalles de un usuario específico por su ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del usuario',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario encontrado',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
    type: ErrorResponseDto,
  })
  async findUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return await this.userService.findUserById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar usuario',
    description: 'Actualiza los datos de un usuario existente',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del usuario a actualizar',
    example: 1,
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario actualizado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
    type: ErrorResponseDto,
  })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar usuario',
    description:
      'Realiza eliminación lógica de un usuario (marca como inactivo)',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del usuario a eliminar',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Usuario eliminado exitosamente',
        },
        userId: {
          type: 'number',
          example: 1,
        },
        deletedAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-06-17T01:45:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
    type: ErrorResponseDto,
  })
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; userId: number; deletedAt: string }> {
    await this.userService.deleteUser(id);
    return {
      message: 'Usuario eliminado exitosamente',
      userId: id,
      deletedAt: new Date().toISOString(),
    };
  }

  @Post(':id/movies/:movieId/mark-viewed')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Marcar película como vista',
    description:
      'Permite a un usuario marcar una película como vista, con rating y review opcionales',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del usuario',
    example: 1,
  })
  @ApiParam({
    name: 'movieId',
    type: Number,
    description: 'ID de la película',
    example: 1,
  })
  @ApiBody({ type: MarkMovieAsViewedDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Película marcada como vista exitosamente',
    type: UserMovieResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario o película no encontrados',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'La película ya fue marcada como vista por este usuario',
    type: ErrorResponseDto,
  })
  async markMovieAsViewed(
    @Param('id', ParseIntPipe) userId: number,
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body(ValidationPipe) markMovieViewedDto: MarkMovieAsViewedDto,
  ): Promise<UserMovieResponseDto> {
    return await this.userService.markMovieAsViewed(
      userId,
      movieId,
      markMovieViewedDto,
    );
  }

  @Get(':id/movies')
  @ApiOperation({
    summary: 'Obtener películas vistas por el usuario',
    description:
      'Retorna la lista de películas que ha visto un usuario específico',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del usuario',
    example: 1,
  })
  @ApiQuery({
    name: 'onlyFavorites',
    required: false,
    type: Boolean,
    description: 'Filtrar solo películas marcadas como favoritas',
    example: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de películas vistas por el usuario',
    type: [UserMovieResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
    type: ErrorResponseDto,
  })
  async getUserMovies(
    @Param('id', ParseIntPipe) userId: number,
    @Query('onlyFavorites') onlyFavorites?: boolean,
  ): Promise<UserMovieResponseDto[]> {
    return await this.userService.getUserMovies(userId, {
      onlyFavorites: onlyFavorites === true,
    });
  }

  @Get('with-movies')
  @ApiOperation({
    summary: 'Listar usuarios con sus películas vistas',
    description:
      'Retorna todos los usuarios activos con la lista de películas que han visto',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuarios con sus películas vistas',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              firstName: { type: 'string', example: 'Juan' },
              lastName: { type: 'string', example: 'Pérez' },
              email: { type: 'string', example: 'juan@example.com' },
              fullName: { type: 'string', example: 'Juan Pérez' },
            },
          },
          movies: {
            type: 'array',
            items: { $ref: '#/components/schemas/UserMovieResponseDto' },
          },
        },
      },
    },
  })
  async getUsersWithMovies(): Promise<any[]> {
    return await this.userService.getUsersWithMovies();
  }
}
