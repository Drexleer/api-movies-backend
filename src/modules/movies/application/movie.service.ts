import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IMovieRepository,
  MovieFilters,
  PaginatedResult,
} from '../domain/repositories/movie.repository.interface';
import { CategoryRepositoryInterface } from '../domain/repositories/category.repository.interface';
import { Movie } from '../domain/movie.entity';
import { Category } from '../domain/category.entity';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { MovieResponseDto } from '../dto/movie-response.dto';
import { CategoryResponseDto } from '../dto/category-response.dto';
import { MovieFiltersDto } from '../dto/movie-filters.dto';
import { PaginatedResponseDto } from '../../../shared/dto/paginated-response.dto';

@Injectable()
export class MovieService {
  constructor(
    @Inject('IMovieRepository')
    private readonly movieRepository: IMovieRepository,
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,
  ) {}

  async createMovie(createMovieDto: CreateMovieDto): Promise<MovieResponseDto> {
    // Validar que la categoría existe
    const category = await this.categoryRepository.findById(
      createMovieDto.categoryId,
    );
    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createMovieDto.categoryId} not found`,
      );
    }

    const movie = Movie.create(
      createMovieDto.title,
      createMovieDto.description,
      createMovieDto.synopsis,
      new Date(createMovieDto.releaseDate),
      createMovieDto.duration,
      createMovieDto.rating,
      createMovieDto.director,
      createMovieDto.cast,
      createMovieDto.genres,
      createMovieDto.country,
      createMovieDto.language,
      createMovieDto.categoryId,
      createMovieDto.imdbRating,
      createMovieDto.poster,
      createMovieDto.trailer,
    );

    const savedMovie = await this.movieRepository.create(movie);
    return this.mapMovieToResponseDto(savedMovie);
  }

  async findAllMovies(
    filters: MovieFiltersDto,
  ): Promise<PaginatedResponseDto<MovieResponseDto>> {
    const movieFilters: MovieFilters = {
      categoryId: filters.categoryId,
      genre: filters.genre,
      year: filters.year,
      rating: filters.rating,
      search: filters.search,
      page: filters.page,
      limit: filters.limit,
    };

    const result = await this.movieRepository.findAll(movieFilters);
    const movieDtos = result.data.map((movie) =>
      this.mapMovieToResponseDto(movie),
    );

    return {
      data: movieDtos,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasPreviousPage: result.page > 1,
      hasNextPage: result.page < result.totalPages,
    };
  }

  async findMovieById(id: number): Promise<MovieResponseDto> {
    const movie = await this.movieRepository.findById(id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return this.mapMovieToResponseDto(movie);
  }

  async updateMovie(
    id: number,
    updateMovieDto: UpdateMovieDto,
  ): Promise<MovieResponseDto> {
    const existingMovie = await this.movieRepository.findById(id);
    if (!existingMovie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    // Si se está actualizando la categoría, validar que existe
    if (updateMovieDto.categoryId) {
      const category = await this.categoryRepository.findById(
        updateMovieDto.categoryId,
      );
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateMovieDto.categoryId} not found`,
        );
      }
    }

    // Crear película actualizada con los nuevos valores
    const updatedMovie = Movie.create(
      updateMovieDto.title ?? existingMovie.title,
      updateMovieDto.description ?? existingMovie.description,
      updateMovieDto.synopsis ?? existingMovie.synopsis,
      updateMovieDto.releaseDate
        ? new Date(updateMovieDto.releaseDate)
        : existingMovie.releaseDate,
      updateMovieDto.duration ?? existingMovie.duration,
      updateMovieDto.rating ?? existingMovie.rating,
      updateMovieDto.director ?? existingMovie.director,
      updateMovieDto.cast ?? existingMovie.cast,
      updateMovieDto.genres ?? existingMovie.genres,
      updateMovieDto.country ?? existingMovie.country,
      updateMovieDto.language ?? existingMovie.language,
      updateMovieDto.categoryId ?? existingMovie.categoryId,
      updateMovieDto.imdbRating ?? existingMovie.imdbRating,
      updateMovieDto.poster ?? existingMovie.poster,
      updateMovieDto.trailer ?? existingMovie.trailer,
    );

    // Mantener el ID original - usar Object.assign para establecer el ID
    Object.assign(updatedMovie, { id });

    const savedMovie = await this.movieRepository.update(id, updatedMovie);
    return this.mapMovieToResponseDto(savedMovie);
  }

  async deleteMovie(id: number): Promise<void> {
    const movie = await this.movieRepository.findById(id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    await this.movieRepository.delete(id);
  }

  async findNewMovies(): Promise<MovieResponseDto[]> {
    const movies = await this.movieRepository.findNewMovies();
    return movies.map((movie) => this.mapMovieToResponseDto(movie));
  }

  async getAllCategories(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.findAll();
    return categories.map((category) =>
      this.mapCategoryToResponseDto(category),
    );
  }

  // Métodos privados para mapeo
  private mapMovieToResponseDto(movie: Movie): MovieResponseDto {
    return {
      id: movie.id as number,
      title: movie.title,
      description: movie.description,
      synopsis: movie.synopsis,
      releaseDate: movie.releaseDate,
      duration: movie.duration,
      durationFormatted: movie.durationFormatted,
      rating: movie.rating,
      director: movie.director,
      cast: movie.cast,
      genres: movie.genres,
      country: movie.country,
      language: movie.language,
      categoryId: movie.categoryId,
      imdbRating: movie.imdbRating,
      poster: movie.poster,
      trailer: movie.trailer,
      isNewRelease: movie.isNewRelease,
      isClassic: movie.isClassic,
      isActive: movie.isActive,
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
    };
  }

  private mapCategoryToResponseDto(category: Category): CategoryResponseDto {
    return {
      id: category.id as number,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  // Métodos legacy para mantener compatibilidad
  async create(
    title: string,
    description: string,
    synopsis: string,
    releaseDate: Date,
    duration: number,
    rating: string,
    director: string,
    cast: string[],
    genres: string[],
    country: string,
    language: string,
    categoryId: number,
    imdbRating?: number,
    poster?: string,
    trailer?: string,
  ): Promise<Movie> {
    const createMovieDto: CreateMovieDto = {
      title,
      description,
      synopsis,
      releaseDate: releaseDate.toISOString().split('T')[0],
      duration,
      rating,
      director,
      cast,
      genres,
      country,
      language,
      categoryId,
      imdbRating,
      poster,
      trailer,
    };

    const movieResponse = await this.createMovie(createMovieDto);
    return (await this.movieRepository.findById(movieResponse.id)) as Movie;
  }

  async findAll(filters: MovieFilters): Promise<PaginatedResult<Movie>> {
    return this.movieRepository.findAll(filters);
  }

  async findById(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findById(id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }
}
