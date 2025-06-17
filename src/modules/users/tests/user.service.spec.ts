import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../application/user.service';
import { User } from '../domain/user.entity';
import { UserMovie } from '../domain/user-movie.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { MarkMovieAsViewedDto } from '../dto/mark-movie-viewed.dto';
import {
  IUserRepository,
  IUserMovieRepository,
} from '../domain/repositories/user.repository.interface';

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockUserMovieRepository: jest.Mocked<IUserMovieRepository>;

  const mockUser = new User(
    1,
    'John',
    'Doe',
    'john@example.com',
    'hashedPassword',
    '+1234567890',
    new Date('1990-01-01'),
    'https://example.com/avatar.jpg',
    true,
    new Date(),
    new Date(),
  );

  const mockUserMovie = new UserMovie(
    1,
    1,
    1,
    new Date(),
    4.5,
    'Great movie!',
    true,
    120,
    true,
  );
  mockUserMovie.markAsFavorite = jest.fn();
  mockUserMovie.addRating = jest.fn();

  beforeEach(async () => {
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockUserMovieRepository = {
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

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      phoneNumber: '+1234567890',
      dateOfBirth: '1990-01-01',
      avatar: 'https://example.com/avatar.jpg',
    };

    it('should create a user successfully', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'john@example.com',
      );
      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(result).toMatchObject({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'john@example.com',
      );
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findUserById', () => {
    it('should return a user when found', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findUserById(1);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toMatchObject({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.findUserById(999)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('findAllUsers', () => {
    it('should return paginated users', async () => {
      mockUserRepository.findAll.mockResolvedValue([mockUser]);

      const result = await service.findAllUsers({ page: 1, limit: 10 });

      expect(mockUserRepository.findAll).toHaveBeenCalled();
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

    it('should handle pagination correctly', async () => {
      const users = Array(25)
        .fill(null)
        .map(
          (_, index) =>
            new User(
              index + 1,
              'John',
              'Doe',
              'john@example.com',
              'hashedPassword',
              '+1234567890',
              new Date('1990-01-01'),
              'https://example.com/avatar.jpg',
              true,
              new Date(),
              new Date(),
            ),
        );
      mockUserRepository.findAll.mockResolvedValue(users); // Retorna los 25 usuarios

      const result = await service.findAllUsers({ page: 2, limit: 10 });

      expect(result.data).toHaveLength(25); // El mock retorna todos, así que length es 25
      expect(result.page).toBe(2);
      expect(result.totalPages).toBe(3);
      expect(result.hasPreviousPage).toBe(true);
      expect(result.hasNextPage).toBe(true);
    });
  });

  describe('updateUser', () => {
    const updateUserDto: UpdateUserDto = {
      firstName: 'Jane',
      lastName: 'Smith',
    };

    it('should update a user successfully', async () => {
      const updatedUser = new User(
        1,
        'Jane',
        'Smith',
        'john@example.com',
        'hashedPassword',
        '+1234567890',
        new Date('1990-01-01'),
        'https://example.com/avatar.jpg',
        true,
        new Date(),
        new Date(),
      );
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser(1, updateUserDto);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(mockUserRepository.update).toHaveBeenCalled();
      expect(result.firstName).toBe('Jane');
      expect(result.lastName).toBe('Smith');
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.updateUser(999, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(999);
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when updating to existing email', async () => {
      const updateWithEmail: UpdateUserDto = {
        email: 'existing@example.com',
      };

      const anotherUser = new User(
        2,
        'John',
        'Doe',
        'existing@example.com',
        'hashedPassword',
        '+1234567890',
        new Date('1990-01-01'),
        'https://example.com/avatar.jpg',
        true,
        new Date(),
        new Date(),
      );
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.findByEmail.mockResolvedValue(anotherUser);

      await expect(service.updateUser(1, updateWithEmail)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'existing@example.com',
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.delete.mockResolvedValue(undefined);

      await service.deleteUser(1);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.deleteUser(999)).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(999);
      expect(mockUserRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('markMovieAsViewed', () => {
    const markMovieDto: MarkMovieAsViewedDto = {
      rating: 4.5,
      review: 'Great movie!',
      isFavorite: true,
      watchTime: 120,
      completedMovie: true,
    };

    it('should mark movie as viewed successfully', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserMovieRepository.findByUserAndMovie.mockResolvedValue(null);
      mockUserMovieRepository.create.mockResolvedValue(mockUserMovie);

      const result = await service.markMovieAsViewed(1, 1, markMovieDto);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(mockUserMovieRepository.findByUserAndMovie).toHaveBeenCalledWith(
        1,
        1,
      );
      expect(mockUserMovieRepository.create).toHaveBeenCalled();
      expect(result).toMatchObject({
        userId: 1,
        movieId: 1,
        rating: 4.5,
        review: 'Great movie!',
        isFavorite: true,
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        service.markMovieAsViewed(999, 1, markMovieDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(999);
      expect(mockUserMovieRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when movie already marked as viewed', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserMovieRepository.findByUserAndMovie.mockResolvedValue(
        mockUserMovie,
      );

      await expect(
        service.markMovieAsViewed(1, 1, markMovieDto),
      ).rejects.toThrow(ConflictException);
      expect(mockUserMovieRepository.findByUserAndMovie).toHaveBeenCalledWith(
        1,
        1,
      );
      expect(mockUserMovieRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getUserMovies', () => {
    it('should return user movies', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserMovieRepository.findByUserId.mockResolvedValue([mockUserMovie]);

      const result = await service.getUserMovies(1, { onlyFavorites: false });

      expect(result).toEqual([mockUserMovie]);
    });

    it('should filter only favorites when requested', async () => {
      const favoriteMovie = new UserMovie(
        1,
        1,
        1,
        new Date(),
        4.5,
        'Great movie!',
        true,
        120,
        true,
      );
      favoriteMovie.markAsFavorite = jest.fn();
      favoriteMovie.addRating = jest.fn();
      const regularMovie = new UserMovie(
        2,
        1,
        2,
        new Date(),
        4.5,
        'Great movie!',
        false,
        120,
        true,
      );
      regularMovie.markAsFavorite = jest.fn();
      regularMovie.addRating = jest.fn();
      const mockUserMovies = [favoriteMovie, regularMovie];

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserMovieRepository.findByUserId.mockResolvedValue(mockUserMovies);

      const result = await service.getUserMovies(1, { onlyFavorites: true });

      expect(result).toEqual([favoriteMovie]);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.getUserMovies(999, {})).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(999);
      expect(mockUserMovieRepository.findByUserId).not.toHaveBeenCalled();
    });
  });

  describe('getUsersWithMovies', () => {
    it('should return users with their movies', async () => {
      const mockUsersWithMovies = [
        {
          user: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            fullName: 'John Doe',
          },
          movies: [mockUserMovie],
        },
      ];

      mockUserMovieRepository.findUsersWithMovies.mockResolvedValue(
        mockUsersWithMovies,
      );

      const result = await service.getUsersWithMovies();

      expect(mockUserMovieRepository.findUsersWithMovies).toHaveBeenCalled();
      expect(result).toEqual(mockUsersWithMovies);
    });
  });
});
