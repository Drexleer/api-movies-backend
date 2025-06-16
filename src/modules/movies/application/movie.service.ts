import { Injectable } from '@nestjs/common';
import {
  IMovieRepository,
  ICategoryRepository,
  MovieFilters,
  PaginatedResult,
} from '../domain/repositories/movie.repository.interface';
import { Movie } from '../domain/movie.entity';

@Injectable()
export class MovieService {
  constructor(
    private readonly movieRepository: IMovieRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

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
    // Validar que la categoría existe
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    const movie = Movie.create(
      title,
      description,
      synopsis,
      releaseDate,
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
    );
    return this.movieRepository.create(movie);
  }

  async findAll(filters: MovieFilters): Promise<PaginatedResult<Movie>> {
    return this.movieRepository.findAll(filters);
  }

  async findById(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findById(id);
    if (!movie) {
      throw new Error('Movie not found');
    }
    return movie;
  }

  async findNewMovies(): Promise<Movie[]> {
    return this.movieRepository.findNewMovies();
  }

  async getAllCategories() {
    return this.categoryRepository.findAll();
  }
}
