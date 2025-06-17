import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IUserRepository,
  IUserMovieRepository,
} from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/user.entity';
import { UserMovie } from '../../domain/user-movie.entity';
import { UserEntity } from '../entities/user.entity';
import { UserMovieEntity } from '../entities/user-movie.entity';

interface UserWithMoviesResult {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;
  };
  movies: Array<{
    movie: {
      id: number;
      title: string;
      releaseDate: Date;
      duration: number;
      rating: string;
      poster?: string;
    };
    viewedAt: Date;
    rating?: number;
    review?: string;
    isFavorite: boolean;
    completedMovie: boolean;
  }>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(user: User): Promise<User> {
    const userEntity = this.userRepository.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      avatar: user.avatar,
      isActive: user.isActive,
    });

    const savedUser = await this.userRepository.save(userEntity);
    return this.mapEntityToDomain(savedUser);
  }

  async findById(id: number): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { id },
    });

    return userEntity ? this.mapEntityToDomain(userEntity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { email },
    });

    return userEntity ? this.mapEntityToDomain(userEntity) : null;
  }

  async findAll(): Promise<User[]> {
    const userEntities = await this.userRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });

    return userEntities.map((entity) => this.mapEntityToDomain(entity));
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id, {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      avatar: user.avatar,
      isActive: user.isActive,
    });

    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new Error('User not found after update');
    }

    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.update(id, { isActive: false });
  }

  private mapEntityToDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.firstName,
      entity.lastName,
      entity.email,
      entity.password,
      entity.phoneNumber,
      entity.dateOfBirth ? new Date(entity.dateOfBirth) : undefined,
      entity.avatar,
      entity.isActive,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}

@Injectable()
export class UserMovieRepository implements IUserMovieRepository {
  constructor(
    @InjectRepository(UserMovieEntity)
    private readonly userMovieRepository: Repository<UserMovieEntity>,
  ) {}

  async create(userMovie: UserMovie): Promise<UserMovie> {
    const userMovieEntity = this.userMovieRepository.create({
      userId: userMovie.userId,
      movieId: userMovie.movieId,
      rating: userMovie.rating,
      review: userMovie.review,
      isFavorite: userMovie.isFavorite,
      watchTime: userMovie.watchTime,
      completedMovie: userMovie.completedMovie,
    });

    const savedUserMovie = await this.userMovieRepository.save(userMovieEntity);
    return this.mapEntityToDomain(savedUserMovie);
  }

  async findByUserAndMovie(
    userId: number,
    movieId: number,
  ): Promise<UserMovie | null> {
    const userMovieEntity = await this.userMovieRepository.findOne({
      where: { userId, movieId },
    });

    return userMovieEntity ? this.mapEntityToDomain(userMovieEntity) : null;
  }

  async findByUserId(userId: number): Promise<UserMovie[]> {
    const userMovieEntities = await this.userMovieRepository.find({
      where: { userId },
      relations: ['movie'],
      order: { viewedAt: 'DESC' },
    });

    return userMovieEntities.map((entity) => this.mapEntityToDomain(entity));
  }

  async findUsersWithMovies(): Promise<UserWithMoviesResult[]> {
    const result = await this.userMovieRepository
      .createQueryBuilder('um')
      .innerJoinAndSelect('um.user', 'user')
      .innerJoinAndSelect('um.movie', 'movie')
      .innerJoinAndSelect('movie.category', 'category')
      .orderBy('user.firstName', 'ASC')
      .addOrderBy('um.viewedAt', 'DESC')
      .getMany();

    // Agrupar por usuario usando Map para mejor rendimiento
    const userMoviesMap = new Map<number, UserWithMoviesResult>();

    for (const userMovie of result) {
      const userId = userMovie.user.id;

      // Si el usuario no existe en el map, lo agregamos
      if (!userMoviesMap.has(userId)) {
        userMoviesMap.set(userId, {
          user: {
            id: userMovie.user.id,
            firstName: userMovie.user.firstName,
            lastName: userMovie.user.lastName,
            email: userMovie.user.email,
            fullName: userMovie.user.fullName,
          },
          movies: [],
        });
      }

      // Obtener el usuario del map (garantizado que existe)
      const userMovieData = userMoviesMap.get(userId)!;

      // Agregar la película a la lista del usuario
      userMovieData.movies.push({
        movie: {
          id: userMovie.movie.id,
          title: userMovie.movie.title,
          releaseDate: userMovie.movie.releaseDate,
          duration: userMovie.movie.duration,
          rating: userMovie.movie.rating,
          poster: userMovie.movie.poster,
        },
        viewedAt: userMovie.viewedAt,
        rating: userMovie.rating,
        review: userMovie.review,
        isFavorite: userMovie.isFavorite,
        completedMovie: userMovie.completedMovie,
      });
    }

    return Array.from(userMoviesMap.values());
  }

  private mapEntityToDomain(entity: UserMovieEntity): UserMovie {
    return new UserMovie(
      entity.id,
      entity.userId,
      entity.movieId,
      entity.viewedAt,
      entity.rating,
      entity.review,
      entity.isFavorite,
      entity.watchTime,
      entity.completedMovie,
    );
  }
}
