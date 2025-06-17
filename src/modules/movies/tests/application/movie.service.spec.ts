import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { MovieService } from '../../application/movie.service';
import { Movie } from '../../domain/movie.entity';
import { Category } from '../../domain/category.entity';
import { CreateMovieDto } from '../../dto/create-movie.dto';
import { UpdateMovieDto } from '../../dto/update-movie.dto';
import { MovieFiltersDto } from '../../dto/movie-filters.dto';

describe('MovieService', () => {
  let service: MovieService;
  let mockMovieRepository: any;
  let mockCategoryRepository: any;

  const mockMovie = new Movie(
    1,
    'Test Movie',
    'Test Description',
    'Test Synopsis',
    new Date('2024-01-01'),
    120,
    'PG-13',
    'Test Director',
    ['Actor 1', 'Actor 2'],
    ['Drama', 'Action'],
    'USA',
    'English',
    1,
    true,
    new Date(),
    new Date(),
    8.5,
    'https://example.com/poster.jpg',
    'https://example.com/trailer.mp4',
  );

  const mockCategory = new Category(1, 'Drama');

  beforeEach(async () => {
    mockMovieRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findNewMovies: jest.fn(),
    };

    mockCategoryRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: 'IMovieRepository',
          useValue: mockMovieRepository,
        },
        {
          provide: 'CategoryRepositoryInterface',
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMovie', () => {
    const createMovieDto: CreateMovieDto = {
      title: 'Test Movie',
      description: 'Test Description',
      synopsis: 'Test Synopsis',
      releaseDate: '2024-01-01',
      duration: 120,
      rating: 'PG-13',
      director: 'Test Director',
      cast: ['Actor 1', 'Actor 2'],
      genres: ['Drama', 'Action'],
      country: 'USA',
      language: 'English',
      categoryId: 1,
      imdbRating: 8.5,
      poster: 'https://example.com/poster.jpg',
      trailer: 'https://example.com/trailer.mp4',
    };

    it('should create a movie successfully', async () => {
      mockCategoryRepository.findById.mockResolvedValue(mockCategory);
      mockMovieRepository.create.mockResolvedValue(mockMovie);

      const result = await service.createMovie(createMovieDto);

      expect(mockCategoryRepository.findById).toHaveBeenCalledWith(1);
      expect(mockMovieRepository.create).toHaveBeenCalled();
      expect(result).toMatchObject({
        id: 1,
        title: 'Test Movie',
        description: 'Test Description',
      });
    });

    it('should throw NotFoundException when category does not exist', async () => {
      mockCategoryRepository.findById.mockResolvedValue(null);

      await expect(service.createMovie(createMovieDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCategoryRepository.findById).toHaveBeenCalledWith(1);
      expect(mockMovieRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findMovieById', () => {
    it('should return a movie when found', async () => {
      mockMovieRepository.findById.mockResolvedValue(mockMovie);

      const result = await service.findMovieById(1);

      expect(mockMovieRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toMatchObject({
        id: 1,
        title: 'Test Movie',
      });
    });

    it('should throw NotFoundException when movie does not exist', async () => {
      mockMovieRepository.findById.mockResolvedValue(null);

      await expect(service.findMovieById(999)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockMovieRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('findAllMovies', () => {
    it('should return paginated movies', async () => {
      const mockPaginatedResult = {
        data: [mockMovie],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockMovieRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const filters: MovieFiltersDto = {
        page: 1,
        limit: 10,
      };

      const result = await service.findAllMovies(filters);

      expect(mockMovieRepository.findAll).toHaveBeenCalledWith({
        categoryId: undefined,
        genre: undefined,
        year: undefined,
        rating: undefined,
        search: undefined,
        page: 1,
        limit: 10,
      });
      expect(result).toMatchObject({
        data: expect.any(Array),
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      });
    });

    it('should apply filters correctly', async () => {
      const mockPaginatedResult = {
        data: [mockMovie],
        total: 1,
        page: 1,
        limit: 5,
        totalPages: 1,
      };

      mockMovieRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const filters: MovieFiltersDto = {
        genre: 'Drama',
        year: 2024,
        rating: 'PG-13',
        page: 1,
        limit: 5,
      };

      const result = await service.findAllMovies(filters);

      expect(mockMovieRepository.findAll).toHaveBeenCalledWith({
        categoryId: undefined,
        genre: 'Drama',
        year: 2024,
        rating: 'PG-13',
        search: undefined,
        page: 1,
        limit: 5,
      });
    });
  });

  describe('updateMovie', () => {
    const updateMovieDto: UpdateMovieDto = {
      title: 'Updated Movie',
      description: 'Updated Description',
    };

    it('should update a movie successfully', async () => {
      const updatedMovie = { ...mockMovie, title: 'Updated Movie' };
      mockMovieRepository.findById.mockResolvedValue(mockMovie);
      mockMovieRepository.update.mockResolvedValue(updatedMovie);

      const result = await service.updateMovie(1, updateMovieDto);

      expect(mockMovieRepository.findById).toHaveBeenCalledWith(1);
      expect(mockMovieRepository.update).toHaveBeenCalled();
      expect(result.title).toBe('Updated Movie');
    });

    it('should throw NotFoundException when movie does not exist', async () => {
      mockMovieRepository.findById.mockResolvedValue(null);

      await expect(service.updateMovie(999, updateMovieDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockMovieRepository.findById).toHaveBeenCalledWith(999);
      expect(mockMovieRepository.update).not.toHaveBeenCalled();
    });

    it('should validate category when updating categoryId', async () => {
      const updateWithCategory: UpdateMovieDto = {
        categoryId: 2,
      };

      mockMovieRepository.findById.mockResolvedValue(mockMovie);
      mockCategoryRepository.findById.mockResolvedValue(null);

      await expect(service.updateMovie(1, updateWithCategory)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCategoryRepository.findById).toHaveBeenCalledWith(2);
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie successfully', async () => {
      mockMovieRepository.findById.mockResolvedValue(mockMovie);
      mockMovieRepository.delete.mockResolvedValue(undefined);

      await service.deleteMovie(1);

      expect(mockMovieRepository.findById).toHaveBeenCalledWith(1);
      expect(mockMovieRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when movie does not exist', async () => {
      mockMovieRepository.findById.mockResolvedValue(null);

      await expect(service.deleteMovie(999)).rejects.toThrow(NotFoundException);
      expect(mockMovieRepository.findById).toHaveBeenCalledWith(999);
      expect(mockMovieRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('findNewMovies', () => {
    it('should return new movies', async () => {
      mockMovieRepository.findNewMovies.mockResolvedValue([mockMovie]);

      const result = await service.findNewMovies();

      expect(mockMovieRepository.findNewMovies).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 1,
        title: 'Test Movie',
      });
    });
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      mockCategoryRepository.findAll.mockResolvedValue([mockCategory]);

      const result = await service.getAllCategories();

      expect(mockCategoryRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 1,
        name: 'Drama',
      });
    });
  });
});
