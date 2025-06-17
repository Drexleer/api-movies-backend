import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UserController } from '../../presentation/user.controller';
import { UserService } from '../../application/user.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UserController (Integration)', () => {
  let app: INestApplication;
  let userService: jest.Mocked<UserService>;

  const mockUserResponse = {
    id: 1,
    firstName: 'Juan',
    lastName: 'Pérez',
    fullName: 'Juan Pérez',
    email: 'juan.perez@email.com',
    phoneNumber: '+57 300 123 4567',
    dateOfBirth: new Date('1990-05-15T00:00:00.000Z'),
    age: 33,
    avatar: 'https://example.com/avatar.jpg',
    isActive: true,
    createdAt: new Date('2025-06-17T02:45:31.472Z'),
    updatedAt: new Date('2025-06-17T02:45:31.472Z'),
  };

  // HTTP response version with serialized dates and without password
  const mockUserHttpResponse = {
    id: 1,
    firstName: 'Juan',
    lastName: 'Pérez',
    fullName: 'Juan Pérez',
    email: 'juan.perez@email.com',
    phoneNumber: '+57 300 123 4567',
    dateOfBirth: '1990-05-15T00:00:00.000Z',
    age: 33,
    avatar: 'https://example.com/avatar.jpg',
    isActive: true,
    createdAt: '2025-06-17T02:45:31.472Z',
    updatedAt: '2025-06-17T02:45:31.472Z',
  };

  const mockPaginatedResponse = {
    data: [mockUserResponse],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  };

  const mockPaginatedHttpResponse = {
    data: [mockUserHttpResponse],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  };

  const mockUserMovieResponse = {
    id: 1,
    userId: 1,
    movieId: 1,
    viewedAt: new Date('2025-06-17T02:45:31.472Z'),
    user: {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@email.com',
    },
    movie: {
      id: 1,
      title: 'Test Movie',
      description: 'Test Description',
      releaseDate: new Date('2024-01-01T00:00:00.000Z'),
      duration: 120,
      rating: 'PG-13',
    },
  };

  const mockUserMovieHttpResponse = {
    id: 1,
    userId: 1,
    movieId: 1,
    viewedAt: '2025-06-17T02:45:31.472Z',
    user: {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@email.com',
    },
    movie: {
      id: 1,
      title: 'Test Movie',
      description: 'Test Description',
      releaseDate: '2024-01-01T00:00:00.000Z',
      duration: 120,
      rating: 'PG-13',
    },
  };

  beforeEach(async () => {
    const mockUserServiceMethods = {
      createUser: jest.fn(),
      findAllUsers: jest.fn(),
      findUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      markMovieAsViewed: jest.fn(),
      getUserMovies: jest.fn(),
      getUsersWithMovies: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserServiceMethods,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    userService = module.get<UserService>(
      UserService,
    ) as jest.Mocked<UserService>;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    const createUserDto: CreateUserDto = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@email.com',
      password: 'Password123!',
      phoneNumber: '+57 300 123 4567',
      dateOfBirth: '1990-05-15',
      avatar: 'https://example.com/avatar.jpg',
    };

    it('should create a user successfully', async () => {
      userService.createUser.mockResolvedValue(mockUserResponse as any);

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toEqual(mockUserHttpResponse);
      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should return 400 for invalid data', async () => {
      const invalidDto = { firstName: '', email: 'invalid-email' };

      await request(app.getHttpServer())
        .post('/users')
        .send(invalidDto)
        .expect(400);

      expect(userService.createUser).not.toHaveBeenCalled();
    });

    it('should return 409 when email already exists', async () => {
      userService.createUser.mockRejectedValue(
        new ConflictException(
          'User with email juan.perez@email.com already exists',
        ),
      );

      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(409);
    });
  });

  describe('GET /users', () => {
    it('should return paginated users', async () => {
      userService.findAllUsers.mockResolvedValue(mockPaginatedResponse as any);

      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body).toEqual(mockPaginatedHttpResponse);
      expect(userService.findAllUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: undefined,
      });
    });

    it('should handle pagination parameters', async () => {
      userService.findAllUsers.mockResolvedValue(mockPaginatedResponse as any);

      const response = await request(app.getHttpServer())
        .get('/users?page=1&limit=5')
        .expect(200);

      expect(response.body).toEqual(mockPaginatedHttpResponse);
      expect(userService.findAllUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 5,
      });
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by id', async () => {
      userService.findUserById.mockResolvedValue(mockUserResponse as any);

      const response = await request(app.getHttpServer())
        .get('/users/1')
        .expect(200);

      expect(response.body).toEqual(mockUserHttpResponse);
      expect(userService.findUserById).toHaveBeenCalledWith(1);
    });

    it('should return 404 when user not found', async () => {
      userService.findUserById.mockRejectedValue(
        new NotFoundException('User with ID 999 not found'),
      );

      await request(app.getHttpServer()).get('/users/999').expect(404);
    });

    it('should return 400 for invalid id', async () => {
      await request(app.getHttpServer()).get('/users/invalid').expect(400);
    });
  });

  describe('PUT /users/:id', () => {
    const updateUserDto: UpdateUserDto = {
      firstName: 'Juan Carlos',
      phoneNumber: '+573009998888',
    };

    it('should update a user successfully', async () => {
      const updatedUser = {
        ...mockUserResponse,
        ...updateUserDto,
        fullName: 'Juan Carlos Pérez',
      };
      userService.updateUser.mockResolvedValue(updatedUser as any);

      const response = await request(app.getHttpServer())
        .put('/users/1')
        .send(updateUserDto)
        .expect(200);

      expect(response.body).toEqual({
        ...mockUserHttpResponse,
        firstName: 'Juan Carlos',
        phoneNumber: '+573009998888',
        fullName: 'Juan Carlos Pérez',
      });
      expect(userService.updateUser).toHaveBeenCalledWith(1, updateUserDto);
    });

    it('should return 404 when user not found', async () => {
      userService.updateUser.mockRejectedValue(
        new NotFoundException('User with ID 999 not found'),
      );

      await request(app.getHttpServer())
        .put('/users/999')
        .send(updateUserDto)
        .expect(404);
    });

    it('should return 400 for invalid data', async () => {
      const invalidDto = { email: 'invalid-email' };

      await request(app.getHttpServer())
        .put('/users/1')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user successfully', async () => {
      userService.deleteUser.mockResolvedValue(undefined);

      const response = await request(app.getHttpServer())
        .delete('/users/1')
        .expect(200);

      expect(response.body).toEqual({
        message: 'Usuario eliminado exitosamente',
        userId: 1,
        deletedAt: expect.any(String),
      });
      expect(userService.deleteUser).toHaveBeenCalledWith(1);
    });

    it('should return 404 when user not found', async () => {
      userService.deleteUser.mockRejectedValue(
        new NotFoundException('User with ID 999 not found'),
      );

      await request(app.getHttpServer()).delete('/users/999').expect(404);
    });

    it('should return 400 for invalid id', async () => {
      await request(app.getHttpServer()).delete('/users/invalid').expect(400);
    });
  });

  describe('POST /users/:id/movies/:movieId/mark-viewed', () => {
    const markMovieViewedDto = {
      rating: 5,
      review: 'Excelente película',
    };

    it('should mark a movie as viewed successfully', async () => {
      userService.markMovieAsViewed.mockResolvedValue(
        mockUserMovieResponse as any,
      );

      const response = await request(app.getHttpServer())
        .post('/users/1/movies/1/mark-viewed')
        .send(markMovieViewedDto)
        .expect(201);

      expect(response.body).toEqual(mockUserMovieHttpResponse);
      expect(userService.markMovieAsViewed).toHaveBeenCalledWith(
        1,
        1,
        expect.objectContaining({
          rating: 5,
          review: 'Excelente película',
        }),
      );
    });

    it('should return 404 when user not found', async () => {
      userService.markMovieAsViewed.mockRejectedValue(
        new NotFoundException('User with ID 999 not found'),
      );

      await request(app.getHttpServer())
        .post('/users/999/movies/1/mark-viewed')
        .send(markMovieViewedDto)
        .expect(404);
    });

    it('should return 400 for invalid user id', async () => {
      await request(app.getHttpServer())
        .post('/users/invalid/movies/1/mark-viewed')
        .send(markMovieViewedDto)
        .expect(400);
    });

    it('should return 400 for invalid movie id', async () => {
      await request(app.getHttpServer())
        .post('/users/1/movies/invalid/mark-viewed')
        .send(markMovieViewedDto)
        .expect(400);
    });
  });

  describe('GET /users/:id/movies', () => {
    it('should return user movies successfully', async () => {
      userService.getUserMovies.mockResolvedValue([
        mockUserMovieResponse,
      ] as any);

      const response = await request(app.getHttpServer())
        .get('/users/1/movies')
        .expect(200);

      expect(response.body).toEqual([mockUserMovieHttpResponse]);
      expect(userService.getUserMovies).toHaveBeenCalledWith(1, {
        onlyFavorites: false,
      });
    });

    it('should handle onlyFavorites parameter', async () => {
      userService.getUserMovies.mockResolvedValue([
        mockUserMovieResponse,
      ] as any);

      const response = await request(app.getHttpServer())
        .get('/users/1/movies?onlyFavorites=true')
        .expect(200);

      expect(response.body).toEqual([mockUserMovieHttpResponse]);
      expect(userService.getUserMovies).toHaveBeenCalledWith(1, {
        onlyFavorites: true,
      });
    });

    it('should return 404 when user not found', async () => {
      userService.getUserMovies.mockRejectedValue(
        new NotFoundException('User with ID 999 not found'),
      );

      await request(app.getHttpServer()).get('/users/999/movies').expect(404);
    });

    it('should return 400 for invalid user id', async () => {
      await request(app.getHttpServer())
        .get('/users/invalid/movies')
        .expect(400);
    });
  });
});
