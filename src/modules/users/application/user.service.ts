import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {
  IUserRepository,
  IUserMovieRepository,
} from '../domain/repositories/user.repository.interface';
import { User } from '../domain/user.entity';
import { UserMovie } from '../domain/user-movie.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userMovieRepository: IUserMovieRepository,
  ) {}

  async create(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber?: string,
    dateOfBirth?: Date,
    avatar?: string,
  ): Promise<User> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = User.create(
      firstName,
      lastName,
      email,
      hashedPassword,
      phoneNumber,
      dateOfBirth,
      avatar,
    );
    return this.userRepository.create(user);
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async markMovieAsViewed(userId: number, movieId: number): Promise<UserMovie> {
    // Verificar que el usuario existe
    await this.findById(userId);

    // Verificar si ya marcó la película como vista
    const existingUserMovie = await this.userMovieRepository.findByUserAndMovie(
      userId,
      movieId,
    );
    if (existingUserMovie) {
      throw new Error('Movie already marked as viewed by this user');
    }

    const userMovie = UserMovie.create(userId, movieId);
    return this.userMovieRepository.create(userMovie);
  }

  async getUsersWithViewedMovies() {
    return this.userMovieRepository.findUsersWithMovies();
  }

  async getUserViewedMovies(userId: number) {
    return this.userMovieRepository.findByUserId(userId);
  }
}
