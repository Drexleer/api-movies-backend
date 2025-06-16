import { User } from '../user.entity';
import { UserMovie } from '../user-movie.entity';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: number, user: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
}

export interface IUserMovieRepository {
  create(userMovie: UserMovie): Promise<UserMovie>;
  findByUserAndMovie(
    userId: number,
    movieId: number,
  ): Promise<UserMovie | null>;
  findByUserId(userId: number): Promise<UserMovie[]>;
  findUsersWithMovies(): Promise<any[]>;
}
