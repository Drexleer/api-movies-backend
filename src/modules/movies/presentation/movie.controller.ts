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
import { MovieService } from '../application/movie.service';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { MovieResponseDto } from '../dto/movie-response.dto';
import { CategoryResponseDto } from '../dto/category-response.dto';
import { MovieFiltersDto } from '../dto/movie-filters.dto';
import { PaginatedResponseDto } from '../../../shared/dto/paginated-response.dto';
import { ErrorResponseDto } from '../../../shared/dto/error-response.dto';

@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear una nueva película',
    description:
      'Crea una nueva película en el sistema con validaciones de negocio',
  })
  @ApiBody({ type: CreateMovieDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Película creada exitosamente',
    type: MovieResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Categoría no encontrada',
    type: ErrorResponseDto,
  })
  async createMovie(
    @Body(ValidationPipe) createMovieDto: CreateMovieDto,
  ): Promise<MovieResponseDto> {
    return await this.movieService.createMovie(createMovieDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener lista de películas',
    description:
      'Retorna una lista paginada de películas con filtros opcionales',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Buscar por título, descripción o director',
    example: 'Padrino',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: Number,
    description: 'Filtrar por ID de categoría',
    example: 1,
  })
  @ApiQuery({
    name: 'genre',
    required: false,
    type: String,
    description: 'Filtrar por género',
    example: 'Drama',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    description: 'Filtrar por año de estreno',
    example: 1972,
  })
  @ApiQuery({
    name: 'rating',
    required: false,
    type: String,
    description: 'Filtrar por clasificación',
    example: 'R',
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
    description: 'Lista de películas obtenida exitosamente',
    type: PaginatedResponseDto,
  })
  async findAllMovies(
    @Query() filters: MovieFiltersDto,
  ): Promise<PaginatedResponseDto<MovieResponseDto>> {
    return await this.movieService.findAllMovies(filters);
  }

  @Get('new-releases')
  @ApiOperation({
    summary: 'Obtener películas de estreno',
    description:
      'Retorna las películas estrenadas en las últimas 3 semanas (novedades)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de películas de estreno obtenida exitosamente',
    type: [MovieResponseDto],
  })
  async findNewMovies(): Promise<MovieResponseDto[]> {
    return await this.movieService.findNewMovies();
  }

  @Get('categories')
  @ApiOperation({
    summary: 'Obtener todas las categorías',
    description: 'Retorna la lista completa de categorías de películas',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de categorías obtenida exitosamente',
    type: [CategoryResponseDto],
  })
  async getAllCategories(): Promise<CategoryResponseDto[]> {
    return await this.movieService.getAllCategories();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener película por ID',
    description: 'Retorna los detalles de una película específica por su ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la película',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Película encontrada',
    type: MovieResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Película no encontrada',
    type: ErrorResponseDto,
  })
  async findMovieById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MovieResponseDto> {
    return await this.movieService.findMovieById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar película',
    description: 'Actualiza los datos de una película existente',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la película a actualizar',
    example: 1,
  })
  @ApiBody({ type: UpdateMovieDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Película actualizada exitosamente',
    type: MovieResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Película no encontrada',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
    type: ErrorResponseDto,
  })
  async updateMovie(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateMovieDto: UpdateMovieDto,
  ): Promise<MovieResponseDto> {
    return await this.movieService.updateMovie(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar película',
    description:
      'Realiza eliminación lógica de una película (marca como inactiva)',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la película a eliminar',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Película eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Película eliminada exitosamente',
        },
        movieId: {
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
    description: 'Película no encontrada',
    type: ErrorResponseDto,
  })
  async deleteMovie(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; movieId: number; deletedAt: string }> {
    await this.movieService.deleteMovie(id);
    return {
      message: 'Película eliminada exitosamente',
      movieId: id,
      deletedAt: new Date().toISOString(),
    };
  }
}
