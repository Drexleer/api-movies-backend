import { Movie } from '../movie.entity';
import { Category } from '../category.entity';

export interface MovieFilters {
  search?: string;
  categoryId?: number;
  genre?: string;
  year?: number;
  rating?: string;
  page?: number;
  limit?: number;
  sortByReleaseDate?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IMovieRepository {
  create(movie: Movie): Promise<Movie>;
  findById(id: number): Promise<Movie | null>;
  findAll(filters: MovieFilters): Promise<PaginatedResult<Movie>>;
  findNewMovies(): Promise<Movie[]>;
  update(id: number, movie: Partial<Movie>): Promise<Movie>;
  delete(id: number): Promise<void>;
}

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
}
