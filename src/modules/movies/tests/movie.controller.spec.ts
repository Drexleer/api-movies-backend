import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MovieController } from '../presentation/movie.controller';
import { MovieService } from '../application/movie.service';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { NotFoundException } from '@nestjs/common';

describe('MovieController (Integration)', () => {
  let app: INestApplication;
  let movieService: jest.Mocked<MovieService>;

  const mockMovieResponse = {
    id: 1,
    title: 'Test Movie',
    description: 'Test Description',
    synopsis: 'Test Synopsis',
    releaseDate: new Date('2024-01-01T00:00:00.000Z'),
    duration: 120,
    durationFormatted: '2h 0m',
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
    isNewRelease: false,
    isClassic: false,
    isActive: true,
    createdAt: new Date('2025-06-17T02:45:31.472Z'),
    updatedAt: new Date('2025-06-17T02:45:31.472Z'),
  };

  // HTTP response version with serialized dates (for testing HTTP endpoints)
  const mockMovieHttpResponse = {
    id: 1,
    title: 'Test Movie',
    description: 'Test Description',
    synopsis: 'Test Synopsis',
    releaseDate: '2024-01-01T00:00:00.000Z',
    duration: 120,
    durationFormatted: '2h 0m',
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
    isNewRelease: false,
    isClassic: false,
    isActive: true,
    createdAt: '2025-06-17T02:45:31.472Z',
    updatedAt: '2025-06-17T02:45:31.472Z',
  };

  const mockPaginatedResponse = {
    data: [mockMovieResponse],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  };

  // HTTP response version with serialized dates (for testing HTTP endpoints)
  const mockPaginatedHttpResponse = {
    data: [mockMovieHttpResponse],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  };

  const mockCategoryResponse = {
    id: 1,
    name: 'Drama',
    description: 'Drama movies',
    isActive: true,
    createdAt: new Date('2025-06-17T02:51:02.335Z'),
    updatedAt: new Date('2025-06-17T02:51:02.335Z'),
  };

  // HTTP response version with serialized dates
  const mockCategoryHttpResponse = {
    id: 1,
    name: 'Drama',
    description: 'Drama movies',
    isActive: true,
    createdAt: '2025-06-17T02:51:02.335Z',
    updatedAt: '2025-06-17T02:51:02.335Z',
  };

  beforeEach(async () => {
    const mockMovieServiceMethods = {
      createMovie: jest.fn(),
      findAllMovies: jest.fn(),
      findMovieById: jest.fn(),
      updateMovie: jest.fn(),
      deleteMovie: jest.fn(),
      findNewMovies: jest.fn(),
      getAllCategories: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: mockMovieServiceMethods,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    movieService = module.get<MovieService>(
      MovieService,
    ) as jest.Mocked<MovieService>;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /movies', () => {
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
      movieService.createMovie.mockResolvedValue(mockMovieResponse as any);

      const response = await request(app.getHttpServer())
        .post('/movies')
        .send(createMovieDto)
        .expect(201);

      expect(response.body).toEqual(mockMovieHttpResponse);
      expect(movieService.createMovie).toHaveBeenCalledWith(createMovieDto);
    });

    it('should return 400 for invalid data', async () => {
      const invalidDto = {
        title: '', // Invalid: empty title
        duration: -10, // Invalid: negative duration
      };

      await request(app.getHttpServer())
        .post('/movies')
        .send(invalidDto)
        .expect(400);

      expect(movieService.createMovie).not.toHaveBeenCalled();
    });

    it('should return 404 when category not found', async () => {
      movieService.createMovie.mockRejectedValue(
        new NotFoundException('Category with ID 999 not found'),
      );

      await request(app.getHttpServer())
        .post('/movies')
        .send({ ...createMovieDto, categoryId: 999 })
        .expect(404);
    });
  });

  describe('GET /movies', () => {
    it('should return paginated movies', async () => {
      movieService.findAllMovies.mockResolvedValue(
        mockPaginatedResponse as any,
      );

      const response = await request(app.getHttpServer())
        .get('/movies')
        .expect(200);

      expect(response.body).toEqual(mockPaginatedHttpResponse);
      expect(movieService.findAllMovies).toHaveBeenCalledWith({
        page: undefined,
        limit: undefined,
      });
    });

    it('should apply filters correctly', async () => {
      movieService.findAllMovies.mockResolvedValue(
        mockPaginatedResponse as any,
      );

      await request(app.getHttpServer())
        .get('/movies')
        .query({
          genre: 'Drama',
          year: 2024,
          rating: 'PG-13',
          page: 1,
          limit: 5,
        })
        .expect(200);

      expect(movieService.findAllMovies).toHaveBeenCalledWith({
        genre: 'Drama',
        year: '2024',
        rating: 'PG-13',
        page: '1',
        limit: '5',
      });
    });

    it('should handle search parameter', async () => {
      movieService.findAllMovies.mockResolvedValue(mockPaginatedResponse);

      await request(app.getHttpServer())
        .get('/movies')
        .query({ search: 'Test Movie' })
        .expect(200);

      expect(movieService.findAllMovies).toHaveBeenCalledWith({
        search: 'Test Movie',
        page: undefined,
        limit: undefined,
      });
    });
  });

  describe('GET /movies/new-releases', () => {
    it('should return new movies', async () => {
      movieService.findNewMovies.mockResolvedValue([mockMovieResponse]);

      const response = await request(app.getHttpServer())
        .get('/movies/new-releases')
        .expect(200);

      expect(response.body).toEqual([mockMovieHttpResponse]);
      expect(movieService.findNewMovies).toHaveBeenCalled();
    });
  });

  describe('GET /movies/categories', () => {
    it('should return all categories', async () => {
      movieService.getAllCategories.mockResolvedValue([mockCategoryResponse]);

      const response = await request(app.getHttpServer())
        .get('/movies/categories')
        .expect(200);

      expect(response.body).toEqual([mockCategoryHttpResponse]);
      expect(movieService.getAllCategories).toHaveBeenCalled();
    });
  });

  describe('GET /movies/:id', () => {
    it('should return a movie by id', async () => {
      movieService.findMovieById.mockResolvedValue(mockMovieResponse);

      const response = await request(app.getHttpServer())
        .get('/movies/1')
        .expect(200);

      expect(response.body).toEqual(mockMovieHttpResponse);
      expect(movieService.findMovieById).toHaveBeenCalledWith(1);
    });

    it('should return 404 when movie not found', async () => {
      movieService.findMovieById.mockRejectedValue(
        new NotFoundException('Movie with ID 999 not found'),
      );

      await request(app.getHttpServer()).get('/movies/999').expect(404);
    });

    it('should return 400 for invalid id', async () => {
      await request(app.getHttpServer()).get('/movies/invalid').expect(400);
    });
  });

  describe('PUT /movies/:id', () => {
    const updateMovieDto: UpdateMovieDto = {
      title: 'Updated Movie',
      description: 'Updated Description',
    };

    it('should update a movie successfully', async () => {
      const updatedMovie = { ...mockMovieResponse, title: 'Updated Movie' };
      const updatedMovieHttp = {
        ...mockMovieHttpResponse,
        title: 'Updated Movie',
      };
      movieService.updateMovie.mockResolvedValue(updatedMovie);

      const response = await request(app.getHttpServer())
        .put('/movies/1')
        .send(updateMovieDto)
        .expect(200);

      expect(response.body).toEqual(updatedMovieHttp);
      expect(movieService.updateMovie).toHaveBeenCalledWith(1, updateMovieDto);
    });

    it('should return 404 when movie not found', async () => {
      movieService.updateMovie.mockRejectedValue(
        new NotFoundException('Movie with ID 999 not found'),
      );

      await request(app.getHttpServer())
        .put('/movies/999')
        .send(updateMovieDto)
        .expect(404);
    });

    it('should return 400 for invalid data', async () => {
      const invalidDto = {
        duration: -10, // Invalid: negative duration
        imdbRating: 15, // Invalid: rating > 10
      };

      await request(app.getHttpServer())
        .put('/movies/1')
        .send(invalidDto)
        .expect(400);

      expect(movieService.updateMovie).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /movies/:id', () => {
    it('should delete a movie successfully', async () => {
      movieService.deleteMovie.mockResolvedValue();

      const response = await request(app.getHttpServer())
        .delete('/movies/1')
        .expect(200);

      expect(response.body).toEqual({
        message: 'Película eliminada exitosamente',
        movieId: 1,
        deletedAt: expect.any(String),
      });
      expect(movieService.deleteMovie).toHaveBeenCalledWith(1);
    });

    it('should return 404 when movie not found', async () => {
      movieService.deleteMovie.mockRejectedValue(
        new NotFoundException('Movie with ID 999 not found'),
      );

      await request(app.getHttpServer()).delete('/movies/999').expect(404);
    });

    it('should return 400 for invalid id', async () => {
      await request(app.getHttpServer()).delete('/movies/invalid').expect(400);
    });
  });
});
