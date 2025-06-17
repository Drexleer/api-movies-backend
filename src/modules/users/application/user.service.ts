import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {
  IUserRepository,
  IUserMovieRepository,
} from '../domain/repositories/user.repository.interface';
import { User } from '../domain/user.entity';
import { UserMovie } from '../domain/user-movie.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { MarkMovieAsViewedDto } from '../dto/mark-movie-viewed.dto';
import { UserMovieResponseDto } from '../dto/user-movie-response.dto';
import { PaginatedResponseDto } from '../../../shared/dto/paginated-response.dto';

interface PaginationOptions {
  page: number;
  limit: number;
}

interface UserMovieFilters {
  onlyFavorites?: boolean;
}

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IUserMovieRepository')
    private readonly userMovieRepository: IUserMovieRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = User.create(
      createUserDto.firstName,
      createUserDto.lastName,
      createUserDto.email,
      hashedPassword,
      createUserDto.phoneNumber,
      createUserDto.dateOfBirth
        ? new Date(createUserDto.dateOfBirth)
        : undefined,
      createUserDto.avatar,
    );

    const savedUser = await this.userRepository.create(user);
    return this.mapUserToResponseDto(savedUser);
  }

  async findUserById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return this.mapUserToResponseDto(user);
  }

  async findAllUsers(
    options: PaginationOptions,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const users = await this.userRepository.findAll();
    const userDtos = users.map((user) => this.mapUserToResponseDto(user));

    // Implementar paginación simple
    const { page, limit } = options;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = userDtos.slice(startIndex, endIndex);

    return {
      data: paginatedUsers,
      total: userDtos.length,
      page,
      limit,
      totalPages: Math.ceil(userDtos.length / limit),
      hasPreviousPage: page > 1,
      hasNextPage: page < Math.ceil(userDtos.length / limit),
    };
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Si se actualiza el email, verificar que no exista otro usuario con ese email
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(
        updateUserDto.email,
      );
      if (userWithEmail) {
        throw new Error('Email already exists');
      }
    }

    const updatedUser = await this.userRepository.update(id, updateUserDto);
    return this.mapUserToResponseDto(updatedUser);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    await this.userRepository.delete(id);
  }

  async markMovieAsViewed(
    userId: number,
    movieId: number,
    markMovieViewedDto: MarkMovieAsViewedDto,
  ): Promise<UserMovieResponseDto> {
    // Verificar que el usuario existe
    await this.findUserById(userId);

    // Verificar si ya marcó la película como vista
    const existingUserMovie = await this.userMovieRepository.findByUserAndMovie(
      userId,
      movieId,
    );
    if (existingUserMovie) {
      throw new Error('Movie already marked as viewed by this user');
    }

    const userMovie = UserMovie.create(
      userId,
      movieId,
      markMovieViewedDto.rating,
      markMovieViewedDto.review,
      markMovieViewedDto.isFavorite,
      markMovieViewedDto.watchTime,
      markMovieViewedDto.completedMovie,
    );

    const savedUserMovie = await this.userMovieRepository.create(userMovie);
    return this.mapUserMovieToResponseDto(savedUserMovie);
  }

  async getUserMovies(
    userId: number,
    filters: UserMovieFilters,
  ): Promise<UserMovieResponseDto[]> {
    // Verificar que el usuario existe
    await this.findUserById(userId);

    const userMovies = await this.userMovieRepository.findByUserId(userId);

    // Aplicar filtros
    let filteredMovies = userMovies;
    if (filters.onlyFavorites) {
      filteredMovies = userMovies.filter((um) => um.isFavorite);
    }

    return filteredMovies.map((um) => this.mapUserMovieToResponseDto(um));
  }

  async getUsersWithMovies(): Promise<any[]> {
    return await this.userMovieRepository.findUsersWithMovies();
  }

  // Métodos privados para mapeo
  private mapUserToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id as number,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      avatar: user.avatar,
      isActive: user.isActive,
      fullName: user.fullName,
      age: user.age ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      password: user.password, // Se excluirá automáticamente
    };
  }

  private mapUserMovieToResponseDto(
    userMovie: UserMovie,
  ): UserMovieResponseDto {
    return {
      id: userMovie.id as number,
      userId: userMovie.userId,
      movieId: userMovie.movieId,
      viewedAt: userMovie.viewedAt,
      rating: userMovie.rating,
      review: userMovie.review,
      isFavorite: userMovie.isFavorite,
      watchTime: userMovie.watchTime,
      completedMovie: userMovie.completedMovie,
    };
  }

  // Métodos legacy para mantener compatibilidad
  async create(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber?: string,
    dateOfBirth?: Date,
    avatar?: string,
  ): Promise<User> {
    const createUserDto: CreateUserDto = {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      dateOfBirth: dateOfBirth?.toISOString().split('T')[0],
      avatar,
    };

    const userResponse = await this.createUser(createUserDto);
    return (await this.userRepository.findById(userResponse.id)) as User;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUsersWithViewedMovies(): Promise<any[]> {
    return this.getUsersWithMovies();
  }

  async getUserViewedMovies(userId: number): Promise<UserMovieResponseDto[]> {
    return this.getUserMovies(userId, {});
  }
}
