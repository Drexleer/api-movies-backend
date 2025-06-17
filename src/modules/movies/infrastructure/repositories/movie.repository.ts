import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IMovieRepository,
  ICategoryRepository,
  MovieFilters,
  PaginatedResult,
} from '../../domain/repositories/movie.repository.interface';
import { Movie } from '../../domain/movie.entity';
import { Category } from '../../domain/category.entity';
import { MovieEntity } from '../entities/movie.entity';
import { CategoryEntity } from '../entities/category.entity';

@Injectable()
export class MovieRepository implements IMovieRepository {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {}

  async create(movie: Movie): Promise<Movie> {
    const movieEntity = this.movieRepository.create({
      title: movie.title,
      description: movie.description,
      synopsis: movie.synopsis,
      releaseDate: movie.releaseDate,
      duration: movie.duration,
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
      isActive: movie.isActive,
    });

    const savedMovie = await this.movieRepository.save(movieEntity);
    return this.mapEntityToDomain(savedMovie);
  }

  async findById(id: number): Promise<Movie | null> {
    const movieEntity = await this.movieRepository.findOne({
      where: { id, isActive: true },
      relations: ['category'],
    });

    return movieEntity ? this.mapEntityToDomain(movieEntity) : null;
  }

  async findAll(filters: MovieFilters): Promise<PaginatedResult<Movie>> {
    const queryBuilder = this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.category', 'category')
      .where('movie.isActive = :isActive', { isActive: true });

    // Aplicar filtros
    if (filters.search) {
      queryBuilder.andWhere(
        '(movie.title ILIKE :search OR movie.description ILIKE :search OR movie.director ILIKE :search)',
        {
          search: `%${filters.search}%`,
        },
      );
    }

    if (filters.categoryId) {
      queryBuilder.andWhere('movie.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    if (filters.genre) {
      queryBuilder.andWhere(':genre = ANY(movie.genres)', {
        genre: filters.genre,
      });
    }

    if (filters.year) {
      queryBuilder.andWhere('EXTRACT(YEAR FROM movie.releaseDate) = :year', {
        year: filters.year,
      });
    }

    if (filters.rating) {
      queryBuilder.andWhere('movie.rating = :rating', {
        rating: filters.rating,
      });
    }

    // Ordenar por fecha de estreno (más reciente primero)
    queryBuilder.orderBy('movie.releaseDate', 'DESC');

    // Paginación
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [movieEntities, total] = await queryBuilder.getManyAndCount();
    const movies = movieEntities.map((entity) =>
      this.mapEntityToDomain(entity),
    );

    return {
      data: movies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findNewMovies(): Promise<Movie[]> {
    const threeWeeksAgo = new Date();
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);

    const movieEntities = await this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.category', 'category')
      .where('movie.isActive = :isActive', { isActive: true })
      .andWhere('movie.releaseDate > :threeWeeksAgo', { threeWeeksAgo })
      .orderBy('movie.releaseDate', 'DESC')
      .getMany();

    return movieEntities.map((entity) => this.mapEntityToDomain(entity));
  }

  async update(id: number, movie: Partial<Movie>): Promise<Movie> {
    await this.movieRepository.update(id, {
      title: movie.title,
      description: movie.description,
      synopsis: movie.synopsis,
      releaseDate: movie.releaseDate,
      duration: movie.duration,
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
      isActive: movie.isActive,
    });

    const updatedMovie = await this.findById(id);
    if (!updatedMovie) {
      throw new Error('Movie not found after update');
    }

    return updatedMovie;
  }

  async delete(id: number): Promise<void> {
    await this.movieRepository.update(id, { isActive: false });
  }

  private mapEntityToDomain(entity: MovieEntity): Movie {
    // Convertir releaseDate de forma defensiva
    const releaseDate =
      entity.releaseDate instanceof Date
        ? entity.releaseDate
        : new Date(entity.releaseDate);

    return new Movie(
      entity.id,
      entity.title,
      entity.description,
      entity.synopsis,
      releaseDate,
      entity.duration,
      entity.rating,
      entity.director,
      entity.cast,
      entity.genres,
      entity.country,
      entity.language,
      entity.categoryId,
      entity.isActive,
      entity.createdAt,
      entity.updatedAt,
      entity.imdbRating,
      entity.poster,
      entity.trailer,
    );
  }
}

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAll(): Promise<Category[]> {
    const categoryEntities = await this.categoryRepository.find({
      order: { name: 'ASC' },
    });

    return categoryEntities.map((entity) => this.mapEntityToDomain(entity));
  }

  async findById(id: number): Promise<Category | null> {
    const categoryEntity = await this.categoryRepository.findOne({
      where: { id },
    });

    return categoryEntity ? this.mapEntityToDomain(categoryEntity) : null;
  }

  private mapEntityToDomain(entity: CategoryEntity): Category {
    return new Category(entity.id, entity.name);
  }
}
