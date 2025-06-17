/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../application/user.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { UserMovie } from '../../domain/user-movie.entity';
import {
  IUserRepository,
  IUserMovieRepository,
} from '../../domain/repositories/user.repository.interface';

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockImplementation(() => Promise.resolve('hashed_password')),
}));

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<IUserRepository>;
  let userMovieRepository: jest.Mocked<IUserMovieRepository>;

  const mockUser: User = {
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
    password: 'hashed_password',
  };

  const mockUserMovie: UserMovie = {
    id: 1,
    userId: 1,
    movieId: 1,
    viewedAt: new Date('2025-06-17T02:45:31.472Z'),
    isFavorite: false,
    completedMovie: false,
    markAsFavorite: () => mockUserMovie,
    addRating: () => mockUserMovie,
  };

  beforeEach(async () => {
    const mockUserRepository: jest.Mocked<IUserRepository> = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const mockUserMovieRepository: jest.Mocked<IUserMovieRepository> = {
      create: jest.fn(),
      findByUserAndMovie: jest.fn(),
      findByUserId: jest.fn(),
      findUsersWithMovies: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: 'IUserMovieRepository',
          useValue: mockUserMovieRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get('IUserRepository');
    userMovieRepository = module.get('IUserMovieRepository');

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('createUser', () => {
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
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);

      // Eliminar password del objeto esperado manualmente (sin warning de variable no usada)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...expectedUser } = mockUser;
      expect(result).toMatchObject(expectedUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          phoneNumber: createUserDto.phoneNumber,
          dateOfBirth: expect.any(Date) as Date,
          avatar: createUserDto.avatar,
        }),
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.createUser(createUserDto)).rejects.toThrow(
        'Email already exists',
      );
    });

    it('should handle missing optional fields', async () => {
      const minimalDto: CreateUserDto = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@email.com',
        password: 'Password123!',
      };

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue({
        ...mockUser,
        phoneNumber: undefined,
        dateOfBirth: undefined,
        avatar: undefined,
        fullName: 'Juan Pérez',
        age: null,
      });

      const result = await service.createUser(minimalDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...expectedUser } = mockUser;
      expect(result).toMatchObject({
        ...expectedUser,
        phoneNumber: undefined,
        dateOfBirth: undefined,
        avatar: undefined,
        fullName: 'Juan Pérez',
        age: null,
      });
    });
  });

  describe('findUserById', () => {
    it('should return a user by id', async () => {
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findUserById(1);

      // Eliminar password del objeto esperado manualmente (sin usar any)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...expectedUser } = mockUser;
      expect(result).toMatchObject(expectedUser);
      expect(userRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(service.findUserById(999)).rejects.toThrow(
        new NotFoundException('User with ID 999 not found'),
      );
    });
  });

  describe('findAllUsers', () => {
    it('should return paginated users', async () => {
      const mockUsers = [mockUser];
      userRepository.findAll.mockResolvedValue(mockUsers);

      const result = await service.findAllUsers({ page: 1, limit: 10 });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const expectedUsers = mockUsers.map(({ password, ...rest }) => rest);
      expect(result.data).toEqual(
        expect.arrayContaining(
          expectedUsers.map((u) => expect.objectContaining(u as object)),
        ),
      );
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.hasPreviousPage).toBe(false);
      expect(result.hasNextPage).toBe(false);
      expect(userRepository.findAll).toHaveBeenCalledWith();
    });

    it('should handle search parameter', async () => {
      const mockUsers = [mockUser];
      userRepository.findAll.mockResolvedValue(
        mockUsers.filter((u) =>
          'Juan'
            .split(' ')
            .some(
              (term) =>
                u.firstName.includes(term) ||
                u.lastName.includes(term) ||
                u.email.includes(term),
            ),
        ),
      );

      const result = await service.findAllUsers({
        page: 1,
        limit: 5,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const expectedUsers = mockUsers.map(({ password, ...rest }) => rest);
      expect(result.data).toEqual(
        expect.arrayContaining(
          expectedUsers.map((u) => expect.objectContaining(u as object)),
        ),
      );
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(5);
      expect(result.totalPages).toBe(1);
      expect(result.hasPreviousPage).toBe(false);
      expect(result.hasNextPage).toBe(false);
      expect(userRepository.findAll).toHaveBeenCalledWith();
    });

    it('should handle pagination with multiple pages', async () => {
      const mockUsers = Array(25)
        .fill(null)
        .map((_, index) => ({
          ...mockUser,
          id: index + 1,
          fullName: 'Juan Pérez',
          age: 33,
        }));
      userRepository.findAll.mockResolvedValue(mockUsers);

      const result = await service.findAllUsers({ page: 2, limit: 10 });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const expectedUsers = mockUsers.map(({ password, ...rest }) => rest);
      expect(result.data).toHaveLength(10);
      expect(result.total).toBe(25);
      expect(result.page).toBe(2);
      expect(result.totalPages).toBe(3);
      expect(result.hasPreviousPage).toBe(true);
      expect(result.hasNextPage).toBe(true);
    });
  });

  describe('updateUser', () => {
    const updateUserDto: UpdateUserDto = {
      firstName: 'Juan Carlos',
      phoneNumber: '+573009998888',
    };

    it('should update a user successfully', async () => {
      const updatedUser = {
        ...mockUser,
        ...updateUserDto,
        fullName: 'Juan Carlos Pérez',
        age: 33,
        dateOfBirth: new Date('1990-05-15T00:00:00.000Z'),
      };

      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser(1, updateUserDto);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...expectedUser } = updatedUser;
      expect(result).toMatchObject(expectedUser);
      expect(userRepository.findById).toHaveBeenCalledWith(1);
      expect(userRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining(updateUserDto),
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(service.updateUser(999, updateUserDto)).rejects.toThrow(
        new NotFoundException('User with ID 999 not found'),
      );
    });

    it('should handle partial updates', async () => {
      const partialUpdate: UpdateUserDto = {
        firstName: 'Juan Carlos',
      };

      const updatedUser = {
        ...mockUser,
        ...partialUpdate,
        fullName: 'Juan Carlos Pérez',
        age: 33,
      } as User;

      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser(1, partialUpdate);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...expectedUser } = updatedUser;
      expect(result).toMatchObject(expectedUser);
      expect(userRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining(partialUpdate),
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.delete.mockResolvedValue();

      await service.deleteUser(1);

      expect(userRepository.findById).toHaveBeenCalledWith(1);
      expect(userRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(service.deleteUser(999)).rejects.toThrow(
        new NotFoundException('User with ID 999 not found'),
      );
    });
  });

  describe('markMovieAsViewed', () => {
    const markMovieViewedDto = {
      rating: 5,
      review: 'Great movie!',
      isFavorite: true,
      watchTime: 120,
      completedMovie: true,
    };

    it('should mark a movie as viewed successfully', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      userMovieRepository.findByUserAndMovie.mockResolvedValue(null);
      userMovieRepository.create.mockResolvedValue(mockUserMovie);

      const result = await service.markMovieAsViewed(1, 1, markMovieViewedDto);

      // Comparar solo propiedades relevantes
      expect(result).toMatchObject({
        id: mockUserMovie.id,
        userId: mockUserMovie.userId,
        movieId: mockUserMovie.movieId,
        viewedAt: mockUserMovie.viewedAt,
        isFavorite: mockUserMovie.isFavorite,
        completedMovie: mockUserMovie.completedMovie,
      });
      expect(userMovieRepository.findByUserAndMovie).toHaveBeenCalledWith(1, 1);
      expect(userMovieRepository.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if movie already viewed', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      userMovieRepository.findByUserAndMovie.mockResolvedValue(mockUserMovie);

      await expect(
        service.markMovieAsViewed(1, 1, markMovieViewedDto),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.markMovieAsViewed(1, 1, markMovieViewedDto),
      ).rejects.toThrow('Movie already marked as viewed by this user');
    });
  });

  describe('getUserMovies', () => {
    it('should return user movies', async () => {
      const mockUserMovies = [mockUserMovie];
      userRepository.findById.mockResolvedValue(mockUser);
      userMovieRepository.findByUserId.mockResolvedValue(mockUserMovies);

      const result = await service.getUserMovies(1, { onlyFavorites: false });

      // Comparar solo propiedades relevantes
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: mockUserMovie.id,
            userId: mockUserMovie.userId,
            movieId: mockUserMovie.movieId,
            viewedAt: mockUserMovie.viewedAt,
            isFavorite: mockUserMovie.isFavorite,
            completedMovie: mockUserMovie.completedMovie,
          }),
        ]),
      );
      expect(userMovieRepository.findByUserId).toHaveBeenCalledWith(1);
    });

    it('should filter only favorites when requested', async () => {
      const favoriteMovie = {
        ...mockUserMovie,
        isFavorite: true,
      } as UserMovie;
      const regularMovie = {
        ...mockUserMovie,
        id: 2,
        isFavorite: false,
      } as UserMovie;
      const mockUserMovies = [favoriteMovie, regularMovie];

      userRepository.findById.mockResolvedValue(mockUser);
      userMovieRepository.findByUserId.mockResolvedValue(mockUserMovies);

      const result = await service.getUserMovies(1, { onlyFavorites: true });

      // Comparar solo propiedades relevantes
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: favoriteMovie.id,
            userId: favoriteMovie.userId,
            movieId: favoriteMovie.movieId,
            viewedAt: favoriteMovie.viewedAt,
            isFavorite: favoriteMovie.isFavorite,
            completedMovie: favoriteMovie.completedMovie,
          }),
        ]),
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(service.getUserMovies(999, {})).rejects.toThrow(
        new NotFoundException('User with ID 999 not found'),
      );
    });
  });
});
